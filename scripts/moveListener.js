//handle all logic related to mousemove events on canvas

canvas.addEventListener('mousemove', function(e) {

    const POS_X = e.offsetX * scale;
    const POS_Y = e.offsetY * scale;

    if(     (ctx.isPointInPath(dicePath, POS_X, POS_Y) && diceButtonEnabled)||
            (ctx.isPointInPath(tradeButtonPath, POS_X, POS_Y) && tradeButtonEnabled)||
            (ctx.isPointInPath(devButtonPath, POS_X, POS_Y) && devButtonEnabled) ||
            (ctx.isPointInPath(roadButtonPath, POS_X, POS_Y) && roadButtonEnabled) ||
            (ctx.isPointInPath(settlementButtonPath, POS_X, POS_Y) && settlementButtonEnabled) ||
            (ctx.isPointInPath(cityButtonPath, POS_X, POS_Y) && cityButtonEnabled)||
            (ctx.isPointInPath(turnButtonPath, POS_X, POS_Y) && turnButtonEnabled)){
            
        document.body.style.cursor = "pointer";

    }else if(   (ctx.isPointInPath(dicePath, POS_X, POS_Y) && !diceButtonEnabled)||
                (ctx.isPointInPath(tradeButtonPath, POS_X, POS_Y) && !tradeButtonEnabled)||
                (ctx.isPointInPath(devButtonPath, POS_X, POS_Y) && !devButtonEnabled) ||
                (ctx.isPointInPath(roadButtonPath, POS_X, POS_Y) && !roadButtonEnabled) ||
                (ctx.isPointInPath(settlementButtonPath, POS_X, POS_Y) && !settlementButtonEnabled) ||
                (ctx.isPointInPath(cityButtonPath, POS_X, POS_Y) && !cityButtonEnabled)||
                (ctx.isPointInPath(turnButtonPath, POS_X, POS_Y) && !turnButtonEnabled)){

        document.body.style.cursor = "not-allowed";

    }else{
        
        document.body.style.cursor = "default";

    }

    //if hovering over a vertex while building, color it the player color
    if(showVerts){

        hoveredVert = null;

        //loop through all verts
        for(let i = 0; i < 12; i++){
            for(let j = 0; j < verticesArr[i].length; j++){
                if(ctx.isPointInPath(verticesArr[i][j].hitbox, POS_X, POS_Y)){
                    hoveredVert = verticesArr[i][j]
                }
            }
        }
    }

    //if hovering over a road while building, color it the player color
    if(showRoads){

        hoveredRoad = null;

        //loop through all verts
        for(let i = 0; i < 11; i++){
            for(let j = 0; j < roadsArr[i].length; j++){
                if(ctx.isPointInPath(roadsArr[i][j].hitbox, POS_X, POS_Y)){
                    hoveredRoad = roadsArr[i][j]
                }
            }
        }
    }
});