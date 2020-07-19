//Paul Lewis
//Started in July, 2020

//--------------------------------------------------
//instance fields
//--------------------------------------------------

//TODO organize instance fields

//an array to store value and frequency of dice rolls
var dice_results_arr = [];

//array to store dev cards left in deck
var devCardArray = [];

//object to track number of each dev card which haven't been played
var unplayedDevCards = {knight: 14, vp: 5, monopoly: 2, road: 2, plenty: 2};
var playedDevCards = {knight: 0, vp: 0, monopoly: 0, road: 0, plenty: 0}

//array to store resource cards in bank
var bank = [19, 19, 19, 19, 19];

var turnNumber = 0

//maybe this should point to a tile
var robberLocation = null

//the tiles on the board
//a 2d array where first index represents row and second represent num in row
var tilesArr = [
    [],
    [],
    [],
    [],
    []
]

var verticesArr = [
    [],
    [],
    [],
    [],
    
    [],
    [],
    [],
    [],
    
    [],
    [],
    [],
    [],
]

function Vertex(cx, cy, hitbox){
    this.cx = cx;
    this.cy = cy;
    this.hitbox = hitbox;
}

//define dice object
function Dice() {
    this.value = 1;
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


//create an array of 2 dice to be rolled
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

//another weird statistical thing to track
var productionCapacity = [0, 0, 0, 0, 0]


//TODO move objects to new js file
//define tile object
function Tile(r, num, color, path){
    this.resourceCard = r;
    this.color = color;
    this.number = num;
    this.settlements = [];  
    this.blocked = false;
    this.path = path;
    this.img = null;
    this.cx = 0;
    this.cy = 0;
    this.hitbox = {};
}
Tile.prototype.block = function() {
    this.blocked = true;
}
Tile.prototype.unBlock = function() {
    this.blocked = false;
}
Tile.prototype.getPath = function(){
    return this.path;
}



//--------------------------------------------------
//end of instance fields
//--------------------------------------------------

function setUpTiles(){
    //randomize tile num order (do this for fully random board)
    //resourceNums = _.shuffle(resourceNums)

    var colorNums = ["green", "green","green","green","firebrick","firebrick","firebrick","lightgreen","lightgreen",
                "lightgreen","lightgreen","#ffff99","#ffff99","#ffff99","#ffff99","slategrey","slategrey",
                "slategrey"];

    //randomize tile resource order
    colorNums = _.shuffle(colorNums)
    var resourceNums = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]

    var randomIndex = Math.floor(Math.random() * (colorNums.length + 1))
    colorNums.splice(randomIndex, 0, "tan")
    resourceNums.splice(randomIndex, 0, 7)

    var resourceTypes = []
    var resourceImgs = []

    for(i = 0; i < colorNums.length; i++){
        if(colorNums[i] === "green"){
            resourceTypes.push(resourceCard.WOOD)
            resourceImgs.push("assets/WoodTexture.png")
        }else if(colorNums[i] === "firebrick"){
            resourceTypes.push(resourceCard.BRICK)
            resourceImgs.push("assets/BrickTexture.png")
        }else if(colorNums[i] === "lightgreen"){
            resourceTypes.push(resourceCard.SHEEP)
            resourceImgs.push("assets/SheepTexture.png")
        }else if(colorNums[i] === "#ffff99"){
            resourceTypes.push(resourceCard.WHEAT)
            resourceImgs.push("assets/WheatTexture.png")
        }else if(colorNums[i] === "slategrey"){
            resourceTypes.push(resourceCard.ORE)
            resourceImgs.push("assets/OreTexture.png")
        }else{
            resourceTypes.push(null)
            resourceImgs.push("assets/DesertTexture.png")
        }
    }

    //assemble things into tiles
    var tempTiles = []
    for(i = 0; i < colorNums.length; i++){
        tempTiles[i] = new Tile(resourceTypes[i], resourceNums[i], colorNums[i], resourceImgs[i])
        if(tempTiles[i].number == 7){
            tempTiles[i].block()
        }
    }

    //console.log(tempTiles)
    
    //spiral insert
    counter = 0;

    //go down left side first
    for(i = 0; i < 5; i++){
        tilesArr[i].push( tempTiles[counter]);
        counter++;
    }
    //middle one on bottom row
    tilesArr[4].push( tempTiles[counter]);
    counter++;

    //put these ones in the wrong spot but we fix it later
    for(i = 4; i >= 0; i--){
        tilesArr[i].push( tempTiles[counter]);
        counter++;
    }

    //go down next part of spiral on inside
    for(i = 0; i < 4; i++){
        tilesArr[i].splice(1,0,( tempTiles[counter]))
        counter++;
    }

    //go up next part of spiral on inside
    for(i = 3; i > 0; i--){
        tilesArr[i].splice(2,0,( tempTiles[counter]));
        counter++;
    }

    //finally center goes in
    tilesArr[2].splice(2,0,( tempTiles[counter]));
    counter++;


    //find location of robber and record it
    for(i = 0; i < 5; i++){
        for(j = 0; j < tilesArr[i].length; j++){
            if(tilesArr[i][j].blocked == true){
                robberLocation = tilesArr[i][j]
            }
        }
    }

}

//important!
setup()

//sets all game conditions initally
function setup(){
    populateDevCardDeck()
    populateDiceResultsArr()
    graphicButton()
    setUpTiles()
    drawTiles()
    calcProduction()
    initVertices()
    drawCanvas()
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

    if(result ==7){
        //discard resources over 7 first

        //move robber after resources discarded
        moveRobber()
    }else{
        //generate resources
    }

    return result;
}


function drawDevCard(){
    if(devCardArray.length > 0){
        var card = devCardArray.pop();
        //document.getElementById("lastDevCard").innerHTML = "Last Dev card drawn: " + card
        //document.getElementById("devCardsRemaining").innerHTML = devCardArray.length
        //console.log(card)


        //need to remove this line later because these dev cards are not actually being played yet
        playDevCard(card)
    }else{
        console.log("deck empty")
    }
    drawBank()
    
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

function moveRobber(){

    //unblock current tile
    currTile = robberLocation
    currTile.unBlock()

    //disable all other actions until robber is moved
    movingRobber = true;
    freeze()

}

function freeze(){
    document.getElementById("diceButton").disabled = true;
    document.getElementById("devButton").disabled = true;
}

function unfreeze(){
    document.getElementById("diceButton").disabled = false;
    document.getElementById("devButton").disabled = false;
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

        case "prod":
            drawProductionCapacity();
            break;

        default:
            break;
    }
    
}

//--------------------------------------------------
//End of button controls
//--------------------------------------------------



//where does this belong??
//sums up dot values for each resource by checking all tiles
function calcProduction(){
    for(i = 0; i < tilesArr.length; i++){
        for(j = 0; j < tilesArr[i].length; j++){

            if(tilesArr[i][j].resourceCard === "wood"){
                productionCapacity[0] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "brick"){
                productionCapacity[1] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "sheep"){
                productionCapacity[2] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "wheat"){
                productionCapacity[3] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "ore"){
                productionCapacity[4] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }

        }
    }
}




//--------------------------------------------------
//Draw functions (moved to other files now sorry just ignore this)
//--------------------------------------------------

