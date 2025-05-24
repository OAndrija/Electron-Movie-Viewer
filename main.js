const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;
let settingsWindow;
let currentTheme = 'dark';

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('theme-changed', currentTheme);
    });
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 300,
        height: 200,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    settingsWindow.setMenu(null);

    settingsWindow.loadFile('settings.html');
    settingsWindow.webContents.on('did-finish-load', () => {
        settingsWindow.webContents.send('theme-changed', currentTheme);
    });

}

ipcMain.on('open-settings', () => {
    createSettingsWindow();
});

ipcMain.on('set-theme', (event, theme) => {
    currentTheme = theme;
    mainWindow.webContents.send('theme-changed', currentTheme);
    if (settingsWindow) settingsWindow.webContents.send('theme-changed', currentTheme);
});


app.whenReady().then(() => {
    createMainWindow();

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
                    { role: 'quit' }
                ]
            },
            {
                label: 'Settings',
                submenu: [
                    {
                        label: 'Open Settings',
                        click: () => {
                            createSettingsWindow();
                        }
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'toggledevtools' },
                    { role: 'resetzoom' },
                    { role: 'zoomin' },
                    { role: 'zoomout' },
                    { role: 'togglefullscreen' }
                ]
            }
        ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
