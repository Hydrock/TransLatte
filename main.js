const fs = require('fs');
const path = require("path");
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");

const defaultShortcut = process.platform === 'darwin' ? 'Cmd+Option+Shift+T' : 'Ctrl+Alt+Shift+T';
const defaultSettings = { width: 500, height: 600, shortcut: defaultShortcut };

const settingsPath = path.join(app.getPath('userData'), 'settings.json');
// You can specify your own shortcut in settings.json by adding a "shortcut" field, e.g.:
// { "width": 500, "height": 600, "shortcut": "Ctrl+Alt+Shift+T" }

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
        const currentSettings = loadSettings();
        saveSettings({ ...currentSettings, width, height });
    });
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.loadFile('public/reaction.html');

    /* Включаем DevTools */
    mainWindow.webContents.openDevTools();

    return mainWindow;
}
app.whenReady().then(() => {
    const mainWindow = createClapWindow()

    const { shortcut } = loadSettings();

    globalShortcut.register(shortcut, () => {
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

ipcMain.handle('get-user-settings', () => {
    return loadSettings();
});

// Добавляем обработчик для обновления горячей клавиши
ipcMain.on('update-shortcut', (event, newShortcut) => {
    const currentSettings = loadSettings();
    const updatedSettings = { ...currentSettings, shortcut: newShortcut };
    saveSettings(updatedSettings);
});
