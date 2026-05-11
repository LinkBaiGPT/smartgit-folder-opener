const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const vscode = require("vscode");

const DEFAULT_SMARTGIT_EXE = "C:\\Program Files\\SmartGit\\bin\\smartgit.exe";
const SMARTGIT_APP_NAME = "SmartGit";

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "smartgitFolderOpener.openInSmartGit",
    async (uri) => {
      try {
        await openInSmartGit(uri);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to open SmartGit: ${message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function openInSmartGit(uri) {
  const selectedPath = await resolveSelectedPath(uri);
  const config = vscode.workspace.getConfiguration("smartgitFolderOpener");

  const gitRoot = findGitRoot(selectedPath);
  const openSelectedFolder = config.get("openSelectedFolderWhenNoGitRoot", true);
  const targetPath = gitRoot || (openSelectedFolder ? selectedPath : undefined);

  if (!targetPath) {
    throw new Error(`No Git repository was found from: ${selectedPath}`);
  }

  const launch = resolveSmartGitLaunch(config);
  const child = spawn(launch.command, [...launch.args, "--open", targetPath], {
    cwd: targetPath,
    detached: true,
    stdio: "ignore"
  });

  child.on("error", (error) => {
    vscode.window.showErrorMessage(`Failed to launch SmartGit: ${error.message}`);
  });

  child.unref();
}

function resolveSmartGitLaunch(config) {
  const executablePath = config.get("executablePath", "").trim();

  if (process.platform === "darwin") {
    if (!executablePath) {
      return {
        command: "open",
        args: ["-a", SMARTGIT_APP_NAME, "--args"]
      };
    }

    if (executablePath.toLowerCase().endsWith(".app")) {
      return {
        command: "open",
        args: [executablePath, "--args"]
      };
    }

    ensureExecutableExists(executablePath);
    return {
      command: executablePath,
      args: []
    };
  }

  const command = executablePath || DEFAULT_SMARTGIT_EXE;
  ensureExecutableExists(command);

  return {
    command,
    args: []
  };
}

function ensureExecutableExists(executablePath) {
  if (!fs.existsSync(executablePath)) {
    throw new Error(`SmartGit executable was not found: ${executablePath}`);
  }
}

async function resolveSelectedPath(uri) {
  if (uri && uri.fsPath) {
    return resolveDirectoryForGitSearch(uri.fsPath);
  }

  const folder = vscode.workspace.workspaceFolders?.[0];
  if (folder) {
    return resolveDirectoryForGitSearch(folder.uri.fsPath);
  }

  throw new Error("No folder was selected and no workspace is open.");
}

function resolveDirectoryForGitSearch(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Path does not exist: ${filePath}`);
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    return path.resolve(filePath);
  }

  return path.dirname(path.resolve(filePath));
}

function findGitRoot(startPath) {
  let current = path.resolve(startPath);

  while (true) {
    if (isGitRoot(current)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return undefined;
    }

    current = parent;
  }
}

function isGitRoot(directory) {
  const dotGit = path.join(directory, ".git");
  if (!fs.existsSync(dotGit)) {
    return false;
  }

  const stat = fs.statSync(dotGit);
  return stat.isDirectory() || stat.isFile();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
