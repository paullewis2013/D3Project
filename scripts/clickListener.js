//handle all logic related to mouse click events on canvas

canvas.addEventListener('click', function(e) {

    //debugging help
    // console.log(e.offsetX, e.offsetY)

    const CLICK_X = e.offsetX * scale;
    const CLICK_Y = e.offsetY * scale;

    //monopoly input
    if(showMonopolyMenu){

        //console.log(monopolyMenuCardPaths)

        for(let i = 0; i < monopolyMenuCardPaths.length; i++){
           
            if(monopolyMenuCardPaths[i] != null && ctx.isPointInPath(monopolyMenuCardPaths[i], e.offsetX, e.offsetY)){
                selectedResource = i
            }
        }
    }

    if(showYOPMenu){
        for(let i = 0; i < yopMenuCardPaths.length; i++){
           
            if(yopMenuCardPaths[i] != null && ctx.isPointInPath(yopMenuCardPaths[i], e.offsetX, e.offsetY)){

                if(yop1 && i >= 5 && !yop2){
                    console.log("second resource selected")
                    yop2 = true
                    selectedResource.push(i%5)
                }

                else if(!yop1){
                    console.log("first resource selected")
                    yop1 = true
                    selectedResource.push(i%5)
                }

                else if(yop1 && i<5){
                    console.log("first resource changed")
                    yop1 = true
                    selectedResource[0] = i%5
                }

                
            }
        }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //buttons

    //dice Button
    if(ctx.isPointInPath(dicePath, CLICK_X, CLICK_Y)){
        if(diceButtonEnabled){
            diceButton()
        }
        console.log("dice clicked")
    }

    //trade button
    if(ctx.isPointInPath(tradeButtonPath, CLICK_X, CLICK_Y)){
        if(tradeButtonEnabled){
            tradeButton()
        }
        console.log("trade button clicked")
    }

    //dev button
    if(ctx.isPointInPath(devButtonPath, CLICK_X, CLICK_Y)){
        if(devButtonEnabled){
            devButton()
        }
        console.log("dev button clicked")
    }

    //road button
    if(ctx.isPointInPath(roadButtonPath, CLICK_X, CLICK_Y)){
        if(roadButtonEnabled && !buildingRoad){
            roadButton()
        }else if(roadButtonEnabled && buildingRoad){
            cancelAction();
        }
        console.log("road button clicked")
    }

    //settlement button
    if(ctx.isPointInPath(settlementButtonPath, CLICK_X, CLICK_Y)){
        if(settlementButtonEnabled && !buildingSettlement){
            settlementButton()
        }else if(settlementButtonEnabled && buildingSettlement){
            cancelAction()
            showVerts = false
        }
        console.log("settlement button clicked")
    }

    //city Button
    if(ctx.isPointInPath(cityButtonPath, CLICK_X, CLICK_Y)){
        if(cityButtonEnabled && !buildingCity){
            cityButton()
        }else if(cityButtonEnabled && buildingCity){
            cancelAction()
        }
        console.log("city button clicked")
    }

    //turn button
    if(ctx.isPointInPath(turnButtonPath, CLICK_X, CLICK_Y)){
        if(turnButtonEnabled){
            turnButton()
        }
        console.log("turn button clicked")
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––



    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //resource and dev cards

    for(let i = 0; i < cardPaths.length; i++){

        if(ctx.isPointInPath(cardPaths[i].path, CLICK_X, CLICK_Y)){
            console.log(cardPaths[i].type + " card clicked")


            //dev cards
            if(!devCardPlayedThisTurn){

                //knight
                if(knightsEnabled && cardPaths[i].type === "knight"){
                    currPlayer.playDevCard(cardPaths[i].type);
                }else if(anyDevCardEnabled){
                    
                    //VP are special case and cannot be played 
                    if(cardPaths[i].type === "victory point"){
                        console.log("cannot play a victory point")
                    }else{
                        currPlayer.playDevCard(cardPaths[i].type)
                    }

                }


            }


        }

    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––


    //loop through all vertices
    for(var i = 0; i < 12; i++){

        for(var j = 0; j < verticesArr[i].length; j++){

            //if click occurred in vertex hitbox do something
            if (ctx.isPointInPath(verticesArr[i][j].hitbox, CLICK_X, CLICK_Y)){
                
                console.log(verticesArr[i][j])

                if(buildingSettlement){
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
    if(buildingCity){

        //loop through all of currPlayer's Settlements
        for(var i = 0; i < currPlayer.settlements.length; i++){

            if(ctx.isPointInPath(currPlayer.settlements[i].location.hitbox, e.offsetX, e.offsetY)){

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
                if(movingRobber && robberLocation != tilesArr[i][j]){
                    robberLocation = tilesArr[i][j]
                    movingRobber = false;
                    tilesArr[i][j].block()
                    
                    if(textured){
                        drawTileTextures()
                    }
                    drawTiles()
                    drawRobber()
                    //drawVertices()

                    //TODO select player to steal from if multiple are adjacent

                    //reenable buttons to work when drawButtons method is called in drawCanvas
                    drawCanvas()
                    
                    // //if this isn't here I get an error but the error doesn't seem to cause any problems
                    // //it just makes me uncomfortable
                    // return;
                }
            }
        }
    }

    //loop through all buildable roads
    let roads = currPlayer.getBuildableRoads()

    if(buildingRoad){
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