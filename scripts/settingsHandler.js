//background colors for switches
var inactiveColor = "#bdb9a6"
var activeColor = "green"

function toggleTileTextures(){

    if(document.getElementById("TileTexturesToggleCheckbox").checked){
        document.getElementById("TileTexturesToggle").style.background = activeColor;
    }else{
        document.getElementById("TileTexturesToggle").style.background = inactiveColor;
    }
}