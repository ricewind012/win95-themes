# Visual Studio Code

Last tested version is [1.92](https://code.visualstudio.com/updates/v1_92)!

## Usage

1. Install the [Apc Customize UI++](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension) extension.
2. Add to `settings.json` (Preferences: Open User Settings (JSON)) the following:

```json
"apc.imports": [
    "file:///path/to/dist/vscode/vscode.css",
    "file:///path/to/dist/vscode/vscode.js",
],
"apc.iframe.style": "/path/to/dist/vscode/vscode.css",

"apc.listRow": {
    "height": 16
},
"apc.header": {
    "height": 63
},

"editor.scrollbar.arrowSize": 16,
"editor.scrollbar.verticalHasArrows": true,
"editor.scrollbar.horizontalHasArrows": true,

"terminal.integrated.cursorStyle": "underline",
"terminal.integrated.fontFamily": "Less Perfect DOS VGA",
"terminal.integrated.fontSize": 12,

"window.titleBarStyle": "custom",
"window.dialogStyle": "custom",

"workbench.editor.tabSizing": "shrink",
"workbench.editor.wrapTabs": true,
```

## Caveats

- [Scrollbars arrows](https://github.com/microsoft/vscode/issues/130616#issuecomment-1076061821) are undocumented and may be removed at any time.
- Editor and scrollbars may move out of bounds.
- Some icons are absent.

## Preview

![Main Window](../img/vscode.png)
