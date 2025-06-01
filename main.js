const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;
let currentTheme = 'dark';
const autosavePath = path.join(app.getPath('userData'), 'autosave.json');

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 800,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('theme-changed', currentTheme);

        let movieData;

        if (fs.existsSync(autosavePath)) {
            const savedData = fs.readFileSync(autosavePath, 'utf8');
            try {
                movieData = JSON.parse(savedData);
            } catch (e) {
                console.error('Failed to parse autosave.json, falling back to default movie.');
            }
        }

        if (!movieData) {
            movieData = {
                title: "The Godfather",
                year: 1972,
                director: ["Francis Ford Coppola"],
                score: 9.2,
                summary: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                categories: ["Epic", "Gangster", "Tragedy", "Crime", "Drama"],
                cast: ["Marlon Brando", "Al Pacino", "James Caan"],
                imagePath: "resources/images/godfather_img.jpg",
                trailerUrl: "https://www.youtube.com/embed/UaVTIH8mujA?autoplay=1&mute=1"
            };
        }

        mainWindow.webContents.send('movie-data-loaded', movieData);

        mainWindow.show();
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

ipcMain.on('show-open-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile']
    });

    if (!canceled && filePaths.length > 0) {
        fs.readFile(filePaths[0], 'utf8', (err, data) => {
            if (!err) {
                try {
                    const movieData = JSON.parse(data);
                    fs.writeFileSync(autosavePath, JSON.stringify(movieData, null, 2));
                    mainWindow.webContents.send('movie-data-loaded', movieData);
                } catch (parseError) {
                    console.error('Invalid JSON file.');
                }
            }
        });
    }
});

app.whenReady().then(() => {
    createMainWindow();

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Upload Data',
                        click: () => {
                            mainWindow.webContents.send('request-upload');
                        }
                    },
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
