// initialize paths once so cycles are not wasted recreating them every frame
// methods are sorted alphabetically
// called by canvas.js

function initBackgroundDots(){
    
    //start the pattern outside the bounds of canvas
    let x = -50
    let y = -50

    let offset = false;

    //make a lot of rows
    for(let i = 0; i < 45; i++){

        //add a new array to populate
        c_State.dotsArray.push([])

        //push custom x y coordinate structure into array
        for(let j = 0; j < 45; j++){
            c_State.dotsArray[i].push([x, y, 0, 0])
            x += c_WIDTH/35
        }

        //move y up a row
        y += c_HEIGHT/35

        //stagger every other row
        if(!offset){
            offset = true;
            x = -100
        }else{
            offset = false;
            x = -100 - c_WIDTH/80
        }   
    }
}

function initButtons(){

    //x y width height and curve radius for rectangle path
    let x = (c_WIDTH/2) - 1.5 * 60
    let y = c_HEIGHT - 95
    let w = (c_WIDTH - x) / 7
    let h = 80
    let radius = 15

    c_State.buttonWidth = w * 7/6

    c_State.tradeButtonPath = new Path2D();

    x += (w * 14/13) - w

    //rectangle with rounded corners
    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    c_State.tradeButtonPath.moveTo(x+radius, y);
    c_State.tradeButtonPath.lineTo(r-radius, y);
    c_State.tradeButtonPath.quadraticCurveTo(r, y, r, y+radius);
    c_State.tradeButtonPath.lineTo(r, y+h-radius);
    c_State.tradeButtonPath.quadraticCurveTo(r, b, r-radius, b);
    c_State.tradeButtonPath.lineTo(x+radius, b);
    c_State.tradeButtonPath.quadraticCurveTo(x, b, x, b-radius);
    c_State.tradeButtonPath.lineTo(x, y+radius);
    c_State.tradeButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    c_State.devButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    c_State.devButtonPath.moveTo(x+radius, y);
    c_State.devButtonPath.lineTo(r-radius, y);
    c_State.devButtonPath.quadraticCurveTo(r, y, r, y+radius);
    c_State.devButtonPath.lineTo(r, y+h-radius);
    c_State.devButtonPath.quadraticCurveTo(r, b, r-radius, b);
    c_State.devButtonPath.lineTo(x+radius, b);
    c_State.devButtonPath.quadraticCurveTo(x, b, x, b-radius);
    c_State.devButtonPath.lineTo(x, y+radius);
    c_State.devButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    c_State.roadButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    c_State.roadButtonPath.moveTo(x+radius, y);
    c_State.roadButtonPath.lineTo(r-radius, y);
    c_State.roadButtonPath.quadraticCurveTo(r, y, r, y+radius);
    c_State.roadButtonPath.lineTo(r, y+h-radius);
    c_State.roadButtonPath.quadraticCurveTo(r, b, r-radius, b);
    c_State.roadButtonPath.lineTo(x+radius, b);
    c_State.roadButtonPath.quadraticCurveTo(x, b, x, b-radius);
    c_State.roadButtonPath.lineTo(x, y+radius);
    c_State.roadButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()
    
    c_State.settlementButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    c_State.settlementButtonPath.moveTo(x+radius, y);
    c_State.settlementButtonPath.lineTo(r-radius, y);
    c_State.settlementButtonPath.quadraticCurveTo(r, y, r, y+radius);
    c_State.settlementButtonPath.lineTo(r, y+h-radius);
    c_State.settlementButtonPath.quadraticCurveTo(r, b, r-radius, b);
    c_State.settlementButtonPath.lineTo(x+radius, b);
    c_State.settlementButtonPath.quadraticCurveTo(x, b, x, b-radius);
    c_State.settlementButtonPath.lineTo(x, y+radius);
    c_State.settlementButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    c_State.cityButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    c_State.cityButtonPath.moveTo(x+radius, y);
    c_State.cityButtonPath.lineTo(r-radius, y);
    c_State.cityButtonPath.quadraticCurveTo(r, y, r, y+radius);
    c_State.cityButtonPath.lineTo(r, y+h-radius);
    c_State.cityButtonPath.quadraticCurveTo(r, b, r-radius, b);
    c_State.cityButtonPath.lineTo(x+radius, b);
    c_State.cityButtonPath.quadraticCurveTo(x, b, x, b-radius);
    c_State.cityButtonPath.lineTo(x, y+radius);
    c_State.cityButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()
    
    c_State.turnButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    c_State.turnButtonPath.moveTo(x+radius, y);
    c_State.turnButtonPath.lineTo(r-radius, y);
    c_State.turnButtonPath.quadraticCurveTo(r, y, r, y+radius);
    c_State.turnButtonPath.lineTo(r, y+h-radius);
    c_State.turnButtonPath.quadraticCurveTo(r, b, r-radius, b);
    c_State.turnButtonPath.lineTo(x+radius, b);
    c_State.turnButtonPath.quadraticCurveTo(x, b, x, b-radius);
    c_State.turnButtonPath.lineTo(x, y+radius);
    c_State.turnButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    //settings button
    c_State.settingsButtonPath = new Path2D();

    ctx.beginPath();
    c_State.settingsButtonPath.arc(c_WIDTH - 30, 30, 19.5, 0, 2 * Math.PI);
    ctx.closePath();

    //analysis button
    c_State.analysisButtonPath = new Path2D();

    ctx.beginPath();
    c_State.analysisButtonPath.arc(c_WIDTH - 330, 30, 19.5, 0, 2 * Math.PI);
    ctx.closePath();
}

function initDicePath(){
    
    c_State.dicePath = new Path2D();
    
    let lX = 55
    let rX = 175

    let tY = 435
    let bY = tY + 65

    ctx.beginPath();
    c_State.dicePath.moveTo(lX, tY)
    c_State.dicePath.lineTo(lX, bY)
    c_State.dicePath.lineTo(rX, bY)
    c_State.dicePath.lineTo(rX, tY)
    c_State.dicePath.lineTo(lX, tY)
    ctx.closePath()
}

function initIslandPath(){

    //defines a path around the perimeter of the island
    c_State.islandPath = new Path2D();

    ctx.beginPath();
    c_State.islandPath.moveTo(verticesArr[0][0].cx, verticesArr[0][0].cy);
    c_State.islandPath.lineTo(verticesArr[1][1].cx, verticesArr[1][1].cy);
    c_State.islandPath.lineTo(verticesArr[0][1].cx, verticesArr[0][1].cy);
    c_State.islandPath.lineTo(verticesArr[1][2].cx, verticesArr[1][2].cy);
    c_State.islandPath.lineTo(verticesArr[0][2].cx, verticesArr[0][2].cy);
    c_State.islandPath.lineTo(verticesArr[1][3].cx, verticesArr[1][3].cy);
    c_State.islandPath.lineTo(verticesArr[2][3].cx, verticesArr[2][3].cy);
    c_State.islandPath.lineTo(verticesArr[3][4].cx, verticesArr[3][4].cy);
    c_State.islandPath.lineTo(verticesArr[4][4].cx, verticesArr[4][4].cy);
    c_State.islandPath.lineTo(verticesArr[5][5].cx, verticesArr[5][5].cy);
    c_State.islandPath.lineTo(verticesArr[6][5].cx, verticesArr[6][5].cy);
    c_State.islandPath.lineTo(verticesArr[7][4].cx, verticesArr[7][4].cy);
    c_State.islandPath.lineTo(verticesArr[8][4].cx, verticesArr[8][4].cy);
    c_State.islandPath.lineTo(verticesArr[9][3].cx, verticesArr[9][3].cy);
    c_State.islandPath.lineTo(verticesArr[10][3].cx, verticesArr[10][3].cy);
    c_State.islandPath.lineTo(verticesArr[11][2].cx, verticesArr[11][2].cy);
    c_State.islandPath.lineTo(verticesArr[10][2].cx, verticesArr[10][2].cy);
    c_State.islandPath.lineTo(verticesArr[11][1].cx, verticesArr[11][1].cy);
    c_State.islandPath.lineTo(verticesArr[10][1].cx, verticesArr[10][1].cy);
    c_State.islandPath.lineTo(verticesArr[11][0].cx, verticesArr[11][0].cy);
    c_State.islandPath.lineTo(verticesArr[10][0].cx, verticesArr[10][0].cy);
    c_State.islandPath.lineTo(verticesArr[9][0].cx, verticesArr[9][0].cy);
    c_State.islandPath.lineTo(verticesArr[8][0].cx, verticesArr[8][0].cy);
    c_State.islandPath.lineTo(verticesArr[7][0].cx, verticesArr[7][0].cy);
    c_State.islandPath.lineTo(verticesArr[6][0].cx, verticesArr[6][0].cy);
    c_State.islandPath.lineTo(verticesArr[5][0].cx, verticesArr[5][0].cy);
    c_State.islandPath.lineTo(verticesArr[4][0].cx, verticesArr[4][0].cy);
    c_State.islandPath.lineTo(verticesArr[3][0].cx, verticesArr[3][0].cy);
    c_State.islandPath.lineTo(verticesArr[2][0].cx, verticesArr[2][0].cy);
    c_State.islandPath.lineTo(verticesArr[1][0].cx, verticesArr[1][0].cy);
    c_State.islandPath.lineTo(verticesArr[0][0].cx, verticesArr[0][0].cy);
    c_State.islandPath.lineTo(verticesArr[1][1].cx, verticesArr[1][1].cy);
    ctx.closePath();
}

function initPorts(){

    var radius = c_State.tileRadius;
    var hexRad = 6.5/6 * radius

    //I'm just picking a vertex below or above the port to use as an anchor for positioning the port

    portsArr[0].cx = verticesArr[1][0].cx;
    portsArr[0].cy = verticesArr[1][0].cy - hexRad;

    portsArr[1].cx = verticesArr[1][2].cx;
    portsArr[1].cy = verticesArr[1][2].cy - hexRad;

    portsArr[2].cx = verticesArr[3][4].cx;
    portsArr[2].cy = verticesArr[3][4].cy - hexRad;

    portsArr[3].cx = verticesArr[5][0].cx;
    portsArr[3].cy = verticesArr[5][0].cy - hexRad;

    //this one is weird I need to use a tile because there isn't a convenient vertex
    portsArr[4].cx = tilesArr[2][4].cx + 2 * hexRad;
    portsArr[4].cy = tilesArr[2][4].cy;

    //these ones are back to normal
    portsArr[5].cx = verticesArr[6][0].cx;
    portsArr[5].cy = verticesArr[6][0].cy + hexRad;

    portsArr[6].cx = verticesArr[8][4].cx;
    portsArr[6].cy = verticesArr[8][4].cy + hexRad;

    portsArr[7].cx = verticesArr[10][0].cx;
    portsArr[7].cy = verticesArr[10][0].cy + hexRad;

    portsArr[8].cx = verticesArr[10][2].cx;
    portsArr[8].cy = verticesArr[10][2].cy + hexRad;
}

function initRoads(){

    var radius = c_State.tileRadius;
    var centerX;
    var centerY;
    var hexRad = radius * 7/6.5
    var hexAngle = ((2 * Math.PI) / 6)

    //loop through all edges
    for(var i = 0; i < 11; i++){

        //all rows of vertical edges
        if(i % 2 != 0){

            for(var j = 0; j < tilesArr[0.5 * (i - 1)].length; j++){

                centerX = tilesArr[0.5 * (i - 1)][j].cx
                centerY = tilesArr[0.5 * (i - 1)][j].cy

                //draw a road on left side of each tile
                hitbox = new Path2D()

                ctx.beginPath()
                hitbox.moveTo(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle) - 8, centerY + hexRad * Math.sin(2.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle) - 8, centerY + hexRad * Math.sin(3.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle))

                ctx.closePath()

                roadsArr[i].push(new Road(null, hitbox))

                //last road goes on right side of final tile in row
                if(j === tilesArr[0.5 * (i - 1)].length - 1){
                    
                    hitbox = new Path2D()

                    ctx.beginPath()
                    hitbox.moveTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
                    hitbox.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle))
                    hitbox.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle) + 8, centerY + hexRad * Math.sin(0.5*hexAngle))
                    hitbox.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle) + 8, centerY + hexRad * Math.sin(5.5*hexAngle))
                    hitbox.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))

                    ctx.closePath()

                    roadsArr[i].push(new Road(null, hitbox))
                }
            }
        }
        //rows of horizontal edges on top half of board
        else if(i < 5){

            for(var j = 0; j < tilesArr[0.5 * i].length; j++){

                //these paths need to move in direction normal to side of hexagon that the road is on
                //in order to form a right angle
                //thats why the points get a little messy

                //upslope
                centerX = tilesArr[0.5 * (i)][j].cx
                centerY = tilesArr[0.5 * (i)][j].cy

                //draw a road on upper left side of each tile
                hitbox = new Path2D()

                ctx.beginPath()
                hitbox.moveTo(centerX + hexRad * Math.cos(4.5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle) + 8 * Math.cos(4*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle) + 8 * Math.sin(4*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle) + 8 * Math.cos(4*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle) + 8 * Math.sin(4*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle))

                ctx.closePath()

                roadsArr[i].push(new Road(null, hitbox))

                //downslope
                
                //draw a road on upper right side of each tile
                hitbox = new Path2D()

                ctx.beginPath()
                hitbox.moveTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle) + 8 * Math.cos(5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle) + 8 * Math.sin(5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle) + 8 * Math.cos(5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle) + 8 * Math.sin(5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))

                ctx.closePath()

                roadsArr[i].push(new Road(null, hitbox))

            }
        }
        
        //rows of horizontal edges on bottom half of board
        else{

            for(var j = 0; j < tilesArr[0.5 * (i - 2)].length; j++){

                //these paths need to move in direction normal to side of hexagon that the road is on
                //in order to form a right angle
                //thats why the points get a little messy

                centerX = tilesArr[0.5 * (i - 2)][j].cx
                centerY = tilesArr[0.5 * (i - 2)][j].cy

                //downslope
                
                //draw a road on upper right side of each tile
                hitbox = new Path2D()

                ctx.beginPath()
                hitbox.moveTo(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle) + 8 * Math.cos(2*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle) + 8 * Math.sin(2*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle) + 8 * Math.cos(2*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle) + 8 * Math.sin(2*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle))

                ctx.closePath()

                roadsArr[i].push(new Road(null, hitbox))

                //upslope
                //draw a road on upper left side of each tile
                hitbox = new Path2D()

                ctx.beginPath()
                hitbox.moveTo(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle) + 8 * Math.cos(1*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle) + 8 * Math.sin(1*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle) + 8 * Math.cos(1*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle) + 8 * Math.sin(1*hexAngle))
                hitbox.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle))

                ctx.closePath()

                roadsArr[i].push(new Road(null, hitbox))
            }
        }
    }

    //loop through roads again to connect adjacent roads
    for(var i = 0; i < 11; i++){

        for(var j = 0; j < roadsArr[i].length; j++){

            //"horizontal" rows
            if(i % 2 === 0){

                //add road on left if not the first road in row
                if(j > 0){
                    roadsArr[i][j].adjRoads.push(roadsArr[i][j-1]);
                }

                //add road on right if not the last road in row
                if(j < roadsArr[i].length - 1){
                    roadsArr[i][j].adjRoads.push(roadsArr[i][j+1]);
                }
            }

            //"vertical" rows
            else{
                //first two vertical rows
                if(i < 4){
                    //edge cases
                    if(j === 0){
                        //above right
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                        roadsArr[i-1][j*2].adjRoads.push(roadsArr[i][j]);

                    }else if(j === roadsArr[i].length - 1){
                        //above left
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) - 1]);
                        roadsArr[i-1][(j*2) - 1].adjRoads.push(roadsArr[i][j]);

                    }
                    //regular ones
                    else{
                        
                        //above left
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) - 1]);
                        roadsArr[i-1][(j*2) - 1].adjRoads.push(roadsArr[i][j]); 
                        
                        //above right
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                        roadsArr[i-1][j*2].adjRoads.push(roadsArr[i][j]);
                    }

                    //below left
                    roadsArr[i][j].adjRoads.push(roadsArr[i+1][j*2]);
                    roadsArr[i+1][j*2].adjRoads.push(roadsArr[i][j]);

                    //below right
                    roadsArr[i][j].adjRoads.push(roadsArr[i+1][(j*2) + 1]);
                    roadsArr[i+1][(j*2) + 1].adjRoads.push(roadsArr[i][j]);

                }
                //middle vertical row
                else if(i == 5){

                    //edge cases
                    if(j === 0){
                        //above
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][j]);
                        roadsArr[i-1][j].adjRoads.push(roadsArr[i][j]);

                        //below
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][j]);
                        roadsArr[i+1][j].adjRoads.push(roadsArr[i][j]);
                    }
                    else if(j === 5){
                        //above
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) - 1]);
                        roadsArr[i-1][(j*2) - 1].adjRoads.push(roadsArr[i][j]);

                        //below
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][(j*2) - 1]);
                        roadsArr[i+1][(j*2) - 1].adjRoads.push(roadsArr[i][j]);
                    }

                    //middle roads of middle row
                    else{
                        //above left 
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) - 1]);
                        roadsArr[i-1][(j*2) - 1].adjRoads.push(roadsArr[i][j]);

                        //below left 
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][(j*2) - 1]);
                        roadsArr[i+1][(j*2) - 1].adjRoads.push(roadsArr[i][j]);
                    

                        //above right 
                        roadsArr[i][j].adjRoads.push(roadsArr[i-1][(j*2)]);
                        roadsArr[i-1][(j*2)].adjRoads.push(roadsArr[i][j]);

                        //below right
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][(j*2)]);
                        roadsArr[i+1][(j*2)].adjRoads.push(roadsArr[i][j]);
                    }


                }
                //last two vertical rows
                else if(i > 6){

                    //edge cases
                    if(j === 0){
                        //below right
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][j*2]);
                        roadsArr[i+1][j*2].adjRoads.push(roadsArr[i][j]);

                    }else if(j === roadsArr[i].length - 1){
                        //below left
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][(j*2) - 1]);
                        roadsArr[i+1][(j*2) - 1].adjRoads.push(roadsArr[i][j]);

                    }
                    //regular ones
                    else{
                        
                        //below left
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][(j*2) - 1]);
                        roadsArr[i+1][(j*2) - 1].adjRoads.push(roadsArr[i][j]); 
                        
                        //below right
                        roadsArr[i][j].adjRoads.push(roadsArr[i+1][j*2]);
                        roadsArr[i+1][j*2].adjRoads.push(roadsArr[i][j]);
                    }

                    //above left
                    roadsArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                    roadsArr[i-1][j*2].adjRoads.push(roadsArr[i][j]);

                    //above right
                    roadsArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) + 1]);
                    roadsArr[i-1][(j*2) + 1].adjRoads.push(roadsArr[i][j]);

                }
            }
            roadsArr[i][j].i = i;
            roadsArr[i][j].j = j;
        }
    }

    //loop through all vertices and add adjacent roads also add adjacent verts to each road
    for(let i = 0; i < verticesArr.length; i++){
        for(let j = 0; j < verticesArr[i].length; j++){

            //vertical adjacent road
            if(i !== 0 && i !== 11){

                //in even rows road goes down
                if(i%2 === 0){
                    verticesArr[i][j].adjRoads.push(roadsArr[i-1][j]);
                    roadsArr[i-1][j].adjVerts.push(verticesArr[i][j])
                }else{
                    verticesArr[i][j].adjRoads.push(roadsArr[i][j]);
                    roadsArr[i][j].adjVerts.push(verticesArr[i][j])
                }
            }

            //right road is added if road is not on rightside border
            if(  !((j === verticesArr[i].length - 1) && (i === 1 || i === 3 || i === 5 || i === 6 || i === 8 || i === 10))){

                //top half of board
                if(i <= 5){
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][(j*2) + 1]);
                        roadsArr[i][(j*2) + 1].adjVerts.push(verticesArr[i][j])
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                        roadsArr[i-1][j*2].adjVerts.push(verticesArr[i][j])
                    }
                }

                //bottom half of board
                else{
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][j*2]);
                        roadsArr[i][j*2].adjVerts.push(verticesArr[i][j])
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) + 1]);
                        roadsArr[i-1][(j*2) + 1].adjVerts.push(verticesArr[i][j])
                    }
                }
                

            }

            //left road is added if road is not on leftside border
            if(!((i === 1 || i === 3 || i === 5 || i === 6 || i === 8 || i === 10) && j === 0)){

                //top half of board
                if(i <= 5){
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][j*2]);
                        roadsArr[i][j*2].adjVerts.push(verticesArr[i][j])
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) - 1]);
                        roadsArr[i-1][(j*2) - 1].adjVerts.push(verticesArr[i][j])
                    }
                }

                //bottom half of board
                else{
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][(j*2) - 1]);
                        roadsArr[i][(j*2) - 1].adjVerts.push(verticesArr[i][j])
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                        roadsArr[i-1][j*2].adjVerts.push(verticesArr[i][j])
                    }
                }
            }
        }
    }
}

//TODO change all push commands to modify existing vertex in place
// create new init vertices method to fix order issue for method calls w board.js
// then initVertices can be called in initCanvasElements
function initVertices(){

    var radius = c_State.tileRadius;
    var centerX;
    var centerY;
    var hexRad = radius * 7/6
    var hexAngle = ((2 * Math.PI) / 6)

    //loop through all tiles
    for(var i = 0; i < 5; i++){

        centerY = tilesArr[i][0].cy

        for(var j = 0; j < tilesArr[i].length; j++){
            
            centerX = tilesArr[i][j].cx;

            hitbox = new Path2D()
            //draw a circle at vertex north of tile
            ctx.beginPath();
            hitbox.arc(centerX, centerY - hexRad, 15, 0, 2 * Math.PI, false);
            ctx.closePath()

            verticesArr[i*2].push(new Vertex(centerX, centerY - hexRad, hitbox))
            
            hitbox = new Path2D()
            //draw a circle at vertex northwest of tile
            ctx.beginPath();
            hitbox.arc(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle), 15, 0, 2 * Math.PI, false);
            ctx.closePath()

            verticesArr[(i * 2) + 1].push(new Vertex(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle), hitbox))

            //draw vertex only on tile at end of row
            //on tiles not at end this would be redundant
            if(j === tilesArr[i].length - 1){

                hitbox = new Path2D()
                //draw a circle at vertex north east of tile
                ctx.beginPath();
                hitbox.arc(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle), 15, 0, 2 * Math.PI, false);
                ctx.closePath()

                verticesArr[(i * 2) + 1].push(new Vertex(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle), hitbox))
            }

            //draw southwest vertex on first tile of rows with less tiles than row above them 
            if(i > 1 && j === 0){

                hitbox = new Path2D()
                //draw a circle at vertex southwest of tile
                ctx.beginPath();
                hitbox.arc(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle), 15, 0, 2 * Math.PI, false);
                ctx.closePath()

                verticesArr[(i * 2) + 2].push(new Vertex(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle), hitbox))
            }

            //draw southeast vertex on last tile of rows with less tiles than row above them
            if(i > 1 && i < 4 && j === tilesArr[i].length - 1){
                
                hitbox = new Path2D()
                //draw a circle at vertex southwest of tile
                ctx.beginPath();
                hitbox.arc(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle), 15, 0, 2 * Math.PI, false);
                ctx.closePath()

                verticesArr[(i * 2) + 2].push(new Vertex(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle), hitbox))
            }

            //draw south vertex and south east vertex on bottom row of tiles
            if(i === 4){

                hitbox = new Path2D()
                //draw a circle at vertex south of tile
                ctx.beginPath();
                hitbox.arc(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle), 15, 0, 2 * Math.PI, false);
                ctx.closePath()

                verticesArr[11].push(new Vertex(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle), hitbox))

                hitbox = new Path2D()
                //draw a circle at vertex southwest of tile
                ctx.beginPath();
                hitbox.arc(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle), 15, 0, 2 * Math.PI, false);
                ctx.closePath()

                verticesArr[10].push(new Vertex(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle), hitbox))
            }
        }
    }

    //fix rows 6 and 8 by moving out of order index to back
    verticesArr[6].push(verticesArr[6].splice(1, 1)[0])
    verticesArr[8].push(verticesArr[8].splice(1, 1)[0])

    //loop through all tiles again now that vertices exist and link each vertex to adjacent tiles
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < tilesArr[i].length; j++){

            //link all 6 adjacent vertices to tile
            //south and north change coordinates if they're on the top or bottom half of board

            //north
            if(i < 3){
                verticesArr[2 * i][j].adjTiles.push(tilesArr[i][j])
            }else{
                verticesArr[2 * i][j + 1].adjTiles.push(tilesArr[i][j])
            }

            //northeast
            verticesArr[(2 * i) + 1][j + 1].adjTiles.push(tilesArr[i][j])

            //southeast
            verticesArr[2 * (i + 1)][j + 1].adjTiles.push(tilesArr[i][j])

            //south
            if(i < 2){
                verticesArr[(2 * i) + 3][j + 1].adjTiles.push(tilesArr[i][j])
            }else{
                verticesArr[(2 * i) + 3][j].adjTiles.push(tilesArr[i][j])
            }
            
            //southwest
            verticesArr[2 * (i + 1)][j].adjTiles.push(tilesArr[i][j])

            //northwest
            verticesArr[2 * i + 1][j].adjTiles.push(tilesArr[i][j])

        }
    }

    //link vertices to adjacent vertices
    for(var i = 0; i < 12; i++){
        for(var j = 0; j < verticesArr[i].length; j++){
            
            //vertical
            //1 3 5 7 and 9 link down 
            //2 4 6 8 and 10 link upwards
            //0s and 11s have no vertical link
            if(i === 1 || i === 3 || i === 5 || i === 7 || i === 9){
                verticesArr[i][j].adjVerts.push(verticesArr[i + 1][j]);
                verticesArr[i + 1][j].adjVerts.push(verticesArr[i][j]);
            }

            //rule for top half of evens
            if(i < 5 && i%2 === 0){

                //push left
                verticesArr[i][j].adjVerts.push(verticesArr[i + 1][j]);
                verticesArr[i + 1][j].adjVerts.push(verticesArr[i][j]);

                //push right
                verticesArr[i][j].adjVerts.push(verticesArr[i + 1][j + 1]);
                verticesArr[i + 1][j + 1].adjVerts.push(verticesArr[i][j]);
            }

            //similar rule for bottom half of evens
            if(i > 6 && i%2 == 1){

                //push left
                verticesArr[i][j].adjVerts.push(verticesArr[i - 1][j]);
                verticesArr[i - 1][j].adjVerts.push(verticesArr[i][j]);

                //push right
                verticesArr[i][j].adjVerts.push(verticesArr[i - 1][j + 1]);
                verticesArr[i - 1][j + 1].adjVerts.push(verticesArr[i][j]);
            }
        }
    }
}