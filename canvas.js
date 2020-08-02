//this file is to handle all of the code related to the canvas element

//basic setup to work with canvas element
var canvas = document.getElementById('canvas')
var canvasDiv = document.getElementById('canvasDiv')

canvasDiv.height = document.getElementById("left").clientHeight

canvas.width  = canvasDiv.clientWidth //- 1;

//console.log(canvasDiv.clientWidth)
//canvasDiv.style.width = 5;
//console.log(canvasDiv.clientWidth)

//canvasDiv.style.outlineWidth = "1px";
canvas.height = document.getElementById("left").clientHeight - document.getElementById("controls").clientHeight

var ctx = canvas.getContext('2d')
ctx.font= "30px Arial";

var textured = false;

var texturesLoaded = 0;

var robberImage = new Image();
robberImage.src = "assets/robber.svg"

var robberLoaded = false;
var movingRobber = false;
var showRoads = false;

var colorVals = ["green", "firebrick", "lightgreen", "#ffff99", "slategrey", "blue"]

var islandPath; 


canvas.addEventListener('click', function(e) {

    //debugging help
    //console.log(p1)

    //loop through all vertices
    for(var i = 0; i < 12; i++){

        for(var j = 0; j < verticesArr[i].length; j++){

            //if click occurred in vertex hitbox do something
            if (ctx.isPointInPath(verticesArr[i][j].hitbox, e.offsetX, e.offsetY)){
                
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
            if (ctx.isPointInPath(tilesArr[i][j].hitbox, e.offsetX, e.offsetY)) {
                console.log(tilesArr[i][j]);

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

                    //reenable buttons to work
                    unfreeze()
                    
                    //if this isn't here I get an error but the error doesn't seem to cause any problems
                    //it just makes me uncomfortable
                    return;
                }

            }

            
        }
    }

    //loop through all roads
    let roads = currPlayer.getBuildableRoads()
    //console.log(roads);

    for(let i = 0; i < roads.length; i++){
        if(ctx.isPointInPath(roads[i].hitbox, e.offsetX, e.offsetY)){

            if(buildingRoad){
                buildRoad(roads[i], currPlayer);
            }
        }

    }

    for(var i = 0; i < 11; i++){

        for(var j = 0; j < roadsArr[i].length; j++){

            if(ctx.isPointInPath(roadsArr[i][j].hitbox, e.offsetX, e.offsetY)){
                console.log(roadsArr[i][j])


                // if(buildingRoad){
                //     buildRoad(roadsArr[i][j], currPlayer)
                // }

            }

        }

    }



});

function toggleTexture(){
    textured = !textured
    drawCanvas()
}

//draw the dice in corner of canvas
function drawDice(){
    var diceImgs = []
    for(i=0; i<diceArr.length; i++){
  
        //this thing is called a closure but idk how it works tbh
        (function (i) {
            var xPos = ((i * 65) + 20);
            var yPos = 5;
            diceImgs[i] = new Image();
            diceImgs[i].src = diceArr[i].getImg();

            diceImgs[i].onload = function () {
                ctx.drawImage(diceImgs[i], xPos, yPos, 60, 60);
            };

        })(i);
  
    }
    //remove me I don't belong here
    //drawCircles()
}

function drawTileTextures(){
    
    //setTimeout(drawTiles(), 5000);

    var centerX = canvas.width /2;
    var centerY = 2 * (canvas.height / 7) - 50;
    //var radius = canvas.height/11.5;
    var radius = 60

    texturesLoaded = 0;

    for(var i = 0; i < 5; i++){
        //centerY = ((2 + i) * (canvas.height / 7)) - radius;

        //some circle packing magic thats like a 30-60-90 triangle
        centerY = (canvas.height / 2) - Math.sqrt(3)*radius*(2-i);

        var times;

        //first and last row
        if(i === 0 || i === 4){
            centerX = (canvas.width/2) - 3.5*radius
            times = 3;
        }
        //second and second to last row
        if(i === 1 || i === 3){
            centerX = (canvas.width/2) - 4.5*radius
            times = 4;
        }
        //middle row
        if(i === 2){
            centerX = (canvas.width/2) - 5.5*radius
            times = 5;
        }

        for(var j = 0; j < times; j++){

            //draw hexagon
            var hexAngle = ((2 * Math.PI) / 6)

            //7/6 makes the hexagons flushhh 6.9/6 looks nicer anything below leaves a gap
            var hexRad = radius * 6.5/6
            
            tilesArr[i][j].img = new Image();
            tilesArr[i][j].img.src = tilesArr[i][j].getPath()

            //console.log(tilesArr[i][j].img)

            
            //this is a miracle
            var drawTheImage = function(ctx, tilesArr, i, j, centerX, centerY) {
                return function() {

                    //save state of canvas define a closed path on canvas
                    ctx.save();
                    ctx.beginPath()
                    ctx.moveTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
                    ctx.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle))
                    ctx.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle))
                    ctx.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle))
                    ctx.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle))
                    ctx.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle))
                    ctx.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
                    ctx.closePath()
                    ctx.clip();
                    
                    //draw image(inside of path only)
                    ctx.drawImage(tilesArr[i][j].img, centerX - (hexRad), centerY - (hexRad), 300, 300);

                    //remove path and restore canvas to normal
                    ctx.restore();

                    texturesLoaded++


                    //pay attention to this here because it is wrong
                    //this will immediately start drawing tiles
                    //any number of the image functions could have finished but none are guaranteed to

                    //accidental race condition
                    // if(i == 4 && j == 2){
                    //     drawCircles()
                    //     //console.log("boop")
                    // }
                }
                
            }

            tilesArr[i][j].img.onload = drawTheImage(ctx, tilesArr, i, j, centerX, centerY);

            centerX += radius * 2 
            
        }


    } 
    loadTiles()
   

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadTiles(){

    //waste time until tiles load

    //console.log("time 1")
    await sleep(1)
    //console.log("time 2")
    drawTiles()
    drawRobber()
    drawSettlements()

}

function drawVertices(){
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = "white";
    ctx.font = "15px Arial"

    for(var i = 0; i < 12; i++){

        for(var j = 0; j < verticesArr[i].length; j++){
            
            if(verticesArr[i][j].settlement === null && verticesArr[i][j].dead !== true){
                ctx.fillStyle = "white";
                ctx.fill(verticesArr[i][j].hitbox)
                ctx.stroke(verticesArr[i][j].hitbox)

                //for debug
                ctx.fillStyle = "black"
                ctx.fillText(i + "," + j, verticesArr[i][j].cx, verticesArr[i][j].cy + 5)
            }
        }

    }
}

function initRoads(){

    var radius = 60;
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

    //loop through all vertices and add adjacent roads
    for(let i = 0; i < verticesArr.length; i++){
        for(let j = 0; j < verticesArr[i].length; j++){

            //vertical adjacent road
            if(i !== 0 && i !== 11){

                //in even rows road goes down
                if(i%2 === 0){
                    verticesArr[i][j].adjRoads.push(roadsArr[i-1][j]);
                }else{
                    verticesArr[i][j].adjRoads.push(roadsArr[i][j]);
                }

            }

            //right road is added if road is not on rightside border
            if(!((i === 1 || i === 3 || i === 5 || i === 6 || i === 8 || i === 10) && j === verticesArr[i].length)){

                //top half of board
                if(i <= 5){
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][(j*2) + 1]);
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                    }
                }

                //bottom half of board
                else{
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][j*2]);
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) + 1]);
                    }
                }
                

            }

            //left road is added if road is not on leftside border
            if(!((i === 1 || i === 3 || i === 5 || i === 6 || i === 8 || i === 10) && j === 0)){

                //top half of board
                if(i <= 5){
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][j*2]);
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][(j*2) - 1]);
                    }
                }

                //bottom half of board
                else{
                    if(i%2 === 0){
                        verticesArr[i][j].adjRoads.push(roadsArr[i][(j*2) - 1]);
                    }else{
                        verticesArr[i][j].adjRoads.push(roadsArr[i-1][j*2]);
                    }
                }
                

            }



        }
    }

}

function initVertices(){

    var radius = 60;
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

    //console.log(verticesArr)

}


function initPorts(){

    var radius = 60;
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


//this actually draws hexagons now but it could do circles or whatever else involves visiting 
//center point of each tile
//this function should be called drawTiles lol
function drawTiles(){
    var centerX = canvas.width /2;
    var centerY = 2 * (canvas.height / 7) - 50;
    //var radius = canvas.height/11.5;
    var radius = 60;
    

    //how to draw a circle in case I forget
    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    // ctx.lineWidth = 5;
    // ctx.strokeStyle = '#003300';
    // ctx.stroke();

    ctx.textAlign = "center"
    ctx.font = "20px Arial";

    for(var i = 0; i < 5; i++){
        //centerY = ((2 + i) * (canvas.height / 7)) - radius;

        //some circle packing magic thats like a 30-60-90 triangle
        centerY = (canvas.height / 2) - Math.sqrt(3)*radius*(2-i);

        var times;

        //first and last row
        if(i === 0 || i === 4){
            centerX = (canvas.width/2) - 3.5*radius
            times = 3;
        }
        //second and second to last row
        if(i === 1 || i === 3){
            centerX = (canvas.width/2) - 4.5*radius
            times = 4;
        }
        //middle row
        if(i === 2){
            centerX = (canvas.width/2) - 5.5*radius
            times = 5;
        }

        for(var j = 0; j < times; j++){

            //draw hexagon
            var hexAngle = ((2 * Math.PI) / 6)

            //7/6 makes the hexagons flush 6.9/6 looks nicer anything below leaves a gap
            var hexRad = radius * 6.5/6

            tilesArr[i][j].cx = centerX;
            tilesArr[i][j].cy = centerY;
            
            if(!textured){

                tilesArr[i][j].hitbox = new Path2D()

                //makes hexagon with color
                ctx.beginPath();
                tilesArr[i][j].hitbox.moveTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
                tilesArr[i][j].hitbox.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle))
                tilesArr[i][j].hitbox.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle))
                tilesArr[i][j].hitbox.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle))
                tilesArr[i][j].hitbox.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle))
                tilesArr[i][j].hitbox.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle))
                tilesArr[i][j].hitbox.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.closePath()
                ctx.stroke(tilesArr[i][j].hitbox)
                
                
                ctx.fillStyle = tilesArr[i][j].color
                ctx.fill(tilesArr[i][j].hitbox)
            }

            //outer circle of size radius
            // ctx.beginPath();
            // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = 'black';
            // ctx.closePath()
            // ctx.stroke();
            
            //dont draw a num tile on the desert
            if(tilesArr[i][j].number != 7){
                //draw inner circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI, false);
                ctx.lineWidth = 0;
                ctx.strokeStyle = 'black';
                ctx.closePath()
                ctx.stroke();
                ctx.fillStyle = "white"
                ctx.fill()

                ctx.fillStyle = "black"
                if(tilesArr[i][j].number === 6 || tilesArr[i][j].number === 8){
                    ctx.fillStyle = "red"
                }

                ctx.fillText(tilesArr[i][j].number, centerX, centerY + 5)

                //draw dots
                var dots = (6 - Math.abs(7 - tilesArr[i][j].number))

                //this makes sure the dots are centered
                var offSetX = 2.5 * (dots-1.25)

                for(var k = 0; k < dots; k++){
                    ctx.beginPath();
                    ctx.arc(centerX + 5*k - offSetX, centerY + 12, 1.5, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'black';
                    ctx.closePath()
                    ctx.stroke();
                    ctx.fillStyle = "black"
                    if(dots === 5){
                        ctx.fillStyle = "red"
                    }
                    ctx.fill()
                }
                
            }

            centerX += radius * 2 
        }

    }

    //console.log(tilesArr)
}

function drawBank(){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    //draw box for bank to go in
    ctx.beginPath()
    ctx.rect(canvas.width - 325, 5, 320, 80);
    ctx.stroke();
    ctx.fillStyle = "antiquewhite"
    ctx.fill()

    ctx.font = "15px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("Bank", canvas.width - 325/2, 20)
    
    //draw numbers for resources
    for(var i = 0; i < 6; i++){
        ctx.fillStyle = "black"
        ctx.font = "15px Arial"
        if(i<5){
            ctx.beginPath()
            ctx.rect(canvas.width - 311 + (i*320/6), 25, 25, 35)
            ctx.stroke()
            ctx.fillStyle = colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            ctx.fillText(bank[i], canvas.width - 300 + (i*320/6) + i/2, 78)
        }else{
            ctx.beginPath()
            ctx.rect(canvas.width - 311 + (i*320/6), 25, 25, 35)
            ctx.stroke()
            ctx.fillStyle = colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            ctx.fillText(devCardArray.length, canvas.width - 300 + (i*320/6) + i/2, 78)
        }
        
    }
}


function drawPorts(){

    for(var i = 0; i < portsArr.length; i++){

        ctx.textAlign = "center"
        ctx.strokeStyle = "PERU"
        ctx.lineWidth = 8;

        //draw lines to ports
        ctx.beginPath();
        ctx.moveTo(portsArr[i].cx, portsArr[i].cy)
        ctx.lineTo(portsArr[i].vertices[0].cx, portsArr[i].vertices[0].cy)
        ctx.stroke()

        ctx.beginPath();
        ctx.moveTo(portsArr[i].cx, portsArr[i].cy)
        ctx.lineTo(portsArr[i].vertices[1].cx, portsArr[i].vertices[1].cy)
        ctx.stroke()

        ctx.lineWidth = 3

        //draw port itself
        ctx.beginPath();
        ctx.arc(portsArr[i].cx, portsArr[i].cy, 20, 0, 2 * Math.PI, false);
        ctx.lineWidth = 0;
        ctx.strokeStyle = 'black';
        ctx.closePath()
        ctx.stroke();
        ctx.fillStyle = "white"
        ctx.fill()

        //draw text on top
        ctx.fillStyle = "black"
        ctx.fillText(portsArr[i].trade, portsArr[i].cx, portsArr[i].cy + 5)

    }
}

//defines a path around the perimeter of the island
function initIslandPath(){

    islandPath = new Path2D();

    ctx.beginPath();
    islandPath.moveTo(verticesArr[0][0].cx, verticesArr[0][0].cy);
    islandPath.lineTo(verticesArr[1][1].cx, verticesArr[1][1].cy);
    islandPath.lineTo(verticesArr[0][1].cx, verticesArr[0][1].cy);
    islandPath.lineTo(verticesArr[1][2].cx, verticesArr[1][2].cy);
    islandPath.lineTo(verticesArr[0][2].cx, verticesArr[0][2].cy);
    islandPath.lineTo(verticesArr[1][3].cx, verticesArr[1][3].cy);
    islandPath.lineTo(verticesArr[2][3].cx, verticesArr[2][3].cy);
    islandPath.lineTo(verticesArr[3][4].cx, verticesArr[3][4].cy);
    islandPath.lineTo(verticesArr[4][4].cx, verticesArr[4][4].cy);
    islandPath.lineTo(verticesArr[5][5].cx, verticesArr[5][5].cy);
    islandPath.lineTo(verticesArr[6][5].cx, verticesArr[6][5].cy);
    islandPath.lineTo(verticesArr[7][4].cx, verticesArr[7][4].cy);
    islandPath.lineTo(verticesArr[8][4].cx, verticesArr[8][4].cy);
    islandPath.lineTo(verticesArr[9][3].cx, verticesArr[9][3].cy);
    islandPath.lineTo(verticesArr[10][3].cx, verticesArr[10][3].cy);
    islandPath.lineTo(verticesArr[11][2].cx, verticesArr[11][2].cy);
    islandPath.lineTo(verticesArr[10][2].cx, verticesArr[10][2].cy);
    islandPath.lineTo(verticesArr[11][1].cx, verticesArr[11][1].cy);
    islandPath.lineTo(verticesArr[10][1].cx, verticesArr[10][1].cy);
    islandPath.lineTo(verticesArr[11][0].cx, verticesArr[11][0].cy);
    islandPath.lineTo(verticesArr[10][0].cx, verticesArr[10][0].cy);
    islandPath.lineTo(verticesArr[9][0].cx, verticesArr[9][0].cy);
    islandPath.lineTo(verticesArr[8][0].cx, verticesArr[8][0].cy);
    islandPath.lineTo(verticesArr[7][0].cx, verticesArr[7][0].cy);
    islandPath.lineTo(verticesArr[6][0].cx, verticesArr[6][0].cy);
    islandPath.lineTo(verticesArr[5][0].cx, verticesArr[5][0].cy);
    islandPath.lineTo(verticesArr[4][0].cx, verticesArr[4][0].cy);
    islandPath.lineTo(verticesArr[3][0].cx, verticesArr[3][0].cy);
    islandPath.lineTo(verticesArr[2][0].cx, verticesArr[2][0].cy);
    islandPath.lineTo(verticesArr[1][0].cx, verticesArr[1][0].cy);
    islandPath.lineTo(verticesArr[0][0].cx, verticesArr[0][0].cy);
    islandPath.lineTo(verticesArr[1][1].cx, verticesArr[1][1].cy);
    ctx.closePath();

}

function drawIsland(){

    var gradient = ctx.createRadialGradient(canvas.width/2 - 90,canvas.height/2, 150, canvas.width/2 - 90,canvas.height/2, 200);
    gradient.addColorStop(0, "#DEB887");
    gradient.addColorStop(1, 'wheat');


    //this color is called burly wood
    ctx.fillStyle = gradient
    ctx.lineWidth = 8;
    ctx.strokeStyle = "wheat"
    ctx.stroke(islandPath);
    ctx.fill(islandPath);

}


function drawRoads(){

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"


    for(var i = 0; i < 11; i++){

        for(var j = 0; j < roadsArr[i].length; j++){
            
            if(roadsArr[i][j].player != null){

                //change color to color of player who owns it
                ctx.fillStyle = roadsArr[i][j].player.color;
                ctx.fill(roadsArr[i][j].hitbox)
                ctx.stroke(roadsArr[i][j].hitbox)

            }
            
        }

    }
    if(showRoads){
        let adjRoads = currPlayer.getBuildableRoads();

        //show buildable roads
        for(let i = 0; i < adjRoads.length; i++){
            //draw the road
            if(adjRoads[i].player === null){
                            
                ctx.fillStyle = "white";
                ctx.fill(adjRoads[i].hitbox)
                ctx.stroke(adjRoads[i].hitbox)

            }
        }
    }
    
}

//write me
function drawSettlements(){
    
    // ctx.lineWidth = 3;
    // ctx.strokeStyle = 'black';
    // ctx.fillStyle = "white";
    // ctx.font = "15px Arial"

    for(var i = 0; i < 12; i++){

        for(var j = 0; j < verticesArr[i].length; j++){
            
            //draw the settlement
            if(verticesArr[i][j].settlement != null){
                
                //change color to color of player who owns it
                ctx.fillStyle = verticesArr[i][j].settlement.player.color;
                ctx.fill(verticesArr[i][j].hitbox)
                ctx.stroke(verticesArr[i][j].hitbox)

                //console.log(verticesArr[i][j])

                if(verticesArr[i][j].settlement.isCity){

                    let cx = verticesArr[i][j].cx;
                    let cy = verticesArr[i][j].cy;

                    ctx.beginPath();
                    ctx.arc(cx, cy, 5, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke()
                    // ctx.fillStyle = "black"
                    // ctx.fill();

                }
            }


            
        }

    }
}

//write me
function drawTimer(){

}

function drawTurnNum(){
    ctx.textAlign = "right"
    ctx.font = "Arial 15px"
    ctx.fillText("Turn #" + turnNumber, canvas.width - 5, 100)
}


function drawRobber(){

    // if(!robberLoaded){
    //     robberImage.onload = function(){
    //         ctx.drawImage(robberImage, robberLocation.cx - 55, robberLocation.cy - 20, 40, 40);
    //         //console.log("drawing at " + robberLocation.cx + "," + robberLocation.cy)
    //         robberLoaded = true;
    //     }
    // }else{
        ctx.drawImage(robberImage, robberLocation.cx - 55, robberLocation.cy - 20, 40, 40);
    //}
    
}

function drawCanvas(){

    //draw the background maybe here
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#B0E0E6"
    ctx.fill()

    drawDice()
    drawBank()
    drawTurnNum()

    drawPorts()
    drawIsland();

    if(textured){
        drawTileTextures()
    }else{
        drawTiles()
    }

    //drawVertices()
    drawRoads()
    drawSettlements()
    drawRobber()


    //this one can be uncommented when it exists
    // if(showTime){
    //     drawTimer()
    // }

    drawPlayerInfo()

}