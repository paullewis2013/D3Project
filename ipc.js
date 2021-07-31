const {ipcRenderer} = require('electron');

function openSettings(){
    ipcRenderer.send("settings", "open");
}

function openAnalysis(){
    ipcRenderer.send("analysis", "open");
}