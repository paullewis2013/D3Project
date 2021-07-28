const {ipcRenderer} = require('electron');

function openSettings(){
    ipcRenderer.send("settings", "open");
}