# Windows 95 Themes

A collection of faithful Windows 95-styled themes for web apps.

> [!NOTE]
> These themes do not try to recreate previously existing programs (i.e. IE for Firefox), only the style and layout.

## Available Themes

Pick a theme to see the manual installation guide, screenshots, etc.

- [Discord](./docs/discord.md)
- [Firefox](./docs/firefox.md)
- [Steam](./docs/steam.md)
- [Visual Studio Code](./docs/vscode.md)

## Installing

```sh
curl -fsSL https://raw.githubusercontent.com/ricewind012/win95-themes/refs/heads/master/scripts/install | sh -s -- app
```

Replace `app` with one of: discord, firefox, steam, vscode

Pass `-p` after `--` to apply patches to the app, if any.

## Building

```sh
npm i
npm run build steam # discord/steam/vscode
# or for firefox:
npm run build firefox agent/author/global
```
