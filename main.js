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
            if (is_mac) {
                app.dock.hide();
            }

            /**
             * Повторная инициализация настроек.
             * На MacOS, по какой-то неведомой причине, спустя некоторое время работы приложения,
             * оно перестает открываться поверх других приложений, а появляется и переключает пользователя на основной
             * рабочий стол. Если открыть программу на весть экран и затем уменьшить - то все начинает снова работать.
             * Ощущение такое, что происходит какая-то гонка за слоями отображения (я тут полный профан) и спустя время
             * другие программы забирают право висеть на верхнем слое.
             * Не уверен что это поможет, но все же.
             */

            mainWindow.setAlwaysOnTop(false);
            mainWindow.setVisibleOnAllWorkspaces(false);

            setTimeout(() => {
                mainWindow.setAlwaysOnTop(true, "screen-saver");
                mainWindow.setVisibleOnAllWorkspaces(true);
                mainWindow.show();
                mainWindow.focus();
            }, 100);
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
