const {ipcRenderer} = require('electron');

function openSettings(){
    ipcRenderer.send("settings", "open");
}

function openAnalysis(){
    ipcRenderer.send("analysis", "open");
}

ipcRenderer.on("settingsObject", (event, arg) => {

    if (Object.keys(arg)[0] == "TileTextures"){
        c_State.textured = arg.TileTextures;
    }


});