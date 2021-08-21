//handle all logic related to mouse click events on canvas

function startClickListener(){

    canvas.addEventListener('click', function(e) {

        //debugging help
        // console.log(e.offsetX, e.offsetY)
    
        const CLICK_X = e.offsetX * c_State.scale;
        const CLICK_Y = e.offsetY * c_State.scale;
    
        //monopoly input
        if(c_State.showMonopolyMenu){
    
            for(let i = 0; i < c_State.monopolyMenuCardPaths.length; i++){
               
                if(c_State.monopolyMenuCardPaths[i] != null && ctx.isPointInPath(c_State.monopolyMenuCardPaths[i], CLICK_X, CLICK_Y)){
                    c_State.selectedResource = i
                }
            }
        }
    
        if(c_State.showYOPMenu){
            for(let i = 0; i < c_State.yopMenuCardPaths.length; i++){
               
                if(c_State.yopMenuCardPaths[i] != null && ctx.isPointInPath(c_State.yopMenuCardPaths[i], CLICK_X, CLICK_Y)){
    
                    if(c_State.yop1 && i >= 5 && !c_State.yop2){
                        console.log("second resource selected")
                        c_State.yop2 = true
                        c_State.selectedResource.push(i%5)
                    }
    
                    else if(!c_State.yop1){
                        console.log("first resource selected")
                        c_State.yop1 = true
                        c_State.selectedResource.push(i%5)
                    }
    
                    else if(c_State.yop1 && i<5){
                        console.log("first resource changed")
                        c_State.yop1 = true
                        c_State.selectedResource[0] = i%5
                    }
                }
            }
        }
    
        //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
        //buttons

        //settingsButton
        if(ctx.isPointInPath(c_State.settingsButtonPath, CLICK_X, CLICK_Y)){
            openSettings();
        }

        //analysisButton
        if(ctx.isPointInPath(c_State.analysisButtonPath, CLICK_X, CLICK_Y)){
            openAnalysis();
        }
    
        //dice Button
        if(ctx.isPointInPath(c_State.dicePath, CLICK_X, CLICK_Y)){
            if(b_State.diceButtonEnabled){
                diceButton()
            }
            console.log("dice clicked")
        }
    
        //trade button
        if(ctx.isPointInPath(c_State.tradeButtonPath, CLICK_X, CLICK_Y)){
            if(b_State.tradeButtonEnabled){
                tradeButton()
            }
            console.log("trade button clicked")
        }
    
        //dev button
        if(ctx.isPointInPath(c_State.devButtonPath, CLICK_X, CLICK_Y)){
            if(b_State.devButtonEnabled){
                devButton()
            }
            console.log("dev button clicked")
        }
    
        //road button
        if(ctx.isPointInPath(c_State.roadButtonPath, CLICK_X, CLICK_Y)){
            if(b_State.roadButtonEnabled && !b_State.buildingRoad){
                roadButton()
            }else if(b_State.roadButtonEnabled && b_State.buildingRoad){
                cancelAction();
            }
            console.log("road button clicked")
        }
    
        //settlement button
        if(ctx.isPointInPath(c_State.settlementButtonPath, CLICK_X, CLICK_Y)){
            if(b_State.settlementButtonEnabled && !b_State.buildingSettlement){
                settlementButton()
            }else if(b_State.settlementButtonEnabled && b_State.buildingSettlement){
                cancelAction()
                c_State.showVerts = false
            }
            console.log("settlement button clicked")
        }
    
        //city Button
        if(ctx.isPointInPath(c_State.cityButtonPath, CLICK_X, CLICK_Y)){
            if(b_State.cityButtonEnabled && !b_State.buildingCity){
                cityButton()
            }else if(b_State.cityButtonEnabled && b_State.buildingCity){
                cancelAction()
            }
            console.log("city button clicked")
        }
    
        //turn button
        if(ctx.isPointInPath(c_State.turnButtonPath, CLICK_X, CLICK_Y)){
            if(b_State.turnButtonEnabled){
                turnButton()
            }
            console.log("turn button clicked")
        }
    
        //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
    
    
    
        //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
        //resource and dev cards
    
        for(let i = 0; i < c_State.cardPaths.length; i++){
    
            if(ctx.isPointInPath(c_State.cardPaths[i].path, CLICK_X, CLICK_Y)){
                console.log(c_State.cardPaths[i].type + " card clicked")
    
                //dev cards
                if(!b_State.devCardPlayedThisTurn){
    
                    //knight
                    if(b_State.knightsEnabled && c_State.cardPaths[i].type === "knight"){
                        currPlayer.playDevCard(c_State.cardPaths[i].type);
                    }else if(b_State.anyDevCardEnabled){
                        
                        //VP are special case and cannot be played 
                        if(c_State.cardPaths[i].type === "victory point"){
                            console.log("cannot play a victory point")
                        }else{
                            currPlayer.playDevCard(c_State.cardPaths[i].type)
                        }
                    }
                }
            }
        }
    
        if(b_State.currentlyTrading){

            //loop through send
            for(let i = 0; i < 5; i++){
                if(c_State.sendCardPaths[i] != null && ctx.isPointInPath(c_State.sendCardPaths[i], CLICK_X, CLICK_Y)){

                    // don't allow player to try to trade a resource they don't have or that is already being received in same trade
                    if(c_State.player.resources[i] > c_State.send[i] && c_State.receive[i] < 1){
                        c_State.send[i]++;
                    }
                }
            }

            //loop through receive
            for(let i = 0; i < 5; i++){
                if(c_State.receiveCardPaths[i] != null && ctx.isPointInPath(c_State.receiveCardPaths[i], CLICK_X, CLICK_Y)){

                    // don't allow player to trade for a resource they're also trying to send
                    if(c_State.send[i] < 1){
                        c_State.receive[i]++;
                    }
                }
            }

            //clear button
            if(ctx.isPointInPath(c_State.clearButtonPath, CLICK_X, CLICK_Y)){
                clearSend()
                clearReceive()
            }
        }

        //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
    
    
        //loop through all vertices
        for(var i = 0; i < 12; i++){
    
            for(var j = 0; j < verticesArr[i].length; j++){
    
                //if click occurred in vertex hitbox do something
                if (ctx.isPointInPath(verticesArr[i][j].hitbox, CLICK_X, CLICK_Y)){
                    
                    console.log(verticesArr[i][j])
    
                    if(b_State.buildingSettlement){
                        //console.log("attempting to build settlement at " + verticesArr[i][j].toString())
                        if(currPlayer.VP < 2){
                            buildSettlement(verticesArr[i][j], currPlayer)
                        }else{
    
                            let buildable = false;
    
                            for(let k = 0; k < verticesArr[i][j].adjRoads.length; k++){
                                if(verticesArr[i][j].adjRoads[k].player == currPlayer){
                                    buildable = true;
                                }
                            }
    
                            if(buildable){
                                buildSettlement(verticesArr[i][j], currPlayer)
                            }
    
                        }
                    }   
                }
            }
        }
    
        //loop through current players settlements
        if(b_State.buildingCity){
    
            //loop through all of currPlayer's Settlements
            for(var i = 0; i < currPlayer.settlements.length; i++){
    
                if(ctx.isPointInPath(currPlayer.settlements[i].location.hitbox, CLICK_X, CLICK_Y)){
    
                    buildCity(currPlayer.settlements[i], currPlayer);
                    i = currPlayer.settlements.length;
                    
                }
            }
        }
    
        //loop through all tiles
        for(var i = 0; i < 5; i++){
    
            //console.log(tilesArr[i])
    
            for(var j = 0; j < tilesArr[i].length; j++){
    
                //if click occurred in tile hitbox do something
                if (ctx.isPointInPath(tilesArr[i][j].hitbox, CLICK_X, CLICK_Y)) {
                    console.log(tilesArr[i][j]);
    
                    //TODO this should be a method
                    //moves robber to new tile if the robber is not already there
                    if(c_State.movingRobber && robberLocation != tilesArr[i][j]){
                        robberLocation = tilesArr[i][j]
                        c_State.movingRobber = false;
                        tilesArr[i][j].block()
    
                        //TODO select player to steal from if multiple are adjacent
                    }
                }
            }
        }
    
        //loop through all buildable roads
        let roads = currPlayer.getBuildableRoads()
    
        if(b_State.buildingRoad){
            for(let i = 0; i < roads.length; i++){
                if(ctx.isPointInPath(roads[i].hitbox, CLICK_X, CLICK_Y)){
                    buildRoad(roads[i], currPlayer);
                }
            }
        }
    
        // loop through all roads to print location of click event
        for(var i = 0; i < 11; i++){
            for(var j = 0; j < roadsArr[i].length; j++){
                if(ctx.isPointInPath(roadsArr[i][j].hitbox, CLICK_X, CLICK_Y)){
                    console.log(roadsArr[i][j])
                }
            }
        }
    });
}