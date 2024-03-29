//this file is to handle all of the code related to the canvas element


//TODO move this setup to its own method

//basic setup to work with canvas element
var canvas = document.getElementById('canvas')
var canvasDiv = document.getElementById('canvasDiv')

canvasDiv.height = document.getElementById("left").clientHeight

canvas.width  = canvasDiv.clientWidth 
canvas.height = document.getElementById("left").clientHeight

var ctx = canvas.getContext('2d')

//determines if images are drawn
var textured = true;

var movingRobber = false;
var showRoads = false;
var showVerts = false;
var showMonopolyMenu = false;
var showYOPMenu = false;
var hoveredVert = null;
var hoveredRoad = null;

var colorVals = ["green", "firebrick", "lightgreen", "#ffff99", "slategrey", "blue"]

var islandPath; 
var dicePath;
var tradeButtonPath;
var devButtonPath;
var roadButtonPath;
var settlementButtonPath;
var cityButtonPath;
var turnButtonPath;

var tileRadius;
var buttonWidth;

//place to store on screen location of drawn cards in hand
var cardPaths = [];
var monopolyMenuCardPaths = [];
var yopMenuCardPaths = [];

//for moving background things
var dotsArray = []

var selectedResource = null;
var yop1 = false;
var yop2 = false;


canvas.addEventListener('click', function(e) {

    //debugging help
    //console.log(cardPaths)

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
    if(ctx.isPointInPath(dicePath, e.offsetX, e.offsetY)){
        if(diceButtonEnabled){
            diceButton()
        }
        console.log("dice clicked")
    }

    //trade button
    if(ctx.isPointInPath(tradeButtonPath, e.offsetX, e.offsetY)){
        if(tradeButtonEnabled){
            tradeButton()
        }
        console.log("trade button clicked")
    }

    //dev button
    if(ctx.isPointInPath(devButtonPath, e.offsetX, e.offsetY)){
        if(devButtonEnabled){
            devButton()
        }
        console.log("dev button clicked")
    }

    //road button
    if(ctx.isPointInPath(roadButtonPath, e.offsetX, e.offsetY)){
        if(roadButtonEnabled && !buildingRoad){
            roadButton()
        }else if(roadButtonEnabled && buildingRoad){
            cancelAction();
        }
        console.log("road button clicked")
    }

    //settlement button
    if(ctx.isPointInPath(settlementButtonPath, e.offsetX, e.offsetY)){
        if(settlementButtonEnabled && !buildingSettlement){
            settlementButton()
        }else if(settlementButtonEnabled && buildingSettlement){
            cancelAction()
            showVerts = false
        }
        console.log("settlement button clicked")
    }

    //city Button
    if(ctx.isPointInPath(cityButtonPath, e.offsetX, e.offsetY)){
        if(cityButtonEnabled && !buildingCity){
            cityButton()
        }else if(cityButtonEnabled && buildingCity){
            cancelAction()
        }
        console.log("city button clicked")
    }

    //turn button
    if(ctx.isPointInPath(turnButtonPath, e.offsetX, e.offsetY)){
        if(turnButtonEnabled){
            turnButton()
        }
        console.log("turn button clicked")
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––



    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //resource and dev cards

    for(let i = 0; i < cardPaths.length; i++){

        if(ctx.isPointInPath(cardPaths[i].path, e.offsetX, e.offsetY)){
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
            if (ctx.isPointInPath(tilesArr[i][j].hitbox, e.offsetX, e.offsetY)) {
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

    //loop through all roads
    let roads = currPlayer.getBuildableRoads()

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

canvas.addEventListener('mousemove', function(e) {

    if(     (ctx.isPointInPath(dicePath, e.offsetX, e.offsetY) && diceButtonEnabled)||
            (ctx.isPointInPath(tradeButtonPath, e.offsetX, e.offsetY) && tradeButtonEnabled)||
            (ctx.isPointInPath(devButtonPath, e.offsetX, e.offsetY) && devButtonEnabled) ||
            (ctx.isPointInPath(roadButtonPath, e.offsetX, e.offsetY) && roadButtonEnabled) ||
            (ctx.isPointInPath(settlementButtonPath, e.offsetX, e.offsetY) && settlementButtonEnabled) ||
            (ctx.isPointInPath(cityButtonPath, e.offsetX, e.offsetY) && cityButtonEnabled)||
            (ctx.isPointInPath(turnButtonPath, e.offsetX, e.offsetY) && turnButtonEnabled)){
            
        document.body.style.cursor = "pointer";

    }else if(   (ctx.isPointInPath(dicePath, e.offsetX, e.offsetY) && !diceButtonEnabled)||
                (ctx.isPointInPath(tradeButtonPath, e.offsetX, e.offsetY) && !tradeButtonEnabled)||
                (ctx.isPointInPath(devButtonPath, e.offsetX, e.offsetY) && !devButtonEnabled) ||
                (ctx.isPointInPath(roadButtonPath, e.offsetX, e.offsetY) && !roadButtonEnabled) ||
                (ctx.isPointInPath(settlementButtonPath, e.offsetX, e.offsetY) && !settlementButtonEnabled) ||
                (ctx.isPointInPath(cityButtonPath, e.offsetX, e.offsetY) && !cityButtonEnabled)||
                (ctx.isPointInPath(turnButtonPath, e.offsetX, e.offsetY) && !turnButtonEnabled)){

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
                if(ctx.isPointInPath(verticesArr[i][j].hitbox, e.offsetX, e.offsetY)){
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
                if(ctx.isPointInPath(roadsArr[i][j].hitbox, e.offsetX, e.offsetY)){
                    hoveredRoad = roadsArr[i][j]
                }
            }
        }
    }
    

    
});

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//preloading images code
//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function preloadImages(srcs, imgs) {
    
    console.log("preloading Images")
    
    var img;
    var remaining = srcs.length;
    for (var i = 0; i < srcs.length; i++) {
        img = new Image();
        img.onload = function() {
            --remaining;
            if (remaining <= 0) {
                setup();
            }
        };
        img.src = srcs[i];
        imgs.push(img);
    }
}

//any new image has to be added here and you need to append it otherwise it shifts all other indices
var imageSrcs = ["assets/robber.svg", 
                "assets/WoodTexture.png", 
                "assets/BrickTexture.png", 
                "assets/SheepTexture.png", 
                "assets/WheatTexture.png",

                //5
                "assets/OreTexture.png",
                "assets/DesertTexture.png",
                "assets/settlement.svg",
                "assets/bank.svg",
                "assets/user.svg",

                //10
                "assets/Dice-1.png",
                "assets/Dice-2.png",
                "assets/Dice-3.png",
                "assets/Dice-4.png",
                "assets/Dice-5.png",
                "assets/Dice-6.png",

                ];

var images = [];

preloadImages(imageSrcs, images);

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//end of preloading images code
//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


function toggleTexture(){
    textured = !textured
    drawCanvas()
}

//draw the dice in corner of canvas
function drawDice(){

    //new and improved
    for(i=0; i<diceArr.length; i++){

        var xPos = (canvas.width - ((i + 1) * 65));
        var yPos = 3 * tileRadius;

        let size = 60

        if(initialPlacementsComplete && diceButtonEnabled){
            size = aState.vertSize * 4
        }

        switch(diceArr[i].getImg()){
            case "assets/Dice-1.png":
                ctx.drawImage(images[10], xPos, yPos, size, size);
                break;

            case "assets/Dice-2.png":
                ctx.drawImage(images[11], xPos, yPos, size, size);
                break;

            case "assets/Dice-3.png":
                ctx.drawImage(images[12], xPos, yPos, size, size);
                break;

            case "assets/Dice-4.png":
                ctx.drawImage(images[13], xPos, yPos, size, size);
                break;

            case "assets/Dice-5.png":
                ctx.drawImage(images[14], xPos, yPos, size, size);
                break;

            case "assets/Dice-6.png":
                ctx.drawImage(images[15], xPos, yPos, size, size);
                break;
        }
    }


    // var diceImgs = []
    // for(i=0; i<diceArr.length; i++){
  
    //     //this thing is called a closure but idk how it works tbh
    //     (function (i) {
    //         var xPos = (canvas.width - ((i + 1) * 65));
    //         var yPos = 3 * tileRadius;
    //         diceImgs[i] = new Image();
    //         diceImgs[i].src = diceArr[i].getImg();

    //         diceImgs[i].onload = function () {
    //             ctx.drawImage(diceImgs[i], xPos, yPos, 60, 60);
    //         };

    //     })(i);
  
    // }
    //remove me I don't belong here
    //drawCircles()
}

function initDicePath(){
    
    dicePath = new Path2D();
    
    let lX = (canvas.width - ((2) * 65))
    let rX = (canvas.width - ((2) * 65)) + 125

    let tY = 3 * tileRadius
    let bY = tY + 65

    ctx.beginPath();
    dicePath.moveTo(lX, tY)
    dicePath.lineTo(lX, bY)
    dicePath.lineTo(rX, bY)
    dicePath.lineTo(rX, tY)
    dicePath.lineTo(lX, tY)
    ctx.closePath()


}

function drawButtons(){
    
    setButtons()


    //draw a path behind the buttons
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let buttonAreaPath = new Path2D()

    //draw shape for bank to go in
    let x = (canvas.width/2) - 1.8*tileRadius
    let y = canvas.height - 1.5 * tileRadius
    let w = canvas.width - x
    let h = 1.5 * tileRadius
    let radius = 20

    let textY = canvas.height - tileRadius + 10/2

    let textX = x + buttonWidth/2 + 0.3*tileRadius

    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    // buttonAreaPath.moveTo(x, y);
    // buttonAreaPath.lineTo(r, y);
    // buttonAreaPath.quadraticCurveTo(r, y, r, y+radius);
    // buttonAreaPath.lineTo(r, y+h-radius);
    // buttonAreaPath.quadraticCurveTo(r, b, r-radius, b);
    // buttonAreaPath.lineTo(x+radius, b);
    // buttonAreaPath.quadraticCurveTo(x, b, x, b-radius);
    // buttonAreaPath.lineTo(x, y+radius);
    // buttonAreaPath.quadraticCurveTo(x, y, x, y);
    ctx.closePath()

    ctx.lineWidth = 4;
    ctx.fillStyle = "#a8bbcf"
    ctx.fill()
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"
    ctx.stroke()



    //the text isn't really linked to the locations of the buttons and must be updated separately if moved
    let disabledColor = 'slategrey'
    let enabledColor = '#2c3e50'
    let strokeColor = "#2980b9"

    //trade button
    ctx.fillStyle = enabledColor
    if(!tradeButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(tradeButtonPath)

    if(currentlyTrading){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(tradeButtonPath)
    }

    ctx.textAlign = "center"
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.fillText("Trade", textX, textY, 70)

    textX += buttonWidth

    //dev Button
    ctx.fillStyle = enabledColor
    if(!devButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(devButtonPath)

    ctx.fillStyle = "white"
    ctx.fillText("Dev Card", textX, textY, 70)

    textX += buttonWidth

    //road Button
    ctx.fillStyle = enabledColor
    if(!roadButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(roadButtonPath)

    if(buildingRoad && initialPlacementsComplete){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(roadButtonPath)
    }

    ctx.fillStyle = "white"
    ctx.fillText("Road", textX, textY, 70)

    textX += buttonWidth

    //settlement Button
    ctx.fillStyle = enabledColor
    if(!settlementButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(settlementButtonPath)

    if(buildingSettlement && initialPlacementsComplete){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(settlementButtonPath)
    }

    ctx.fillStyle = "white"
    ctx.fillText("Settlement", textX, textY, 70)

    //ctx.drawImage(images[7], canvas.width - 90, 260, 80, 80)

    textX += buttonWidth

    //city Button
    ctx.fillStyle = enabledColor
    if(!cityButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(cityButtonPath)

    if(buildingCity && initialPlacementsComplete){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(cityButtonPath)
    }

    ctx.fillStyle = "white"
    ctx.fillText("City", textX, textY, 70)

    textX += buttonWidth

    //turn Button
    ctx.fillStyle = enabledColor
    if(!turnButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(turnButtonPath)

    ctx.fillStyle = "white"
    ctx.fillText("End Turn", textX, textY, 70)
}

function initButtons(){

    //x y width height and curve radius for rectangle path
    let x = (canvas.width/2) - 1.5*tileRadius
    let y = canvas.height - tileRadius * 1.8
    let w = (canvas.width - x) / 7
    let h = tileRadius * 1.5
    let radius = 10

    buttonWidth = w * 7/6

    tradeButtonPath = new Path2D();

    x += (w * 14/13) - w

    //rectangle with rounded corners
    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    tradeButtonPath.moveTo(x+radius, y);
    tradeButtonPath.lineTo(r-radius, y);
    tradeButtonPath.quadraticCurveTo(r, y, r, y+radius);
    tradeButtonPath.lineTo(r, y+h-radius);
    tradeButtonPath.quadraticCurveTo(r, b, r-radius, b);
    tradeButtonPath.lineTo(x+radius, b);
    tradeButtonPath.quadraticCurveTo(x, b, x, b-radius);
    tradeButtonPath.lineTo(x, y+radius);
    tradeButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()



    devButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    devButtonPath.moveTo(x+radius, y);
    devButtonPath.lineTo(r-radius, y);
    devButtonPath.quadraticCurveTo(r, y, r, y+radius);
    devButtonPath.lineTo(r, y+h-radius);
    devButtonPath.quadraticCurveTo(r, b, r-radius, b);
    devButtonPath.lineTo(x+radius, b);
    devButtonPath.quadraticCurveTo(x, b, x, b-radius);
    devButtonPath.lineTo(x, y+radius);
    devButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()


    roadButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    roadButtonPath.moveTo(x+radius, y);
    roadButtonPath.lineTo(r-radius, y);
    roadButtonPath.quadraticCurveTo(r, y, r, y+radius);
    roadButtonPath.lineTo(r, y+h-radius);
    roadButtonPath.quadraticCurveTo(r, b, r-radius, b);
    roadButtonPath.lineTo(x+radius, b);
    roadButtonPath.quadraticCurveTo(x, b, x, b-radius);
    roadButtonPath.lineTo(x, y+radius);
    roadButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()
    
    settlementButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    settlementButtonPath.moveTo(x+radius, y);
    settlementButtonPath.lineTo(r-radius, y);
    settlementButtonPath.quadraticCurveTo(r, y, r, y+radius);
    settlementButtonPath.lineTo(r, y+h-radius);
    settlementButtonPath.quadraticCurveTo(r, b, r-radius, b);
    settlementButtonPath.lineTo(x+radius, b);
    settlementButtonPath.quadraticCurveTo(x, b, x, b-radius);
    settlementButtonPath.lineTo(x, y+radius);
    settlementButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

    cityButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    cityButtonPath.moveTo(x+radius, y);
    cityButtonPath.lineTo(r-radius, y);
    cityButtonPath.quadraticCurveTo(r, y, r, y+radius);
    cityButtonPath.lineTo(r, y+h-radius);
    cityButtonPath.quadraticCurveTo(r, b, r-radius, b);
    cityButtonPath.lineTo(x+radius, b);
    cityButtonPath.quadraticCurveTo(x, b, x, b-radius);
    cityButtonPath.lineTo(x, y+radius);
    cityButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()
    
    turnButtonPath = new Path2D();

    //update y for new button
    x += w * 7/6

    r = x + w;
    b = y + h;
    ctx.beginPath()
    turnButtonPath.moveTo(x+radius, y);
    turnButtonPath.lineTo(r-radius, y);
    turnButtonPath.quadraticCurveTo(r, y, r, y+radius);
    turnButtonPath.lineTo(r, y+h-radius);
    turnButtonPath.quadraticCurveTo(r, b, r-radius, b);
    turnButtonPath.lineTo(x+radius, b);
    turnButtonPath.quadraticCurveTo(x, b, x, b-radius);
    turnButtonPath.lineTo(x, y+radius);
    turnButtonPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()

}

function drawTileTextures(){

    var centerX;
    var centerY;
    //var radius = canvas.height/11.5;
    var radius = 60

    for(var i = 0; i < 5; i++){
        //centerY = ((2 + i) * (canvas.height / 7)) - radius;

        //some circle packing magic thats like a 30-60-90 triangle
        centerY = (canvas.height * 3/7) - Math.sqrt(3)*radius*(2-i);

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
            
            let r = tilesArr[i][j].resourceCard;

            switch(r){
                case "wood":
                    tilesArr[i][j].img = images[1];
                    break;
                
                case "brick":
                    tilesArr[i][j].img = images[2];
                    break;

                case "sheep":
                    tilesArr[i][j].img = images[3];
                    break;

                case "wheat":
                    tilesArr[i][j].img = images[4];
                    break;

                case "ore":
                    tilesArr[i][j].img = images[5];
                    break;
                
                default:
                    tilesArr[i][j].img = images[6];
                    break;
            }

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
            

            let drawX = centerX - (hexRad) - 50 - 50 * Math.sin(randomTable[i][j])
            let drawY = centerY - (hexRad) - 50 - 50 * Math.sin(randomTable[j][i])

            //draw image(inside of path only)
            ctx.drawImage(tilesArr[i][j].img, drawX, drawY, 300, 300);

            //remove path and restore canvas to normal
            ctx.restore();

            centerX += radius * 2 
            
        }

    } 
    
    //draw rest of tile on top of image
    drawTiles()
}

function drawVertices(){
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = "white";
    ctx.font = "15px Arial"

    //draw all vertices which could be built on 
    if(!initialPlacementsComplete){
        for(var i = 0; i < 12; i++){

            for(var j = 0; j < verticesArr[i].length; j++){
                
                if(verticesArr[i][j].settlement === null && verticesArr[i][j].dead !== true){
                    
                    //set vert color to white by default
                    ctx.fillStyle = "white";

                    //set vert color to player color if hovering
                    if(verticesArr[i][j] == hoveredVert){
                        ctx.fillStyle = currPlayer.color
                    }
                    
                    ctx.strokeStyle = "black";
                    ctx.beginPath()
                    ctx.arc(verticesArr[i][j].cx, verticesArr[i][j].cy, aState.vertSize, 0, Math.PI * 2, false)
                    ctx.fill()
                    ctx.stroke()
                    ctx.closePath()
                    // ctx.fill(verticesArr[i][j].hitbox)
                    // ctx.stroke(verticesArr[i][j].hitbox)
    
                    //for debug
                    // ctx.fillStyle = "black"
                    // ctx.fillText(i + "," + j, verticesArr[i][j].cx, verticesArr[i][j].cy + 5)
                }
            }
    
        }
    }

    //draw only buildable vertices reachable by currPlayer
    else{

        let verts = currPlayer.getBuildableVertices();

        for(var i = 0; i < verts.length; i++){
            ctx.fillStyle = "white";

            if(verts[i] == hoveredVert){
                ctx.fillStyle = currPlayer.color
            }

            ctx.strokeStyle = "black";
            ctx.beginPath()
            ctx.arc(verts[i].cx, verts[i].cy, aState.vertSize, 0, Math.PI * 2, false)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
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
            if(  !((j === verticesArr[i].length - 1) && (i === 1 || i === 3 || i === 5 || i === 6 || i === 8 || i === 10))     ){

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

function drawTiles(){
    var centerX;
    var centerY;
    //tileRadius = canvas.height/15;
    tileRadius = 60;

    ctx.textAlign = "center"
    ctx.font = "20px Arial";

    for(var i = 0; i < 5; i++){

        //some circle packing magic that makes a 30-60-90 triangle
        centerY = (canvas.height * 3/7) - Math.sqrt(3)*tileRadius*(2-i);

        var times;

        //first and last row
        if(i === 0 || i === 4){
            centerX = (canvas.width/2) - 3.5*tileRadius
            times = 3;
        }
        //second and second to last row
        if(i === 1 || i === 3){
            centerX = (canvas.width/2) - 4.5*tileRadius
            times = 4;
        }
        //middle row
        if(i === 2){
            centerX = (canvas.width/2) - 5.5*tileRadius
            times = 5;
        }

        for(var j = 0; j < times; j++){

            //draw hexagon
            var hexAngle = ((2 * Math.PI) / 6)

            //7/6 makes the hexagons flush 6.9/6 looks nicer anything below leaves a gap
            var hexRad = tileRadius * 6.5/6

            tilesArr[i][j].cx = centerX;
            tilesArr[i][j].cy = centerY;
            
            //TODO don't recreate the hitbox every time you draw the tiles
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
            
            if(!textured){
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
            
            ctx.lineWidth = 2;

            //dont draw a num tile on the desert
            if(tilesArr[i][j].number != 7){
                
                //draw inner circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI, false);
                ctx.strokeStyle = 'black';
                ctx.closePath()
                ctx.stroke();
                ctx.fillStyle = "white"
                ctx.fill()

                //6 and 8 tiles are red all else are black
                ctx.fillStyle = "black"
                if(tilesArr[i][j].number === 6 || tilesArr[i][j].number === 8){
                    ctx.fillStyle = "red"
                }

                ctx.fillText(tilesArr[i][j].number, centerX, centerY + 5)

                //draw dots
                var dots = (6 - Math.abs(7 - tilesArr[i][j].number))

                //this makes sure the dots are centered
                var offSetX = 2.5 * (dots-1.25)

                //draw each dot
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

            centerX += tileRadius * 2 
        }

    }

    //console.log(tilesArr)
}

function drawBank(){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let bankPath = new Path2D()

    //draw shape for bank to go in
    let x = canvas.width - tileRadius * 5
    let y = 0
    let w = tileRadius * 5
    let h = 3 * tileRadius
    
    let radius = 30
    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    bankPath.moveTo(x, y);
    bankPath.lineTo(r, y);
    bankPath.lineTo(r, b);
    bankPath.lineTo(x + radius, b);
    bankPath.quadraticCurveTo(x, b, x, b-radius);
    bankPath.lineTo(x, y);
    ctx.closePath() 

    ctx.lineWidth = 4;
    // ctx.strokeStyle = "#B0E0E6"
    ctx.stroke(bankPath);
    ctx.fillStyle = "#ecf0f1"
    ctx.fill(bankPath)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"

    //draw bank image
    ctx.drawImage(images[8], x + w/2 - tileRadius/2, 0, tileRadius, tileRadius)

    let cardHeight = 0.8 * tileRadius
    let cardWidth = 5 * cardHeight/7

    let startX = x + tileRadius/6
    let cardY = 1.3 * tileRadius
    
    //draw numbers for resources
    for(var i = 0; i < 6; i++){
        ctx.fillStyle = "black"
        ctx.font = "15px Arial"
        if(i<5){
            ctx.beginPath()
            ctx.rect(startX + (i * w/6), cardY + (i%2) * 40, cardWidth, cardHeight)
            ctx.stroke()
            ctx.fillStyle = colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            //ctx.fillText(bank[i], 160 + ((i%3)*320/4), 40 + Math.floor(i/3) * 40)

            let cardX = startX + (i * w/6)
            let currCardY = cardY + (i%2) * 40

            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, currCardY, tileRadius * 0.15, 0, 2 * Math.PI, false)
            ctx.stroke()
            ctx.fillStyle = "white"
            ctx.fill()

            //draw number to show how many the user has
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "12px Arial"
            ctx.fillText(bank[i], cardX, currCardY + 5)




        }else{
            ctx.beginPath()
            ctx.rect(startX + (i * w/6), cardY + (i%2) * 40, cardWidth, cardHeight)
            ctx.stroke()
            ctx.fillStyle = colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            //ctx.fillText(devCardArray.length, 160 + ((i%3)*320/4), 40 + Math.floor(i/3) * 40)

            let cardX = startX + (i * w/6)
            let currCardY = cardY + (i%2) * 40

            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, currCardY, tileRadius * 0.15, 0, 2 * Math.PI, false)
            ctx.stroke()
            ctx.fillStyle = "white"
            ctx.fill()

            //draw number to show how many the user has
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "12px Arial"
            ctx.fillText(devCardArray.length, cardX, currCardY + 5)
        }
        
    }
}

function drawPorts(){

    for(var i = 0; i < portsArr.length; i++){

        ctx.textAlign = "center"
        ctx.strokeStyle = "PERU"
        ctx.setLineDash([5,1])
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
        ctx.setLineDash([])

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

                if(adjRoads[i] == hoveredRoad){
                    ctx.fillStyle = currPlayer.color
                }

                ctx.fill(adjRoads[i].hitbox)
                ctx.stroke(adjRoads[i].hitbox)

            }
        }
    }
    
}

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

//TODO write me
function drawTimer(){

}

function drawTurnNum(){
    ctx.textAlign = "left"
    ctx.font = "Arial 15px"
    ctx.fillStyle = "black"
    ctx.fillText("Turn: " + turnNumber, 25, 25)
}

function drawRobber(){

    ctx.drawImage(images[0], robberLocation.cx - 55, robberLocation.cy - 20, 40, 40);
    
}

//draws a trade menu in lower right corner of canvas
function drawTradeMenu(){

    //define boundaries of trade menu
    let menu_x = canvas.width - 300
    let menu_y = canvas.height - 6 * tileRadius
    let width = 290
    let height = 225

    //draw the trade menu box
    ctx.beginPath()
    ctx.rect(menu_x, menu_y, width, height)
    ctx.fillStyle = "antiquewhite"
    ctx.fill()

    //draw the dividing lines for the 3 sections
    ctx.moveTo(menu_x + 3* width/4, menu_y)
    ctx.lineTo(menu_x + 3* width/4, menu_y + height)
    ctx.stroke()

    //draw the cards
    //send cards
    ctx.textAlign = "left"
    ctx.fillStyle = "black"
    ctx.fillText("Send ", menu_x + 5, menu_y + 15)

    for(let i = 0; i < 5; i++){
        ctx.beginPath()
        ctx.rect(menu_x + 15 + i * 40, menu_y + 25, 30, 55)
        ctx.stroke()
    }

    //receive cards
    ctx.textAlign = "left"
    ctx.fillStyle = "black"
    ctx.fillText("Receive ", menu_x + 5, menu_y - 10 + height)

    for(let i = 0; i < 5; i++){
        ctx.beginPath()
        ctx.rect(menu_x + 15 + i * 40, menu_y + 20 + height/2, 30, 55)
        ctx.stroke()
    }

    //draw the trade arrows

    //draw the player circles
    let circle_y = menu_y + height/(2 * (playersArr.length - 1))

    for(let i = 0; i < playersArr.length; i++){
        
        if(playersArr[i] == currPlayer){
            i++
            if(i == playersArr.length){
                break;
            }
        }
        
        ctx.beginPath();
        ctx.arc(menu_x + (7 * width/8), circle_y, 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = playersArr[i].color;
        ctx.fill()

        //draw user icon on top of image
        ctx.drawImage(images[9], menu_x + (7 * width/8) - 21, circle_y - 24, 42, 40)

        circle_y += height/(playersArr.length - 1);
    }

    //console.log("here")
    ctx.fillStyle = "black"

}

function drawHand(){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    let handPath = new Path2D()

    let x = 0
    let y = canvas.height - 2 * tileRadius
    let w = canvas.width - ((canvas.width/2) + 1.8*tileRadius)
    let h = 2 * tileRadius
    let radius = 25
    let buttonRadius = 10

    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    handPath.moveTo(x, y);
    handPath.lineTo(r-buttonRadius, y);
    handPath.quadraticCurveTo(r, y, r, y+buttonRadius);
    handPath.lineTo(r, y+h-radius);
    handPath.quadraticCurveTo(r, b + 3, r+radius, b + 3);
    handPath.lineTo(x, b);
    handPath.lineTo(x, y);
    ctx.closePath()

    ctx.lineWidth = 4;
    // ctx.strokeStyle = "#B0E0E6"
    ctx.stroke(handPath);
    ctx.fillStyle = "#d9e2ea"
    ctx.fill(handPath)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"

    //draw player circle
    ctx.beginPath();
    ctx.arc(w/6, canvas.height - h/2, tileRadius/2, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = currPlayer.color;
    ctx.fill()

    //draw user icon on top of player circle
    ctx.drawImage(images[9], w/6 - tileRadius/1.95, canvas.height - h/2 - .6*tileRadius, tileRadius * 1.05, tileRadius)

    cardPaths = [];

    let cardTypes = 0
    let cardHeight = 0.8 * tileRadius
    let cardWidth = 5 * cardHeight/7
    let buffer = (((2*w)/3) - 5 * cardWidth) / 5
    let boxWidth = 10 * cardWidth + 11 * buffer
    let cardY = y + 0.1 * tileRadius
    let cardX = w/3


    //loop through all of current players resources
    for(let i = 0; i < currPlayer.resources.length; i++){

        //only draw resource types that the player actually has
        if(currPlayer.resources[i] != 0){

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);
            ctx.stroke(currCard);

            //get style for resource card
            switch(i){
                
                //wood
                case 0:

                    ctx.fillStyle = "Green"
                    ctx.fill(currCard)

                    cardPaths.push({path:currCard, type:resourceCard.WOOD});

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    cardPaths.push({path:currCard, type:resourceCard.BRICK});

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    cardPaths.push({path:currCard, type:resourceCard.SHEEP});

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    cardPaths.push({path:currCard, type:resourceCard.WHEAT});

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    cardPaths.push({path:currCard, type:resourceCard.ORE});

                    break;

                default:

            }
            

            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, cardY, tileRadius * 0.15, 0, 2 * Math.PI, false)
            ctx.stroke()
            ctx.fillStyle = "white"
            ctx.fill()

            //draw number to show how many the user has
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "12px Arial"
            ctx.fillText(currPlayer.resources[i], cardX, cardY + 5)
            
            cardX += buffer + cardWidth
            cardTypes++;
        }
        //for resources the player doesnt have draw a stroked line
        else{

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);

            ctx.setLineDash([5,3])
            ctx.stroke(currCard)

            cardX += buffer + cardWidth
        }
        //disables stroked lines
        ctx.setLineDash([])
    } 


    //move to next row of cards
    cardY += tileRadius
    cardX = w/3


    //loop though all of current players dev cards and draw them
    for(let i = 0; i < currPlayer.devCards.length; i++){
        
        //only draw resource types that the player actually has
        if(currPlayer.devCards[i] != 0){
            
            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);
            ctx.stroke(currCard);

            let printMe = ""

            //get style for resource card
            switch(i){
                
                //knight
                case 0:

                    ctx.fillStyle = "Grey"
                    ctx.fill(currCard)
                    printMe += "K"

                    cardPaths.push({path:currCard, type:devCard.KNIGHT});

                    break;

                //VP
                case 1:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "VP"

                    cardPaths.push({path:currCard, type:devCard.VP});

                    break;

                //monopoly
                case 2:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "M"

                    cardPaths.push({path:currCard, type:devCard.MONOPOLY});

                    break;
                    
                //road
                case 3:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "R"

                    cardPaths.push({path:currCard, type:devCard.ROAD});

                    break;

                //plenty
                case 4:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "P"

                    cardPaths.push({path:currCard, type:devCard.PLENTY});

                    break;

                default:

            }


            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, cardY, tileRadius * 0.15, 0, 2 * Math.PI, false)
            ctx.stroke()
            ctx.fillStyle = "white"
            ctx.fill()

            //draw number to show how many the user has
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "12px Arial"
            ctx.fillText(currPlayer.devCards[i], cardX, cardY + 5)
            
            //draw dev card type
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "15px Arial"
            ctx.fillText(printMe, cardX + cardWidth/2, cardY + cardHeight/2)
            
            cardX += buffer + cardWidth
            cardTypes++;
        }
        
        //for resources the player doesnt have draw a stroked line
        else{

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);

            ctx.setLineDash([5,3])
            ctx.stroke(currCard)

            cardX += buffer + cardWidth
        }
        //disables stroked lines
        ctx.setLineDash([])
        
    }





}

function drawVisited(){

    //roads first
    for(var i = 0; i < 11; i++){

        for(var j = 0; j < roadsArr[i].length; j++){
            
            if(currPlayer.visited.includes(roadsArr[i][j])){

                //change color to color of player who owns it
                ctx.fillStyle = "black";
                ctx.fill(roadsArr[i][j].hitbox)
                ctx.stroke(roadsArr[i][j].hitbox)

            }
            
        }

    }

    //vertices next
    for(let i = 0; i < 12; i++){
        for(let j = 0; j < verticesArr[i].length; j++){

            if(currPlayer.visited.includes(verticesArr[i][j])){
                ctx.fillStyle = "black"
                ctx.fill(verticesArr[i][j].hitbox)
            }

        }
    }

}

function drawYOPMenu(){
    //define boundaries of trade menu
    let menu_x = canvas.width - 300
    let menu_y = canvas.height - 5.5 * tileRadius
    let w = 290
    let h = 3 * tileRadius

    let x = menu_x
    let y = menu_y
    let radius = 10

    let r = x + w;
    let b = y + h;

    //draw the trade menu box
    let yopMenuPath = new Path2D

    ctx.beginPath()

    yopMenuPath.moveTo(x+radius, y);
    yopMenuPath.lineTo(r-radius, y);
    yopMenuPath.quadraticCurveTo(r, y, r, y+radius);
    yopMenuPath.lineTo(r, y+h-radius);
    yopMenuPath.quadraticCurveTo(r, b, r-radius, b);
    yopMenuPath.lineTo(x+radius, b);
    yopMenuPath.quadraticCurveTo(x, b, x, b-radius);
    yopMenuPath.lineTo(x, y+radius);
    yopMenuPath.quadraticCurveTo(x, y, x+radius, y);

    ctx.closePath()
    ctx.fillStyle = "#d9e2ea"
    ctx.fill(yopMenuPath)
    ctx.strokeColor = "black"
    ctx.stroke(yopMenuPath)

    //add a message at the top
    ctx.fillStyle = "black"
    ctx.fillText("Please select resource 1:", menu_x + w/2, menu_y + 15)

    yopMenuCardPaths = [];

    let cardHeight = 0.8 * tileRadius
    let cardWidth = 5 * cardHeight/7
    let buffer = (w - 5 * cardWidth) / 5
    //let boxWidth = 10 * cardWidth + 11 * buffer
    let cardY = menu_y + (h - 2 * cardHeight)/3
    let cardX = menu_x + buffer/2


    //loop through all of banks resources
    for(let i = 0; i < bank.length; i++){

        //only draw resource types that the bank actually has
        if(bank[i] != 0){

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);
            
            ctx.strokeColor = "black"
            ctx.lineWidth = 1

            if(yop1 && selectedResource[0] == i){
                ctx.strokeColor = "#2980b9"
                ctx.lineWidth = 4
            }
            
            ctx.stroke(currCard);
            

            //get style for resource card
            switch(i){
                
                //wood
                case 0:

                    ctx.fillStyle = "Green"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                default:

            }
            
            cardX += buffer + cardWidth
        }
        //for resources the player doesnt have draw a stroked line
        else{

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);

            ctx.setLineDash([5,3])
            ctx.stroke(currCard)

            cardX += buffer + cardWidth

            yopMenuCardPaths.push(null)
        }
        //disables stroked lines
        ctx.setLineDash([])
    } 

    //add a message at the top
    ctx.fillStyle = "black"
    ctx.fillText("Please select resource 2:", menu_x + w/2, menu_y + h/2 + 15)

    cardX = menu_x + buffer/2
    cardY = menu_y + cardHeight + 5 * ((h - 2 * cardHeight)/6);

    ctx.strokeColor = "black"
    ctx.lineWidth = 1

    //loop through all of banks resources
    for(let i = 0; i < bank.length; i++){

        //only draw resource types that the bank actually has
        if(bank[i] != 0 && yop1 && !(i == selectedResource[0] && bank[selectedResource[0]] == 1)){

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);
            ctx.stroke(currCard);

            //get style for resource card
            switch(i){
                
                //wood
                case 0:

                    ctx.fillStyle = "Green"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    yopMenuCardPaths.push(currCard);

                    break;

                default:

            }
            
            cardX += buffer + cardWidth
        }
        //for resources the player doesnt have draw a stroked line
        else{

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);

            ctx.setLineDash([5,3])
            ctx.stroke(currCard)

            cardX += buffer + cardWidth

            yopMenuCardPaths.push(null)
        }
        //disables stroked lines
        ctx.setLineDash([])
    } 

}

function drawMonopolyMenu(){
    //define boundaries of trade menu
    let menu_x = canvas.width - 300
    let menu_y = canvas.height - 4.5 * tileRadius
    let w = 290
    let h = 2 * tileRadius

    let x = menu_x
    let y = menu_y
    let radius = 10

    let r = x + w;
    let b = y + h;

    //draw the trade menu box
    let monopolyMenuPath = new Path2D

    ctx.beginPath()
    monopolyMenuPath.moveTo(x+radius, y);
    monopolyMenuPath.lineTo(r-radius, y);
    monopolyMenuPath.quadraticCurveTo(r, y, r, y+radius);
    monopolyMenuPath.lineTo(r, y+h-radius);
    monopolyMenuPath.quadraticCurveTo(r, b, r-radius, b);
    monopolyMenuPath.lineTo(x+radius, b);
    monopolyMenuPath.quadraticCurveTo(x, b, x, b-radius);
    monopolyMenuPath.lineTo(x, y+radius);
    monopolyMenuPath.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath()
    ctx.fillStyle = "#d9e2ea"
    ctx.fill(monopolyMenuPath)
    ctx.strokeColor = "black"
    ctx.stroke(monopolyMenuPath)

    //add a message at the top
    ctx.fillStyle = "black"
    ctx.fillText("Please select a resource type:", menu_x + w/2, menu_y + 15)

    monopolyMenuCardPaths = [];

    let cardHeight = 0.8 * tileRadius
    let cardWidth = 5 * cardHeight/7
    let buffer = (w - 5 * cardWidth) / 5
    //let boxWidth = 10 * cardWidth + 11 * buffer
    let cardY = menu_y + (h - cardHeight)/2
    let cardX = menu_x + buffer/2


    //loop through all of current players resources
    for(let i = 0; i < bank.length; i++){

        //only draw resource types that the player actually has
        if(bank[i] != 0){

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);
            ctx.stroke(currCard);

            //get style for resource card
            switch(i){
                
                //wood
                case 0:

                    ctx.fillStyle = "Green"
                    ctx.fill(currCard)

                    monopolyMenuCardPaths.push(currCard);

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    monopolyMenuCardPaths.push(currCard);

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    monopolyMenuCardPaths.push(currCard);

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    monopolyMenuCardPaths.push(currCard);

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    monopolyMenuCardPaths.push(currCard);

                    break;

                default:

            }
            
            cardX += buffer + cardWidth
        }
        //for resources the player doesnt have draw a stroked line
        else{

            //define boundaries of resource card
            let currCard = new Path2D

            ctx.beginPath()
            currCard.rect(cardX, cardY, cardWidth, cardHeight);

            ctx.setLineDash([5,3])
            ctx.stroke(currCard)

            cardX += buffer + cardWidth

            monopolyMenuCardPaths.push(null)
        }
        //disables stroked lines
        ctx.setLineDash([])
    } 
}

function initBackgroundDots(){
    
    //start the pattern outside the bounds of canvas
    let x = -50
    let y = -50

    let offset = false;

    //make a lot of rows
    for(let i = 0; i < 45; i++){

        //add a new array to populate
        dotsArray.push([])

        //push custom x y coordinate structure into array
        for(let j = 0; j < 45; j++){
            dotsArray[i].push([x, y, 0, 0])
            x += canvas.width/35
        }

        //move y up a row
        y += canvas.height/35

        //stagger every other row
        if(!offset){
            offset = true;
            x = -100
        }else{
            offset = false;
            x = -100 - canvas.width/80
        }
        
        
    }

}

function drawBackgroundAnimated(){

    ctx.strokeStyle = "#128CD2"

    //defines distance that coordinates travel from their original locations
    let movement = 6

    let drawX = dotsArray[0][0][0] - movement * Math.sin(aState.slowAngle + randomTable[0][0])
    let drawY = dotsArray[0][0][1] - movement * Math.sin(aState.slowAngle + randomTable[0][0])

    for(let i = 0; i < dotsArray.length; i++){

        for(let j = 0; j < dotsArray[i].length; j++){

            let randomColor = '#7CB9'+ Math.floor(randomTable[i%10][j%10]/(2*Math.PI) * 56 + 200).toString(16);
            //let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            ctx.fillStyle = randomColor
            ctx.lineWidth = 1;

            let drawX = dotsArray[i][j][0] - movement * Math.sin(aState.slowAngle + randomTable[i][j])
            let drawY = dotsArray[i][j][1] - movement * Math.sin(aState.slowAngle + randomTable[i][j])

            dotsArray[i][j][2] = drawX
            dotsArray[i][j][3] = drawY

            // ctx.beginPath()
            // ctx.arc(drawX, drawY, 5, 0, 2 * Math.PI, false)
            // ctx.fill()

            // if(     (i < dotsArray.length - 1) && (j < dotsArray[i].length - 1)     ){
            if(i < dotsArray.length - 1 && i%2 != 0 && j < dotsArray[i].length - 1 && j > 0){

                ctx.beginPath()
                ctx.moveTo(drawX, drawY)
                ctx.lineTo(dotsArray[i+1][j][2], dotsArray[i+1][j][3])
                ctx.lineTo(dotsArray[i][j-1][2], dotsArray[i][j-1][3])
                ctx.lineTo(dotsArray[i][j][2], dotsArray[i][j][3])
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            else if(i < dotsArray.length - 1 && i%2 == 0 && j < dotsArray[i].length && j > 0){

                ctx.beginPath()
                ctx.moveTo(drawX, drawY)
                ctx.lineTo(dotsArray[i+1][j-1][2], dotsArray[i+1][j-1][3])
                ctx.lineTo(dotsArray[i][j-1][2], dotsArray[i][j-1][3])
                ctx.lineTo(dotsArray[i][j][2], dotsArray[i][j][3])
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
            
        }
        
    }

}

//this one is really important
function drawCanvas(){

    //draw the background
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#7CB9E6"
    ctx.fill()

    drawBackgroundAnimated()
    
    //elements unrelated to board
    drawDice()
    drawButtons()
    drawTurnNum()
    drawHand()
    drawBank()

    if(currentlyTrading){
        drawTradeMenu()
    }

    if(showMonopolyMenu){
        drawMonopolyMenu()
    }

    if(showYOPMenu){
        drawYOPMenu()
    }
    

    //elements under board
    drawPorts()
    drawIsland();

    //board itself
    if(textured){
        drawTileTextures()
    }else{
        drawTiles()
    }

    //elements on top of board

    // drawVisited()
    drawRoads()
    drawSettlements()
    drawRobber()
    if(showVerts){
        drawVertices()
    }
    
    

    //player info in rightside column
    drawPlayerInfo()

    

}


//------------------------------------------------------
//
//      
//    
//    Animation below this break
//    
//    
//    
//------------------------------------------------------


//create a global object to track animation changes
function AnimationState(){
    this.vertSize = 15
    this.angle = Math.PI
    this.slowAngle = Math.PI
}
AnimationState.prototype.update = function(){
    
    this.angle = (this.angle + Math.PI/25)%(2*Math.PI)
    this.slowAngle = (this.slowAngle + Math.PI/35)%(2*Math.PI)
    
    this.vertSize = 15 + 1.5 * Math.sin(this.angle);
}

var aState = new AnimationState()

//method to be called on loop
function drawFrame(){
    //console.log("drawing frame" + aState.vertSize)
    aState.update()

    drawCanvas()
}

setInterval(drawFrame, 80)

