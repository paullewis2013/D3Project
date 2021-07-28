// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
        devTools: true
    }
  })

  mainWindow.loadFile('index.html')
}

function createSettingsWindow () {

  const settingsWindow = new BrowserWindow({
    width: 400,
    height: 600
  })

  settingsWindow.loadFile('settings.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  createSettingsWindow()
})