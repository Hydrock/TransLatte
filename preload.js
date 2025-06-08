const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    ipcRenderer,
});

contextBridge.exposeInMainWorld('appHotkeys', {
    toggleShortcut: process.platform === 'darwin' ? 'Cmd+Option+Shift+T' : 'Ctrl+Alt+Shift+T'
});
