//this file is to handle all of the code related to the canvas element

var canvas = document.getElementById("canvas")

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";  

var ctx = canvas.getContext('2d')

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(window.innerWidth * scale);
canvas.height = Math.floor(window.innerHeight * scale);

const c_WIDTH = canvas.width/scale;
const c_HEIGHT = canvas.height/scale;

var ctx = canvas.getContext('2d');

// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

// information about canvas state which may be needed in other files
var c_State = {

    //textured refers to tile images
    textured: true,

    movingRobber: false,

    showMonopolyMenu: false,
    showRoads: false,
    showVerts: false,
    showYOPMenu: false,

    hoveredRoad: null,
    hoveredVert: null,

    colorVals: ["green", "firebrick", "lightgreen", "#ffff99", "slategrey", "blue"],

    cityButtonPath: null,
    devButtonPath: null,
    dicePath: null,
    islandPath: null,
    roadButtonPath: null,
    settlementButtonPath: null,
    tradeButtonPath: null,
    turnButtonPath: null,

    buttonWidth: 0,
    islandCenterX: c_WIDTH * 0.58,
    tileRadius: 60,

    cardPaths: [],
    monopolyMenuCardPaths: [],
    yopMenuCardPaths: [],

    // background vertices in animation
    dotsArray: [],

    selectedResource: null,
    yop1: false,
    yop2: false,
}

function initCanvas(){
    initRoads()
    initBackgroundDots();
    initIslandPath();
    initPorts();
    initDicePath();
    initButtons();
}


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
var imageSrcs = [
                //0
                "assets/robber.svg", 
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

function drawBackgroundAnimated(){

    ctx.strokeStyle = "#167bc2"//"#128CD2"

    //defines distance that coordinates travel from their original locations
    let movement = 6

    let drawX = c_State.dotsArray[0][0][0] - movement * Math.sin(aState.slowAngle + randomTable[0][0])
    let drawY = c_State.dotsArray[0][0][1] - movement * Math.sin(aState.slowAngle + randomTable[0][0])

    for(let i = 0; i < c_State.dotsArray.length; i++){

        for(let j = 0; j < c_State.dotsArray[i].length; j++){

            // important note only downwards pointing triangales are actually filled in as paths

            let randomColor = '#eee8'+ Math.floor(randomTable[i%10][j%10] * 56 + 200).toString(16);
            //let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            ctx.fillStyle = "#268bd2"//randomColor
            ctx.lineWidth = 2;

            let drawX = c_State.dotsArray[i][j][0] - movement * Math.sin(aState.slowAngle + randomTable[i][j])
            let drawY = c_State.dotsArray[i][j][1] - movement * Math.sin(aState.slowAngle + randomTable[i][j])

            c_State.dotsArray[i][j][2] = drawX
            c_State.dotsArray[i][j][3] = drawY

            if(i < c_State.dotsArray.length - 1 && i%2 != 0 && j < c_State.dotsArray[i].length - 1 && j > 0){

                ctx.beginPath()
                ctx.moveTo(drawX, drawY)
                ctx.lineTo(c_State.dotsArray[i+1][j][2], c_State.dotsArray[i+1][j][3])
                ctx.lineTo(c_State.dotsArray[i][j-1][2], c_State.dotsArray[i][j-1][3])
                ctx.lineTo(c_State.dotsArray[i][j][2], c_State.dotsArray[i][j][3])
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            else if(i < c_State.dotsArray.length - 1 && i%2 == 0 && j < c_State.dotsArray[i].length && j > 0){

                ctx.beginPath()
                ctx.moveTo(drawX, drawY)
                ctx.lineTo(c_State.dotsArray[i+1][j-1][2], c_State.dotsArray[i+1][j-1][3])
                ctx.lineTo(c_State.dotsArray[i][j-1][2], c_State.dotsArray[i][j-1][3])
                ctx.lineTo(c_State.dotsArray[i][j][2], c_State.dotsArray[i][j][3])
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }   
        }   
    }
}

function drawBank(){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let bankPath = new Path2D()

    //draw shape for bank to go in
    let x = c_WIDTH - c_State.tileRadius * 6
    let y = 0
    let w = c_State.tileRadius * 6
    let h = 3 * c_State.tileRadius
    
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
    ctx.fillStyle = "#fdf6e3"
    ctx.fill(bankPath)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"

    //draw bank image
    ctx.drawImage(images[8], x + w/2 - c_State.tileRadius/2, 0, c_State.tileRadius, c_State.tileRadius)

    let cardHeight = 0.8 * c_State.tileRadius
    let cardWidth = 5 * cardHeight/7

    let startX = x + c_State.tileRadius/6
    let cardY = 1.3 * c_State.tileRadius
    
    //draw numbers for resources
    for(var i = 0; i < 6; i++){
        ctx.fillStyle = "black"
        ctx.font = "15px Arial"
        if(i<5){
            ctx.beginPath()
            ctx.rect(startX + (i * w/6), cardY + (i%2) * 40, cardWidth, cardHeight)
            ctx.stroke()
            ctx.fillStyle = c_State.colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            //ctx.fillText(bank[i], 160 + ((i%3)*320/4), 40 + Math.floor(i/3) * 40)

            let cardX = startX + (i * w/6)
            let currCardY = cardY + (i%2) * 40

            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, currCardY, c_State.tileRadius * 0.15, 0, 2 * Math.PI, false)
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
            ctx.fillStyle = c_State.colorVals[i]
            ctx.fill()
            ctx.fillStyle = "black"
            //ctx.fillText(devCardArray.length, 160 + ((i%3)*320/4), 40 + Math.floor(i/3) * 40)

            let cardX = startX + (i * w/6)
            let currCardY = cardY + (i%2) * 40

            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, currCardY, c_State.tileRadius * 0.15, 0, 2 * Math.PI, false)
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

function drawButtons(){
    
    setButtons()

    //draw a path behind the buttons
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    //draw shape for bank to go in
    let x = (c_WIDTH/2) - 1.8 * c_State.tileRadius
    let y = c_HEIGHT - 1.5 * c_State.tileRadius
    let w = c_WIDTH - x
    let h = 1.5 * c_State.tileRadius

    let textY = c_HEIGHT - c_State.tileRadius + 10/2

    let textX = x + c_State.buttonWidth/2 + 0.3*c_State.tileRadius

    let r = x + w;
    let b = y + h;
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()

    ctx.lineWidth = 4;
    ctx.fillStyle = "#586e75"
    ctx.fill()
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"
    ctx.stroke()

    //the text isn't really linked to the locations of the buttons and must be updated separately if moved
    let disabledColor = "#839496"
    let enabledColor = '#073642'
    let strokeColor = "#2aa198"

    //trade button
    ctx.fillStyle = enabledColor
    if(!tradeButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(c_State.tradeButtonPath)

    if(currentlyTrading){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(c_State.tradeButtonPath)
    }

    ctx.textAlign = "center"
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.fillText("Trade", textX, textY, 70)

    textX += c_State.buttonWidth

    //dev Button
    ctx.fillStyle = enabledColor
    if(!devButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(c_State.devButtonPath)

    ctx.fillStyle = "white"
    ctx.fillText("Dev Card", textX, textY, 100)

    textX += c_State.buttonWidth

    //road Button
    ctx.fillStyle = enabledColor
    if(!roadButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(c_State.roadButtonPath)

    if(buildingRoad && initialPlacementsComplete){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(c_State.roadButtonPath)
    }

    ctx.fillStyle = "white"
    ctx.fillText("Road", textX, textY, 100)

    textX += c_State.buttonWidth

    //settlement Button
    ctx.fillStyle = enabledColor
    if(!settlementButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(c_State.settlementButtonPath)

    if(buildingSettlement && initialPlacementsComplete){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(c_State.settlementButtonPath)
    }

    ctx.fillStyle = "white"
    ctx.fillText("Settlement", textX, textY, 100)

    //ctx.drawImage(images[7], c_WIDTH - 90, 260, 80, 80)

    textX += c_State.buttonWidth

    //city Button
    ctx.fillStyle = enabledColor
    if(!cityButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(c_State.cityButtonPath)

    if(buildingCity && initialPlacementsComplete){
        ctx.lineWidth = 4;
        ctx.strokeStyle = strokeColor
        ctx.stroke(c_State.cityButtonPath)
    }

    ctx.fillStyle = "white"
    ctx.fillText("City", textX, textY, 100)

    textX += c_State.buttonWidth

    //turn Button
    ctx.fillStyle = enabledColor
    if(!turnButtonEnabled){
        ctx.fillStyle = disabledColor
    }
    ctx.fill(c_State.turnButtonPath)

    ctx.fillStyle = "white"
    ctx.fillText("End Turn", textX, textY, 100)
}

function drawDice(x, y){

    //new and improved
    for(i=0; i<diceArr.length; i++){

        let size = 60

        if(initialPlacementsComplete && diceButtonEnabled){
            size = aState.vertSize * 4
        }

        let xPos = x + (i * 65) - size/2;
        let yPos = y - size/2;

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
}

function drawHand(){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    let handPath = new Path2D()

    let x = 0
    let y = c_HEIGHT - 2 * c_State.tileRadius
    let w = c_WIDTH - ((c_WIDTH/2) + 1.8*c_State.tileRadius)
    let h = 2 * c_State.tileRadius
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
    ctx.fillStyle = "#fdf6e3"
    ctx.fill(handPath)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"

    //draw player circle
    ctx.beginPath();
    ctx.arc(w/6, c_HEIGHT - 2 * h/3, c_State.tileRadius/2, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = currPlayer.color;
    ctx.fill()

    //draw user icon on top of player circle
    ctx.drawImage(images[9], w/6 - c_State.tileRadius/1.95, c_HEIGHT - 2 * h/3 - .6 * c_State.tileRadius, c_State.tileRadius * 1.05, c_State.tileRadius)

    ctx.font = "20px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("PLAYER_NAME", w/6, c_HEIGHT - h/6, 200)

    c_State.cardPaths = [];

    let cardTypes = 0
    let cardHeight = 0.8 * c_State.tileRadius
    let cardWidth = 5 * cardHeight/7
    let buffer = (((2*w)/3) - 5 * cardWidth) / 5
    let boxWidth = 10 * cardWidth + 11 * buffer
    let cardY = y + 0.1 * c_State.tileRadius
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

                    c_State.cardPaths.push({path:currCard, type:resourceCard.WOOD});

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    c_State.cardPaths.push({path:currCard, type:resourceCard.BRICK});

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    c_State.cardPaths.push({path:currCard, type:resourceCard.SHEEP});

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    c_State.cardPaths.push({path:currCard, type:resourceCard.WHEAT});

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    c_State.cardPaths.push({path:currCard, type:resourceCard.ORE});

                    break;

                default:

            }
            
            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, cardY, c_State.tileRadius * 0.15, 0, 2 * Math.PI, false)
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
    cardY += c_State.tileRadius
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

                    c_State.cardPaths.push({path:currCard, type:devCard.KNIGHT});

                    break;

                //VP
                case 1:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "VP"

                    c_State.cardPaths.push({path:currCard, type:devCard.VP});

                    break;

                //monopoly
                case 2:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "M"

                    c_State.cardPaths.push({path:currCard, type:devCard.MONOPOLY});

                    break;
                    
                //road
                case 3:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "R"

                    c_State.cardPaths.push({path:currCard, type:devCard.ROAD});

                    break;

                //plenty
                case 4:

                    ctx.fillStyle = "grey"
                    ctx.fill(currCard)
                    printMe += "P"

                    c_State.cardPaths.push({path:currCard, type:devCard.PLENTY});

                    break;

                default:
            }

            //draw circle for number of cards
            ctx.beginPath()
            ctx.arc(cardX, cardY, c_State.tileRadius * 0.15, 0, 2 * Math.PI, false)
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

function drawIsland(){

    var gradient = ctx.createRadialGradient(c_State.islandCenterX - 90,c_HEIGHT/2, 150, c_State.islandCenterX - 90,c_HEIGHT/2, 200);
    gradient.addColorStop(0, "#DEB887");
    gradient.addColorStop(1, 'wheat');


    //this color is called burly wood
    ctx.fillStyle = gradient
    ctx.lineWidth = 8;
    ctx.strokeStyle = "wheat"
    ctx.stroke(c_State.islandPath);
    ctx.fill(c_State.islandPath);

}

function drawMonopolyMenu(){
    //define boundaries of trade menu
    let menu_x = c_WIDTH - 300
    let menu_y = c_HEIGHT - 4.5 * c_State.tileRadius
    let w = 290
    let h = 2 * c_State.tileRadius

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

    c_State.monopolyMenuCardPaths = [];

    let cardHeight = 0.8 * c_State.tileRadius
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

                    c_State.monopolyMenuCardPaths.push(currCard);

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    c_State.monopolyMenuCardPaths.push(currCard);

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    c_State.monopolyMenuCardPaths.push(currCard);

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    c_State.monopolyMenuCardPaths.push(currCard);

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    c_State.monopolyMenuCardPaths.push(currCard);

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

            c_State.monopolyMenuCardPaths.push(null)
        }
        //disables stroked lines
        ctx.setLineDash([])
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
        ctx.font = "12px Arial"
        ctx.fillText(portsArr[i].trade, portsArr[i].cx, portsArr[i].cy + 5)
    }
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
    if(c_State.showRoads){
        let adjRoads = currPlayer.getBuildableRoads();

        //show buildable roads
        for(let i = 0; i < adjRoads.length; i++){
            //draw the road
            if(adjRoads[i].player === null){
                            
                ctx.fillStyle = "white";

                if(adjRoads[i] == c_State.hoveredRoad){
                    ctx.fillStyle = currPlayer.color
                }

                ctx.fill(adjRoads[i].hitbox)
                ctx.stroke(adjRoads[i].hitbox)

            }
        }
    }
    
}

function drawRobber(){
    ctx.drawImage(images[0], robberLocation.cx - 55, robberLocation.cy - 20, 40, 40);
}

function drawSettlements(){

    //loop through all vertices
    for(var i = 0; i < 12; i++){
        for(var j = 0; j < verticesArr[i].length; j++){
            
            //draw the settlement at vertex if found
            if(verticesArr[i][j].settlement != null){
                
                //change color to color of player who owns it
                ctx.fillStyle = verticesArr[i][j].settlement.player.color;
                ctx.fill(verticesArr[i][j].hitbox)
                ctx.stroke(verticesArr[i][j].hitbox)

                //if the settlement is a city
                if(verticesArr[i][j].settlement.isCity){

                    let cx = verticesArr[i][j].cx;
                    let cy = verticesArr[i][j].cy;

                    ctx.beginPath();
                    ctx.arc(cx, cy, 5, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke()
                }
            }
        }
    }
}

function drawTiles(){

    var centerX;
    var centerY;

    ctx.textAlign = "center"
    ctx.font = "20px Arial";

    for(var i = 0; i < 5; i++){

        //some circle packing magic that makes a 30-60-90 triangle
        centerY = (c_HEIGHT * 3/7) - Math.sqrt(3)*c_State.tileRadius*(2-i);

        var times;

        //first and last row
        if(i === 0 || i === 4){
            centerX = (c_State.islandCenterX) - 3.5*c_State.tileRadius
            times = 3;
        }
        //second and second to last row
        if(i === 1 || i === 3){
            centerX = (c_State.islandCenterX) - 4.5*c_State.tileRadius
            times = 4;
        }
        //middle row
        if(i === 2){
            centerX = (c_State.islandCenterX) - 5.5*c_State.tileRadius
            times = 5;
        }

        for(var j = 0; j < times; j++){

            //draw hexagon
            var hexAngle = ((2 * Math.PI) / 6)

            //7/6 makes the hexagons flush 6.9/6 looks nicer anything below leaves a gap
            var hexRad = c_State.tileRadius * 6.5/6

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
            
            if(!c_State.textured){
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

            centerX += c_State.tileRadius * 2 
        }
    }
}

function drawTileTextures(){

    var centerX;
    var centerY;
    //var radius = c_HEIGHT/11.5;
    var radius = 60

    for(var i = 0; i < 5; i++){
        //centerY = ((2 + i) * (c_HEIGHT / 7)) - radius;

        //some circle packing magic thats like a 30-60-90 triangle
        centerY = (c_HEIGHT * 3/7) - Math.sqrt(3)*radius*(2-i);

        var times;

        //first and last row
        if(i === 0 || i === 4){
            centerX = (c_State.islandCenterX) - 3.5*radius
            times = 3;
        }
        //second and second to last row
        if(i === 1 || i === 3){
            centerX = (c_State.islandCenterX) - 4.5*radius
            times = 4;
        }
        //middle row
        if(i === 2){
            centerX = (c_State.islandCenterX) - 5.5*radius
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

function drawTimer(x, y){

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText("Timer: 00:00", x - 5, y + 25);
}

function drawTradeMenu(){

    //define boundaries of trade menu
    let menu_x = c_WIDTH - 300
    let menu_y = c_HEIGHT - 6 * c_State.tileRadius
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

function drawTurnNum(x, y){

    ctx.textAlign = "right"
    ctx.font = "20px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("Turn: " + turnNumber, x - 5, y + 25)
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
                    if(verticesArr[i][j] == c_State.hoveredVert){
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

            if(verts[i] == c_State.hoveredVert){
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

function drawYOPMenu(){
    //define boundaries of trade menu
    let menu_x = c_WIDTH - 300
    let menu_y = c_HEIGHT - 5.5 * c_State.tileRadius
    let w = 290
    let h = 3 * c_State.tileRadius

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

    c_State.yopMenuCardPaths = [];

    let cardHeight = 0.8 * c_State.tileRadius
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

            if(c_State.yop1 && c_State.selectedResource[0] == i){
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

                    c_State.yopMenuCardPaths.push(currCard);

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

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

            c_State.yopMenuCardPaths.push(null)
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
        if(bank[i] != 0 && c_State.yop1 && !(i == c_State.selectedResource[0] && bank[c_State.selectedResource[0]] == 1)){

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

                    c_State.yopMenuCardPaths.push(currCard);

                    break;

                //brick
                case 1:

                    ctx.fillStyle = "Firebrick"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

                    break;

                //sheep
                case 2:

                    ctx.fillStyle = "lightgreen"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

                    break;
                    
                //wheat
                case 3:

                    ctx.fillStyle = "#ffff99"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

                    break;

                //ore
                case 4:

                    ctx.fillStyle = "slategrey"
                    ctx.fill(currCard)

                    c_State.yopMenuCardPaths.push(currCard);

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

            c_State.yopMenuCardPaths.push(null)
        }
        //disables stroked lines
        ctx.setLineDash([])
    } 
}





//TODO find out what this method is here for
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





//this one is really important
function drawCanvas(){

    //draw rectangle to fill the background
    ctx.rect(0, 0, c_WIDTH, c_HEIGHT)
    ctx.fillStyle = "#268bd2"
    ctx.fill()

    drawBackgroundAnimated()
    
    //elements unrelated to board
    drawBank();
    drawButtons();
    drawHand();
    drawPlayerInfo();

    //conditional elements
    if(currentlyTrading){
        drawTradeMenu()
    }
    if(c_State.showMonopolyMenu){
        drawMonopolyMenu()
    }
    if(c_State.showYOPMenu){
        drawYOPMenu()
    }

    //elements underneath board
    drawPorts()
    drawIsland();

    //board itself
    if(c_State.textured){
        drawTileTextures()
    }else{
        drawTiles()
    }

    //elements on top of board
    drawRoads()
    drawSettlements()
    drawRobber()
    if(c_State.showVerts){
        drawVertices()
    }

    //visualizations
    // drawVisited();
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
    aState.update()
    drawCanvas()
}

setInterval(drawFrame, 100)