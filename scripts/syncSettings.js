const fs = require('fs');

function syncSettings(){
    
    let filepath = "settings.json"

    //careful this is asynchronous
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        settingsObject = JSON.parse(data);

        //sync values to match settingsObject
        c_State.animateBackground = settingsObject.AnimateBackground;
        c_State.textured = settingsObject.TileTextures;

    });
    
}