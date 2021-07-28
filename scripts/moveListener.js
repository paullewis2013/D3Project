//handle all logic related to mousemove events on canvas

canvas.addEventListener('mousemove', function(e) {

    const POS_X = e.offsetX * scale;
    const POS_Y = e.offsetY * scale;

    if(     (ctx.isPointInPath(c_State.dicePath, POS_X, POS_Y) && diceButtonEnabled)||
            (ctx.isPointInPath(c_State.tradeButtonPath, POS_X, POS_Y) && tradeButtonEnabled)||
            (ctx.isPointInPath(c_State.devButtonPath, POS_X, POS_Y) && devButtonEnabled) ||
            (ctx.isPointInPath(c_State.roadButtonPath, POS_X, POS_Y) && roadButtonEnabled) ||
            (ctx.isPointInPath(c_State.settlementButtonPath, POS_X, POS_Y) && settlementButtonEnabled) ||
            (ctx.isPointInPath(c_State.cityButtonPath, POS_X, POS_Y) && cityButtonEnabled)||
            (ctx.isPointInPath(c_State.turnButtonPath, POS_X, POS_Y) && turnButtonEnabled)){
            
        document.body.style.cursor = "pointer";

    }else if(   (ctx.isPointInPath(c_State.dicePath, POS_X, POS_Y) && !diceButtonEnabled)||
                (ctx.isPointInPath(c_State.tradeButtonPath, POS_X, POS_Y) && !tradeButtonEnabled)||
                (ctx.isPointInPath(c_State.devButtonPath, POS_X, POS_Y) && !devButtonEnabled) ||
                (ctx.isPointInPath(c_State.roadButtonPath, POS_X, POS_Y) && !roadButtonEnabled) ||
                (ctx.isPointInPath(c_State.settlementButtonPath, POS_X, POS_Y) && !settlementButtonEnabled) ||
                (ctx.isPointInPath(c_State.cityButtonPath, POS_X, POS_Y) && !cityButtonEnabled)||
                (ctx.isPointInPath(c_State.turnButtonPath, POS_X, POS_Y) && !turnButtonEnabled)){

        document.body.style.cursor = "not-allowed";

    }else{
        
        document.body.style.cursor = "default";

    }

    //if hovering over a vertex while building, color it the player color
    if(c_State.showVerts){

        c_State.hoveredVert = null;

        //loop through all verts
        for(let i = 0; i < 12; i++){
            for(let j = 0; j < verticesArr[i].length; j++){
                if(ctx.isPointInPath(verticesArr[i][j].hitbox, POS_X, POS_Y)){
                    c_State.hoveredVert = verticesArr[i][j]
                }
            }
        }
    }

    //if hovering over a road while building, color it the player color
    if(c_State.showRoads){

        c_State.hoveredRoad = null;

        //loop through all verts
        for(let i = 0; i < 11; i++){
            for(let j = 0; j < roadsArr[i].length; j++){
                if(ctx.isPointInPath(roadsArr[i][j].hitbox, POS_X, POS_Y)){
                    c_State.hoveredRoad = roadsArr[i][j]
                }
            }
        }
    }
});