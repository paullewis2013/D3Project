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
//it is the only script included in index.html at te time it is called

(function() {
    var scriptNames = [
        //load needed lodash functions
        "util/min_lodash.js",

        //load objects first
        "objects/Dice.js",
        "objects/Player.js",
        "objects/Port.js",
        "objects/Road.js",
        "objects/Settlement.js",
        "objects/Tile.js",
        "objects/Vertex.js",

        //canvas related files
        "canvas.js",
        "scripts/initPaths.js",
        "listeners/moveListener.js",
        "listeners/clickListener.js",

        "scripts/playerInfo.js",
        "scripts/syncSettings.js",
        "board.js",
        "ipc.js",

        //finally more util 
        "util/console_commands.js",
        "util/data.js"
    ];
    for (var i = 0; i < scriptNames.length; i++) {
        var script = document.createElement('script');
        script.src = scriptNames[i];
        script.async = false; // This is required for synchronous execution
        document.body.appendChild(script);
    }

})();