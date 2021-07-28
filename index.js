// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile('index.html')
}

function createSettingsWindow () {

    const settingsWindow = new BrowserWindow({
        width: 500,
        height: 500
    })

    settingsWindow.loadFile('settings.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
})

//ipc code
ipcMain.on("settings", (event, arg) => {
    if(arg == "open"){
        createSettingsWindow();
    }
})