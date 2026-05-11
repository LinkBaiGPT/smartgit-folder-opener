# Open repository in SmartGit

Open repository in SmartGit is a local VS Code-compatible extension stored under `utils/smartgit-context-menu`.

It adds an Explorer context menu command:

```text
SmartGit: Open repository in SmartGit
```

## Features

- Right-click a folder and open the nearest parent Git repository in SmartGit.
- Right-click a file and open the nearest parent Git repository from its containing folder.
- If no Git repository is found, optionally open the selected folder directly in SmartGit.
- Works on Windows and macOS.

## Platform Defaults

When `smartgitFolderOpener.executablePath` is empty, the extension uses these defaults:

| Platform | Launch behavior |
| --- | --- |
| Windows | `C:\Program Files\SmartGit\bin\smartgit.exe --open <path>` |
| macOS | `open -a SmartGit --args --open <path>` |

If SmartGit is installed somewhere else, set `smartgitFolderOpener.executablePath` manually.

Examples:

```json
{
  "smartgitFolderOpener.executablePath": "D:\\Apps\\SmartGit\\bin\\smartgit.exe"
}
```

```json
{
  "smartgitFolderOpener.executablePath": "/Applications/SmartGit.app"
}
```

## Settings

```json
{
  "smartgitFolderOpener.executablePath": "",
  "smartgitFolderOpener.openSelectedFolderWhenNoGitRoot": true
}
```

- `smartgitFolderOpener.executablePath`: Optional SmartGit executable path. Leave it empty to use the platform default.
- `smartgitFolderOpener.openSelectedFolderWhenNoGitRoot`: When enabled, the selected folder is opened even if no Git root is found.

## Build

Run these commands from this extension directory:

```powershell
cd utils\smartgit-context-menu
npx --yes @vscode/vsce package
```

The command generates a `.vsix` package, for example:

```text
smartgit-folder-opener-0.0.3.vsix
```

## Install Locally

Install into Antigravity:

```powershell
antigravity --install-extension .\smartgit-folder-opener-0.0.3.vsix --force
```

Install into VS Code:

```powershell
code --install-extension .\smartgit-folder-opener-0.0.3.vsix --force
```

Install into Cursor:

```powershell
cursor --install-extension .\smartgit-folder-opener-0.0.3.vsix --force
```

On macOS, use the same commands from a shell where the target editor command is available.

## Notes

- The extension checks for `.git` folders and Git worktree `.git` files.
- The selected path must exist on disk.
- On macOS, leaving the executable path empty is usually the most portable option because `open -a SmartGit` lets macOS locate the app.
