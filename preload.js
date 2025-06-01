const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openSettings: () => ipcRenderer.send('open-settings'),
    setTheme: (theme) => ipcRenderer.send('set-theme', theme),
    onThemeChanged: (callback) => ipcRenderer.on('theme-changed', (_, theme) => callback(theme)),
    onMovieDataLoaded: (callback) => ipcRenderer.on('movie-data-loaded', (_, data) => callback(data)),
    requestOpenDialog: () => ipcRenderer.send('show-open-dialog'),
    onRequestUpload: (callback) => ipcRenderer.on('request-upload', callback)
});
