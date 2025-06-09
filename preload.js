const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    ipcRenderer,
    updateShortcut: (newShortcut) => {
        return ipcRenderer.send('update-shortcut', newShortcut)
    },
    restartApp: () => ipcRenderer.send('restart-app')
});

ipcRenderer.invoke('get-user-settings').then((settings) => {
    contextBridge.exposeInMainWorld('appHotkeys', {
        toggleShortcut: settings.shortcut
    });
});
