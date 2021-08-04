const {ipcRenderer} = require('electron');

//background colors for switches
var inactiveColor = "#bdb9a6"
var activeColor = "green"

function toggleTileTextures(){

    if(document.getElementById("TileTexturesToggleCheckbox").checked){
        document.getElementById("TileTexturesToggle").style.background = activeColor;
        let message = {TileTextures: true}
        ipcRenderer.send("settingsObject", message)
    }else{
        document.getElementById("TileTexturesToggle").style.background = inactiveColor;
        ipcRenderer.send("settingsObject", {TileTextures: false})
    }
}