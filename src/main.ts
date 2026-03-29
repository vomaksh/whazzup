import {
  App,
  app,
  BrowserWindow,
  DownloadItem,
  Menu,
  Notification,
  session,
  shell,
  Tray,
} from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { existsSync } from "node:fs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const WHATSAPP_WEB_URL = "https://web.whatsapp.com";
const WHATSAPP_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";
let tray: Tray = null;
let isQuitting = false;

function injectCSS(mainWindow: BrowserWindow) {
  mainWindow.webContents.insertCSS(`
    :root {
      --font-family-monospace: 'Google Sans Code', Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, Courier, monospace !important;
    }
    body {
      font-family: 'Google Sans',Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif !important;
    }
    .xdounpk {
      font-family: Google Sans,Helvetica Neue, Helvetica, Arial, sans-serif !important;
    }
  `);
}

function getAssetPath(...paths: string[]) {
  const devMode = !app.isPackaged;
  const resourcesPath = devMode
    ? path.join(app.getAppPath(), "assets")
    : path.join(process.resourcesPath, "assets");
  return path.join(resourcesPath, ...paths);
}

function openDownloadedFile(item: DownloadItem, filePath: string) {
  const mime = item.getMimeType();
  if (
    mime.startsWith("image/") ||
    mime === "application/pdf" ||
    mime.startsWith("video/")
  ) {
    shell.openPath(filePath);
  } else {
    shell.showItemInFolder(filePath);
  }
}

function createWindow() {
  if (!app.requestSingleInstanceLock()) {
    console.log("Application instance is already running. Quitting....");
    app.quit();
    return;
  }

  Menu.setApplicationMenu(null);

  const appPartition = "persist:whatsapp";

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    alwaysOnTop: true,
    icon: getAssetPath("icons", "app.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      partition: appPartition,
    },
  });

  const winSession = session.fromPartition(appPartition);

  winSession.on("will-download", (e, item) => {
    const fileName = item.getFilename();
    const savePath = path.join(app.getPath("downloads"), fileName);

    if (existsSync(savePath)) {
      e.preventDefault();
      openDownloadedFile(item, savePath);
    } else {
      item.setSavePath(savePath);
      item.once("done", (e, state) => {
        if (state === "completed") {
          new Notification({
            title: `Download completed`,
            body: `${fileName}`,
          }).show();
          openDownloadedFile(item, savePath);
        }
      });
    }
  });

  mainWindow.loadURL(WHATSAPP_WEB_URL, {
    userAgent: WHATSAPP_USER_AGENT,
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(WHATSAPP_WEB_URL)) {
      return { action: "allow" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("dom-ready", () => injectCSS(mainWindow));
  mainWindow.webContents.on("did-finish-load", () => injectCSS(mainWindow));

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({
      mode: "bottom",
    });
  }

  setupTray(app, mainWindow);

  mainWindow.on("show", () => {
    setupTrayContextMenu(app, mainWindow, tray);
  });

  mainWindow.on("hide", () => {
    setupTrayContextMenu(app, mainWindow, tray);
  });

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function setupTrayContextMenu(app: App, mainWindow: BrowserWindow, tray: Tray) {
  const windowVisible = mainWindow.isVisible();
  const contextMenu = Menu.buildFromTemplate([
    {
      label: windowVisible ? "Hide" : "Show",
      click: () => (windowVisible ? mainWindow.hide() : mainWindow.show()),
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

function setupTray(app: App, mainWindow: BrowserWindow) {
  tray = new Tray(getAssetPath("icons", "tray.png"));
  setupTrayContextMenu(app, mainWindow, tray);
  tray.setToolTip("WhatsApp");
  tray.on("click", function () {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // Do nothing
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
