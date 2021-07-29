// this file is for commands that can be called from the console but aren't meant to be
// used during normal gameplay

// mostly these are methods to make debugging easier

//gives every player 10 of each resource and 1 of each dev card
function giveResources(){

    for(let i = 0; i < playersArr.length; i++){
        playersArr[i].resources = [10, 10, 10, 10, 10]
        playersArr[i].devCards = [1, 1, 1, 1, 1]
    }
}

function toggleTexture(){
    c_State.textured = !c_State.textured;
}