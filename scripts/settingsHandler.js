const {ipcRenderer} = require('electron');

// var remote = require('remote'); // Load remote compnent that contains the dialog dependency
// var dialog = remote.require('dialog'); // Load the dialogs component of the OS
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

//background colors for switches
var inactiveColor = "#bdb9a6"
var activeColor = "green"

var settingsObject;

syncSettingsFromFile()

function syncSettingsFromFile(){

    let filepath = "settings.json"

    //careful this is asynchronous
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        settingsObject = JSON.parse(data);

        //sync toggles to value from settingsObject
        if(settingsObject.AnimateBackground){
            document.getElementById("AnimateBackgroundCheckbox").checked = true;
            document.getElementById("AnimateBackgroundToggle").style.background = activeColor;

        }else{
            document.getElementById("AnimateBackgroundCheckbox").checked = false;
            document.getElementById("AnimateBackgroundToggle").style.background = inactiveColor;
        }

        if(settingsObject.TileTextures){
            document.getElementById("TileTexturesToggleCheckbox").checked = true;
            document.getElementById("TileTexturesToggle").style.background = activeColor;

        }else{
            document.getElementById("TileTexturesToggleCheckbox").checked = false;
            document.getElementById("TileTexturesToggle").style.background = inactiveColor;
        }
    });
}

//writes current state of settings to file
function syncSettingsToFile(){
    try { 
        fs.writeFileSync('settings.json', JSON.stringify(settingsObject), 'utf-8'); 
    }
    catch(e) {
        alert('Failed to save the file !'); 
    }
}

function toggleAnimateBackground(){

    if(document.getElementById("AnimateBackgroundCheckbox").checked){
        document.getElementById("AnimateBackgroundToggle").style.background = activeColor;
        ipcRenderer.send("settingsObject", {AnimateBackground: true});
        settingsObject.AnimateBackground = true;
    }else{
        document.getElementById("AnimateBackgroundToggle").style.background = inactiveColor;
        ipcRenderer.send("settingsObject", {AnimateBackground: false})
        settingsObject.AnimateBackground = false;
    }

    syncSettingsToFile()
}

function toggleTileTextures(){

    if(document.getElementById("TileTexturesToggleCheckbox").checked){
        document.getElementById("TileTexturesToggle").style.background = activeColor;
        ipcRenderer.send("settingsObject", {TileTextures: true})
        settingsObject.TileTextures = true
    }else{
        document.getElementById("TileTexturesToggle").style.background = inactiveColor;
        ipcRenderer.send("settingsObject", {TileTextures: false})
        settingsObject.TileTextures = false
    }

    syncSettingsToFile()
}