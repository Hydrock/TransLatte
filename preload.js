const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    // getProviders: () => {
    //     try {
    //         return JSON.parse(localStorage.getItem('providers') || '[]');
    //     } catch {
    //         return [];
    //     }
    // },
    // addProvider: (name, url) => {
    //     const providers = JSON.parse(localStorage.getItem('providers') || '[]');
    //     providers.push({ name, url });
    //     localStorage.setItem('providers', JSON.stringify(providers));
    // },
    // deleteProvider: (index) => {
    //     const providers = JSON.parse(localStorage.getItem('providers') || '[]');
    //     providers.splice(index, 1);
    //     localStorage.setItem('providers', JSON.stringify(providers));
    // },
    // getSavedProvider: () => localStorage.getItem('selectedProvider'),
    // setSavedProvider: (value) => localStorage.setItem('selectedProvider', value),
    ipcRenderer
});
