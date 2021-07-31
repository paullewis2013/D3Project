// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')

var settingsWindowOpen = false;

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

    //creates a new settings window if none exists
    if(!settingsWindowOpen){
        const settingsWindow = new BrowserWindow({
            width: 350,
            height: 500
        })
    
        settingsWindow.loadFile('settings.html');
        settingsWindowOpen = true;

        settingsWindow.on("close", function() { //   <---- Catch close event
            settingsWindowOpen = false;
        });
    }
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