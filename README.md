# Windows 95 themes

A collection of Windows 95-styled themes. Note that they do _not_ try to recreate previously existing programs (i.e. IE for Firefox), only the style and layout.

## Current themes

Click a link for the manual installation guide, preview, etc.

- [Discord](./docs/discord.md)
- [Firefox](./docs/firefox.md)
- [Steam](./docs/steam.md)
- [Visual Studio Code](./docs/vscode.md)

## Installing

```sh
curl -fsSL https://raw.githubusercontent.com/ricewind012/win95-themes/refs/heads/master/scripts/install | sh -s -- discord # firefox/steam/vscode
```

Pass `-p` after `--` to apply patches to the app, if any.

## Building

```sh
$ npm i
$ npm run build steam # discord/steam/vscode
# for firefox specifically:
$ npm run build firefox agent/author/global
```
