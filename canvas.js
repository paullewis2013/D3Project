//this file is to handle all of the code related to the canvas element

//basic setup to work with canvas element
var canvas = document.getElementById('canvas')
var canvasDiv = document.getElementById('canvasDiv')
canvas.style.background = 'powderblue'
canvas.width  = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;

var ctx = canvas.getContext('2d')
ctx.font= "30px Arial";

var textured = false;

var robberImage = new Image();
robberImage.src = "assets/robber.svg"
var robberLoaded = false;
var movingRobber = false;

var colorVals = ["green", "firebrick", "lightgreen", "#ffff99", "slategrey", "blue"]


canvas.addEventListener('mousedown', function(e) {
    
    
    //loop through all tiles
    for(i = 0; i < 5; i++){
        for(j = 0; j < tilesArr[i].length; j++){

            //if click occurred in tile hitbox do something
            if (ctx.isPointInPath(tilesArr[i][j].hitbox, e.offsetX, e.offsetY)) {
                console.log(tilesArr[i][j]);

                if(movingRobber){
                    robberLocation = tilesArr[i][j]
                    movingRobber = false;
                    tilesArr[i][j].block()
                    
                    if(textured){
                        drawTileTextures()
                    }
                    drawTiles()
                    drawRobber()

                    //TODO select player to steal from if multiple are adjacent

                    //reenable buttons to work
                    unfreeze()
                }

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
            var xPos = ((i * 65) + 10);
            var yPos = 10;
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
    var centerX = canvas.width /2;
    var centerY = 2 * (canvas.height / 7) - 50;
    var radius = canvas.height/11.5;

    for(i = 0; i < 5; i++){
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

        for(j = 0; j < times; j++){

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
                    ctx.drawImage(tilesArr[i][j].img, centerX - (hexRad + Math.random()*200), centerY - (hexRad + Math.random()*200), 500, 500);

                    //remove path and restore canvas to normal
                    ctx.restore();

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
    setTimeout(drawTiles(), 5500)

}

//this actually draws hexagons now but it could do circles or whatever else involves visiting 
//center point of each tile
//this function should be called drawTiles lol
function drawTiles(){
    var centerX = canvas.width /2;
    var centerY = 2 * (canvas.height / 7) - 50;
    var radius = canvas.height/11.5;

    //how to draw a circle in case I forget
    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    // ctx.lineWidth = 5;
    // ctx.strokeStyle = '#003300';
    // ctx.stroke();

    ctx.textAlign = "center"
    ctx.font = "20px Arial";

    for(i = 0; i < 5; i++){
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

        for(j = 0; j < times; j++){

            //draw hexagon
            var hexAngle = ((2 * Math.PI) / 6)

            //7/6 makes the hexagons flushhh 6.9/6 looks nicer anything below leaves a gap
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
            }else{

                //wait for textures to load
                //drawTileTextures()

            }
            

            //outer circle of size radius
            // ctx.beginPath();
            // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = 'black';
            // ctx.closePath()
            // ctx.stroke();
            
            //dont draw a num tile on the desert
            //console.log(tilesArr[i][j].number)

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
                if(tilesArr[i][j].number == 6 || tilesArr[i][j].number == 8){
                    ctx.fillStyle = "red"
                }

                ctx.fillText(tilesArr[i][j].number, centerX, centerY + 5)

                //draw dots
                var dots = (6 - Math.abs(7 - tilesArr[i][j].number))

                //this makes sure the dots are centered
                var offSetX = 2.5 * (dots-1.25)

                for(k = 0; k < dots; k++){
                    ctx.beginPath();
                    ctx.arc(centerX + 5*k - offSetX, centerY + 12, 1.5, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'black';
                    ctx.closePath()
                    ctx.stroke();
                    ctx.fillStyle = "black"
                    if(dots == 5){
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

    //draw box for bank to go in
    ctx.beginPath()
    ctx.rect(canvas.width - 330, 10, 320, 100);
    ctx.stroke();
    ctx.fillStyle = "antiquewhite"
    ctx.fill()
    
    //draw numbers for resources
    for(i=0; i < 6; i++){
        ctx.fillStyle = "black"
        ctx.font = "15px Arial"
        if(i<5){
            ctx.beginPath()
            ctx.rect(canvas.width - 316 + (i*320/6), 30, 25, 25)
            ctx.stroke()
            ctx.fillStyle = colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            ctx.fillText(bank[i], canvas.width - 305 + (i*320/6), 95)
        }else{
            ctx.beginPath()
            ctx.rect(canvas.width - 316 + (i*320/6), 30, 25, 25)
            ctx.stroke()
            ctx.fillStyle = colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            ctx.fillText(devCardArray.length, canvas.width - 305 + (i*320/6), 95)
        }
        
    }
}

//write me
function drawRoads(){

}

//write me
function drawSettlements(){

}

//write me
function drawTimer(){

}

//write me
function drawRobber(){

    if(!robberLoaded){
        robberImage.onload = function(){
            ctx.drawImage(robberImage, robberLocation.cx - 55, robberLocation.cy - 20, 40, 40);
            //console.log("drawing at " + robberLocation.cx + "," + robberLocation.cy)
            robberLoaded = true;
        }
    }else{
        ctx.drawImage(robberImage, robberLocation.cx - 55, robberLocation.cy - 20, 40, 40);
    }
    
}

function drawCanvas(){

    //draw the background maybe here

    //draw the tiles
    if(textured){
        drawTileTextures()
    }else{
        drawTiles()
    }

    drawDice()
    drawBank()

    drawRoads()
    drawSettlements()
    drawRobber()

    //this one can be uncommented when it exists
    // if(showTime){
    //     drawTimer()
    // }

}