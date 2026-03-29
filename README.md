# WazzUp

> This project is not affiliated with or endorsed by WhatsApp or Meta.

A minimal Electron wrapper for WhatsApp Web for Linux.

## Features

- Runs WhatsApp Web in a dedicated desktop window
- System tray support

## Todos

- [ ] Add dependabot which alerts for latest releases for electron
- [ ] Build and release package updates via GitHub Actions
- [ ] Config file support for overriding supported settings
- [ ] Global keyboard shortcuts for bringing app to focus
- [ ] Relaunching already launched app should bring app to focus

## Development

```sh
git clone https://github.com/vomaksh/wazzup.git
cd wazzup
pnpm install
pnpm start
```

## Build

```sh
pnpm make
```

## License

Licensed under the [GPL-3 license](./LICENSE.md).
