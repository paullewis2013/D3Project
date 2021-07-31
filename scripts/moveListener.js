//handle all logic related to mousemove events on canvas

function startMoveListener(){

    canvas.addEventListener('mousemove', function(e) {

        const POS_X = e.offsetX * c_State.scale;
        const POS_Y = e.offsetY * c_State.scale;
    
        if(     (ctx.isPointInPath(c_State.dicePath, POS_X, POS_Y) && b_State.diceButtonEnabled)||
                (ctx.isPointInPath(c_State.tradeButtonPath, POS_X, POS_Y) && b_State.tradeButtonEnabled)||
                (ctx.isPointInPath(c_State.devButtonPath, POS_X, POS_Y) && b_State.devButtonEnabled) ||
                (ctx.isPointInPath(c_State.roadButtonPath, POS_X, POS_Y) && b_State.roadButtonEnabled) ||
                (ctx.isPointInPath(c_State.settlementButtonPath, POS_X, POS_Y) && b_State.settlementButtonEnabled) ||
                (ctx.isPointInPath(c_State.cityButtonPath, POS_X, POS_Y) && b_State.cityButtonEnabled)||
                (ctx.isPointInPath(c_State.turnButtonPath, POS_X, POS_Y) && b_State.turnButtonEnabled) ||
                (ctx.isPointInPath(c_State.settingsButtonPath, POS_X, POS_Y)) ||
                (ctx.isPointInPath(c_State.analysisButtonPath, POS_X, POS_Y))
            ){
                
            document.body.style.cursor = "pointer";
    
        }else if(   (ctx.isPointInPath(c_State.dicePath, POS_X, POS_Y) && !b_State.diceButtonEnabled)||
                    (ctx.isPointInPath(c_State.tradeButtonPath, POS_X, POS_Y) && !b_State.tradeButtonEnabled)||
                    (ctx.isPointInPath(c_State.devButtonPath, POS_X, POS_Y) && !b_State.devButtonEnabled) ||
                    (ctx.isPointInPath(c_State.roadButtonPath, POS_X, POS_Y) && !b_State.roadButtonEnabled) ||
                    (ctx.isPointInPath(c_State.settlementButtonPath, POS_X, POS_Y) && !b_State.settlementButtonEnabled) ||
                    (ctx.isPointInPath(c_State.cityButtonPath, POS_X, POS_Y) && !b_State.cityButtonEnabled)||
                    (ctx.isPointInPath(c_State.turnButtonPath, POS_X, POS_Y) && !b_State.turnButtonEnabled))
                {
    
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
}