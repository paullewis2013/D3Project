//          /\ /\ /\               ||>>>>>>>>>||                                    ||                        /\ /\ /\
//         |  |  |  |              ||         ||                                    ||                       |  |  |  |
//        / \/ \/ \/ \             ||         ||                                    ||                      / \/ \/ \/ \
//       |  |  |  |  |             ||         ||                                    ||                     |  |  |  |  | 
//      / \/ \/ \/ \/ \            ||         ||                                    ||                    / \/ \/ \/ \/ \
//     |  |  |  |  |  |            ||>>>>>>>>>||                                    ||                   |  |  |  |  |  |
//      \/ \/ \/ \/ \/             ||                    ____       ||     ||       ||                    \/ \/ \/ \/ \/
//       |  |  |  |  |             ||                 //     \\||   ||     ||       ||                     |  |  |  |  |
//        \/ \/ \/ \/              ||               //        |||   ||     ||       ||                      \/ \/ \/ \/
//         |  |  |  |              ||               ||      // ||    \\____//       ||______________        |  |  |  | 
//          \/ \/ \/               ||               \\-----/   ||      ----         `---------------         \/ \/ \/

//this method injects required scripts into index.html when called

(function() {
    var scriptNames = [
        //load objects first
        "objects/Dice.js",
        "objects/Player.js",
        "objects/Port.js",
        "objects/Road.js",
        "objects/Settlement.js",
        "objects/Tile.js",
        "objects/Vertex.js",

        "canvas.js",
        "scripts/initPaths.js",
        "scripts/commands.js",
        "scripts/moveListener.js",
        "scripts/clickListener.js",

        "scripts/playerInfo.js",
        "scripts/syncSettings.js",
        "board.js",
        "ipc.js",
        "data.js",

    ];
    for (var i = 0; i < scriptNames.length; i++) {
        var script = document.createElement('script');
        script.src = scriptNames[i];
        script.async = false; // This is required for synchronous execution
        document.body.appendChild(script);
    }

})();