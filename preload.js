// preload.js

const { contextBridge, ipcRenderer } = require('electron');

// Экспортируем функции в window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
    toggleWindow: () => ipcRenderer.send('toggle-window'),
    // Добавляй здесь любые методы, которые хочешь "прокинуть" в HTML
});
