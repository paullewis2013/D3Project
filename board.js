//Paul Lewis
//Started in July, 2020

//--------------------------------------------------
//instance fields
//--------------------------------------------------

//an array to store value and frequency of dice rolls
var dice_results_arr = [];

//array to store dev cards left in deck
var devCardArray = [];

//object to track number of each dev card which haven't been played
var unplayedDevCards = {knight: 14, vp: 5, monopoly: 2, road: 2, plenty: 2};
var playedDevCards = {knight: 0, vp: 0, monopoly: 0, road: 0, plenty: 0}

//array to store resource cards in bank
var bank = [19, 19, 19, 19, 19];

var resultsShown = false
var turnNumber = 0


//the tiles on the board
//a 2d array where first index represents row and second represent num in row
var tilesArr = [
    [],
    [],
    [],
    [],
    []
]

//this order is set to generate standard catan boards
var resourceNums = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
var colorNums = ["green", "green","green","green","firebrick","firebrick","firebrick","lightgreen","lightgreen",
                "lightgreen","lightgreen","#ffff99","#ffff99","#ffff99","#ffff99","slategrey","slategrey",
                "slategrey"];


//define dice object
function Dice() {
    this.value = 0;
    this.img = "Dice-1.png";
}
Dice.prototype.roll = function() {
    this.value = Math.floor(Math.random() * 6) + 1;
}
Dice.prototype.getValue = function() {
    return this.value;
}
//returns a string with the url for the correct image
//images from wikipedia commons
Dice.prototype.getImg = function() {
    if(this.value === 0){
        return this.img;
    }else if(this.value === 1){
        this.img = "assets/Dice-1.png";
        return this.img;
    }else if(this.value === 2){
        this.img = "assets/Dice-2.png";
        return this.img;
    }else if(this.value === 3){
        this.img = "assets/Dice-3.png";
        return this.img;
    }else if(this.value === 4){
        this.img = "assets/Dice-4.png";
        return this.img;
    }else if(this.value === 5){
        this.img = "assets/Dice-5.png";
        return this.img;
    }else{
        this.img = "assets/Dice-6.png";
        return this.img;
    }
}

//create an array of dice
var diceArr = new Array(new Dice(), new Dice());


//defines enum for a dev card
const devCard = {
    KNIGHT: 'knight',
    VP: 'victory point',
    MONOPOLY: 'monopoly',
    ROAD: 'road building',
    PLENTY: 'year of plenty'
}

//defines enum for resource card
const resourceCard = {
    WOOD: 'wood',
    BRICK: 'brick',
    SHEEP: 'sheep',
    WHEAT: 'wheat',
    ORE: 'ore'
}

//--------------------------------------------------
//end of instance fields
//--------------------------------------------------

function setUpTiles(){
    //randomize tile num order
    //resourceNums = _.shuffle(resourceNums)

    //randomize tile resource order
    colorNums = _.shuffle(colorNums)

    //make sure desert is on 7 num
    // var resourceIndex = resourceNums.indexOf(7)
    // var colorIndex = colorNums.indexOf("tan")
    // var colorTemp = colorNums[resourceIndex]
    // colorNums[resourceIndex] = "tan"
    // colorNums[colorIndex] = colorTemp

    var randomIndex = Math.floor(Math.random() * colorNums.length)
    colorNums.splice(randomIndex, 0, "tan")
    resourceNums.splice(randomIndex, 0, 7)

    counter = 0;
    //spiral insert

    //go down left side first
    for(i = 0; i < 5; i++){
        tilesArr[i].push({
            Number: resourceNums[counter],
            Color: colorNums[counter]
        });
        counter++;
    }
    //middle one on bottom row
    tilesArr[4].push({
        Number: resourceNums[counter],
        Color: colorNums[counter]
    });
    counter++;

    //put these ones in the wrong spot but we fix it later
    for(i = 4; i >= 0; i--){
        tilesArr[i].push({
            Number: resourceNums[counter],
            Color: colorNums[counter]
        });
        counter++;
    }

    //go down next part of spiral on inside
    for(i = 0; i < 4; i++){
        tilesArr[i].splice(1,0,{
            Number: resourceNums[counter],
            Color: colorNums[counter]
        });
        counter++;
    }

    //go up next part of spiral on inside
    for(i = 3; i > 0; i--){
        tilesArr[i].splice(2,0,{
            Number: resourceNums[counter],
            Color: colorNums[counter]
        });
        counter++;
    }

    //finally center goes in
    tilesArr[2].splice(2,0,{
        Number: resourceNums[counter],
        Color: colorNums[counter]
    });
    counter++;






    
    //inserts tiles one row at a time
    // for(i = 0; i < 5; i++){
        
    //     //first and last row
    //     if(i === 0 || i === 4){
    //         times = 3
    //     }
    //     //second and second to last row
    //     if(i === 1 || i === 3){
    //         times = 4;
    //     }
    //     //middle row
    //     if(i === 2){
    //         times = 5;
    //     }

    //     for(j = 0; j < times; j++){
    //         tilesArr[i].push({
    //             Number: resourceNums[counter],
    //             Color: colorNums[counter]
    //         });
    //         counter++;
    //     }
    // }

    console.log(tilesArr)
}

//this code should be somewhere else lol
//ok seriously move this code to the other file it does not belong here
var svg = document.getElementById('display')
svg.style.width = "100%";
svg.style.height = 300;
var svgWidth = svg.clientWidth;
var svgHeight = svg.clientHeight;
var margin = 50;


//important!
setup()

//sets all game conditions initally
function setup(){
    populateDevCardDeck()
    populateDiceResultsArr()
    graphicButton()
    setUpTiles()
}

//populate dev card array and unplayed dev card array then shuffle the dev card array 
// being used as deck
function populateDevCardDeck(){
    for(var i = 0; i < 14; i++){
        devCardArray.push(devCard.KNIGHT);
    }
    for(var i = 0; i < 5; i++){
        devCardArray.push(devCard.VP);
    }
    for(var i = 0; i < 2; i++){
        devCardArray.push(devCard.MONOPOLY);
    }
    for(var i = 0; i < 2; i++){
        devCardArray.push(devCard.ROAD);
    }
    for(var i = 0; i < 2; i++){
        devCardArray.push(devCard.PLENTY);
    }
    devCardArray = _.shuffle(devCardArray)
}

//fill dice array with 0s
function populateDiceResultsArr(){
    for(var i = 0; i<11; i++){
        dice_results_arr.push({
            value: i+2,
            frequency: 0
        })
    }
}



//--------------------------------------------------
//functions for game events
//--------------------------------------------------

//generates a dice roll between 1 and 12 by summing two d6
function rollDice(){

    diceArr[0].roll()
    diceArr[1].roll()

    var result = diceArr[0].getValue() + diceArr[1].getValue()

    dice_results_arr[result - 2].frequency += 1;

    return result;
}


function drawDevCard(){
    if(devCardArray.length > 0){
        var card = devCardArray.pop();
        //document.getElementById("lastDevCard").innerHTML = "Last Dev card drawn: " + card
        document.getElementById("devCardsRemaining").innerHTML = devCardArray.length
        //console.log(card)


        //need to remove this line later because these dev cards are not actually being played yet
        playDevCard(card)
    }else{
        console.log("deck empty")
    }
    
}

function playDevCard(card){
    
    //update unplayed dev cards tracker
    switch(card){
        case devCard.KNIGHT:
            unplayedDevCards.knight -= 1;
            playedDevCards.knight += 1;
            break;
        case devCard.VP:
            unplayedDevCards.vp -= 1;
            playedDevCards.vp += 1;
            break;
        case devCard.MONOPOLY:
            unplayedDevCards.monopoly -= 1;
            playedDevCards.monopoly += 1;
            break;
        case devCard.ROAD:
            unplayedDevCards.road -= 1;
            playedDevCards.road += 1;
            break;
        case devCard.PLENTY:
            unplayedDevCards.plenty -= 1;
            playedDevCards.plenty += 1;
            break;
        default:
            break;
    }
}

//--------------------------------------------------
//end of functions for game events
//--------------------------------------------------





//--------------------------------------------------
//Button controls
//--------------------------------------------------


//called when dice button is clicked
function diceButton(){
    //document.getElementById("rollResult").innerHTML = "Roll Result: " + rollDice();
    rollDice();
    drawDice()
    
    //updates dice results if they are visible
    graphicButton()

    turnNumber++;
    document.getElementById("turnNumber").innerHTML = "Turn number: " + turnNumber;
}

//event called when dev card button is clicked
function devButton(){
    drawDevCard()

    //updates graphics if necesary
    graphicButton()
}

//eventually move this and other button functions to a seperate js file
function graphicButton(){

    var graphic = document.getElementById("displayOptions").value
    //console.log(graphic)

    switch(graphic){
        case "None":
            clearDisplay();
            break;

        case "Dice Distribution":  
            drawDiceResults();
            break;

        case "dev played":
            drawPlayedDevCards()
            break;

        case "dev unplayed":
            drawUnplayedDevCards()
            break;

        default:
            break;
    }

    // if(document.getElementById("resultsButton").innerHTML === "Show Results"){
        
    //     //make graph visible
    //     d3.select('svg')
    //         .attr("visibility", "visible");   

    //     drawDiceResults()
    //     document.getElementById("resultsButton").innerHTML = "Hide Results"
    //     resultsShown = true
    // }else{

    //     //hide graph
    //     d3.select('svg')
    //         .attr("visibility", "hidden");

    //     document.getElementById("resultsButton").innerHTML = "Show Results"
    // }
    
}

//--------------------------------------------------
//End of button controls
//--------------------------------------------------




//--------------------------------------------------
//Draw functions
//--------------------------------------------------

var canvas = document.getElementById('canvas')
var canvasDiv = document.getElementById('canvasDiv')
canvas.style.background = 'powderblue'
canvas.width  = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;

var ctx = canvas.getContext('2d')
ctx.font= "30px Arial";
//ctx.fillText("Game board will go here", 100, 100)

drawCircles()

//this actually draws hexagons now but it could do circles or whatever else involves visiting 
//center point of each tile
function drawCircles(){
    var centerX = canvas.width /2;
    var centerY = 2 * (canvas.height / 7) - 50;
    var radius = 60;

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
            centerX = (canvas.width/2) - 2*radius
            times = 3;
        }
        //second and second to last row
        if(i === 1 || i === 3){
            centerX = (canvas.width/2) - 3*radius
            times = 4;
        }
        //middle row
        if(i === 2){
            centerX = (canvas.width/2) - 4*radius
            times = 5;
        }

        for(j = 0; j < times; j++){

           

            //draw hexagon
            var hexAngle = ((2 * Math.PI) / 6)

            //7/6 makes the hexagons flushhh 6.9/6 looks nicer anything below leaves a gap
            var hexRad = radius * 6.5/6
            
            ctx.beginPath();
            ctx.moveTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
            ctx.lineTo(centerX + hexRad * Math.cos(0.5*hexAngle), centerY + hexRad * Math.sin(0.5*hexAngle))
            ctx.lineTo(centerX + hexRad * Math.cos(1.5*hexAngle), centerY + hexRad * Math.sin(1.5*hexAngle))
            ctx.lineTo(centerX + hexRad * Math.cos(2.5*hexAngle), centerY + hexRad * Math.sin(2.5*hexAngle))
            ctx.lineTo(centerX + hexRad * Math.cos(3.5*hexAngle), centerY + hexRad * Math.sin(3.5*hexAngle))
            ctx.lineTo(centerX + hexRad * Math.cos(4.5*hexAngle), centerY + hexRad * Math.sin(4.5*hexAngle))
            ctx.lineTo(centerX + hexRad * Math.cos(5.5*hexAngle), centerY + hexRad * Math.sin(5.5*hexAngle))
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.closePath()
            ctx.stroke()
            ctx.fillStyle = tilesArr[i][j].Color
            ctx.fill()

            //outer circle of size radius
            // ctx.beginPath();
            // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = 'black';
            // ctx.closePath()
            // ctx.stroke();
            
            //dont draw a num tile on the desert
            if(tilesArr[i][j].Number != 7){
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
                ctx.fillText(tilesArr[i][j].Number, centerX, centerY + 10)
            }

            centerX += radius * 2 
        }

    }
    
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
  }