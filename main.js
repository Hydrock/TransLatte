const Store = require('electron-store').default;
const store = new Store();
const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const is_mac = process.platform === 'darwin'

if (is_mac) {
    app.dock.hide()                                     // - 1 - 
}

function createClapWindow() {
    const width = store.get('width', 500);
    const height = store.get('height', 600);
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width,
        height,
        icon: path.join(__dirname, 'assets/icon.icns'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true // ✅ ОБЯЗАТЕЛЬНО!
        }
    })
    mainWindow.on('resize', () => {
        const [width, height] = mainWindow.getSize();
        store.set('width', width);
        store.set('height', height);
    });
    mainWindow.setAlwaysOnTop(true, "screen-saver")     // - 2 -
    mainWindow.setVisibleOnAllWorkspaces(true)          // - 3 -
    mainWindow.loadFile('public/reaction.html')

    return mainWindow;
}
app.whenReady().then(() => {
    const mainWindow = createClapWindow()

    globalShortcut.register('Cmd+Option+Shift+T', () => {
        if (!mainWindow) return;
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });
    console.log("Shortcut registered?", success);
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
