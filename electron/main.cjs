// Desktop shell for Global Time Matrix.
//
// Loads the exact same static build that ships on the web (dist/), from
// disk, so the desktop app is fully offline. No remote content is ever
// loaded; navigation away from the bundled app is blocked.

const { app, BrowserWindow, shell, nativeTheme } = require("electron");
const path = require("node:path");

const INDEX = path.join(__dirname, "..", "dist", "index.html");

function createWindow() {
  const win = new BrowserWindow({
    width: 1160,
    height: 820,
    minWidth: 380,
    minHeight: 480,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#0e1014" : "#f5f4f0",
    title: "Global Time Matrix",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(INDEX);

  // External links open in the user's real browser, never in-app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://")) {
      e.preventDefault();
      if (url.startsWith("http")) shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
