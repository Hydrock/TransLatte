const fs = require('fs');
const path = require("path");
const { app, BrowserWindow, globalShortcut } = require("electron");

const settingsPath = path.join(app.getPath('userData'), 'settings.json');
const defaultSettings = { width: 500, height: 600 };
const toggleShortcut = process.platform === 'darwin' ? 'Cmd+Option+Shift+T' : 'Ctrl+Alt+Shift+T'

function loadSettings() {
    try {
        const data = fs.readFileSync(settingsPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return defaultSettings;
    }
}

function saveSettings(settings) {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
    } catch (err) {
        console.error("Ошибка при сохранении настроек:", err);
    }
}

const is_mac = process.platform === 'darwin'

if (is_mac) {
    app.dock.hide();
}

function createClapWindow() {
    const { width, height } = loadSettings();
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
        saveSettings({ width, height });
    });
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.loadFile('public/reaction.html');

    /* Включаем DevTools */
    // mainWindow.webContents.openDevTools();

    return mainWindow;
}
app.whenReady().then(() => {
    const mainWindow = createClapWindow()

    globalShortcut.register(toggleShortcut, () => {
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
