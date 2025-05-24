const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openSettings: () => ipcRenderer.send('open-settings'),
    setTheme: (theme) => ipcRenderer.send('set-theme', theme),
    onThemeChanged: (callback) => ipcRenderer.on('theme-changed', (_, theme) => callback(theme))
});
