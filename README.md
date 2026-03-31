# WhazzUp

> This project is not affiliated with or endorsed by WhatsApp or Meta.

A minimal Electron wrapper for WhatsApp Web for Linux.

## Features

- Runs WhatsApp Web in a dedicated desktop window
- System tray support

## Todos

- [x] Add dependabot which alerts for package updates
- [x] Build and release package updates via GitHub Actions
- [x] Config file support for overriding supported settings
- [ ] Global keyboard shortcuts for bringing app to focus
- [ ] Relaunching already launched app should bring app to focus

## Development

```sh
git clone https://github.com/vomaksh/whazzup.git
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
