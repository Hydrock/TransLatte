const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require("path");
const { app, BrowserWindow, globalShortcut } = require("electron");

const dbPath = path.join(app.getPath('userData'), 'settings.json');
const adapter = new FileSync(dbPath);

const db = low(adapter);
db.defaults({ width: 500, height: 600 }).write();
const is_mac = process.platform === 'darwin'

if (is_mac) {
    app.dock.hide()                                     // - 1 - 
}

function createClapWindow() {
    const width = db.get('width').value();
    const height = db.get('height').value();
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width,
        height,
        icon: path.join(__dirname, 'assets/icon.icns'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webviewTag: true // ✅ ОБЯЗАТЕЛЬНО!
        }
    })
    mainWindow.on('resize', () => {
        const [width, height] = mainWindow.getSize();
        db.set('width', width).write();
        db.set('height', height).write();
    });
    mainWindow.setAlwaysOnTop(true, "screen-saver")     // - 2 -
    mainWindow.setVisibleOnAllWorkspaces(true)          // - 3 -
    mainWindow.loadFile('public/reaction.html')

    /* Включаем DevTools */
    // mainWindow.webContents.openDevTools();

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
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
