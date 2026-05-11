# Open repository in SmartGit

Open repository in SmartGit 是一个 VS Code 兼容扩展，可在资源管理器右键菜单中用 SmartGit 打开选中的 Git 仓库。

它会在资源管理器右键菜单中增加命令：

```text
SmartGit: Open repository in SmartGit
```

## 功能

- 右键文件夹时，自动向上查找最近的 Git 仓库根目录并用 SmartGit 打开。
- 右键文件时，从该文件所在目录开始向上查找最近的 Git 仓库根目录。
- 找不到 Git 仓库时，可以选择仍然用 SmartGit 打开当前选中的文件夹。
- 支持 Windows 和 macOS。

## 平台默认行为

当 `smartgitFolderOpener.executablePath` 为空时，扩展会自动使用以下默认启动方式：

| 平台 | 启动方式 |
| --- | --- |
| Windows | `C:\Program Files\SmartGit\bin\smartgit.exe --open <path>` |
| macOS | `open -a SmartGit --args --open <path>` |

如果 SmartGit 安装在其他位置，可以手动设置 `smartgitFolderOpener.executablePath`。

Windows 示例：

```json
{
  "smartgitFolderOpener.executablePath": "D:\\Apps\\SmartGit\\bin\\smartgit.exe"
}
```

macOS 示例：

```json
{
  "smartgitFolderOpener.executablePath": "/Applications/SmartGit.app"
}
```

## 配置项

```json
{
  "smartgitFolderOpener.executablePath": "",
  "smartgitFolderOpener.openSelectedFolderWhenNoGitRoot": true
}
```

- `smartgitFolderOpener.executablePath`：可选的 SmartGit 可执行文件路径。留空时使用平台默认方式。
- `smartgitFolderOpener.openSelectedFolderWhenNoGitRoot`：找不到 Git 仓库根目录时，是否仍然打开当前选中的文件夹。

## 打包

在克隆后的扩展仓库根目录执行：

```powershell
npx --yes @vscode/vsce package
```

打包后会生成 `.vsix` 文件，例如：

```text
smartgit-folder-opener-0.0.6.vsix
```

## 本地安装

安装到 Antigravity：

```powershell
antigravity --install-extension .\smartgit-folder-opener-0.0.6.vsix --force
```

安装到 VS Code：

```powershell
code --install-extension .\smartgit-folder-opener-0.0.6.vsix --force
```

安装到 Cursor：

```powershell
cursor --install-extension .\smartgit-folder-opener-0.0.6.vsix --force
```

macOS 也可以使用同样命令，只要当前 shell 能访问对应编辑器命令即可。

## 说明

- 扩展会识别普通 `.git` 目录，也会识别 Git worktree 使用的 `.git` 文件。
- 选中的路径必须真实存在。
- macOS 下通常建议保持 `smartgitFolderOpener.executablePath` 为空，让系统通过 `open -a SmartGit` 自动定位应用。
