//Paul Lewis
//Started in July, 2020

b_State = {
    //buttons
    diceButtonEnabled: false,
    tradeButtonEnabled: false,
    devButtonEnabled: false,
    roadButtonEnabled: false,
    settlementButtonEnabled: false,
    cityButtonEnabled: false,
    turnButtonEnabled: false,

    anyDevCardEnabled: false,
    knightsEnabled: false,

    pointsToWin: 10,
    winCondition: false,
    winner: null,

    initialPlacementsComplete: false,
    turnNumber: 0,

    diceRolledThisTurn: false,
    devCardPlayedThisTurn: false,
    currentlyTrading: false,
    buildingRoad: false,
    buildingSettlement: false,
    buildingCity: false,

    devCardArray: [],
    bank: [19, 19, 19, 19, 19],
}

//maybe this should point to a tile
var robberLocation = null;

var longestRoadHolder = null;
var largestArmyHolder = null;

//TODO remove quickstart
var quickStarting = true

//TODO this might belong to the canvas state
var randomTable = []

//the tiles on the board
//a 2d array where first index represents row and second represents num in row
var tilesArr = [
    [],
    [],
    [],
    [],
    []
]

//2d array to store vertices
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

//2d array to store roads
var roadsArr = [
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

var portsArr = [];

var playersArr = [];
var currPlayer = null;
var currPlayerIndex;

//create an array of 2 dice to be rolled
//TODO this shouldn't be loose
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

var numTilePointers = [
    [],
    [],
    [],
    [],
    [],

    [], //7

    [],
    [],
    [],
    [],
    [],
]

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

    for(var i = 0; i < colorNums.length; i++){
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
    for(var i = 0; i < colorNums.length; i++){
        tempTiles[i] = new Tile(resourceTypes[i], resourceNums[i], colorNums[i], resourceImgs[i])
        if(tempTiles[i].number === 7){
            tempTiles[i].block()
        }
    }

    //console.log(tempTiles)
    
    //spiral insert
    counter = 0;

    //go down left side first
    for(var i = 0; i < 5; i++){
        tilesArr[i].push( tempTiles[counter]);
        counter++;
    }
    //middle one on bottom row
    tilesArr[4].push( tempTiles[counter]);
    counter++;

    //put these ones in the wrong spot but we fix it later
    for(var i = 4; i >= 0; i--){
        tilesArr[i].push( tempTiles[counter]);
        counter++;
    }

    //go down next part of spiral on inside
    for(var i = 0; i < 4; i++){
        tilesArr[i].splice(1,0,( tempTiles[counter]))
        counter++;
    }

    //go up next part of spiral on inside
    for(var i = 3; i > 0; i--){
        tilesArr[i].splice(2,0,( tempTiles[counter]));
        counter++;
    }

    //finally center goes in
    tilesArr[2].splice(2,0,( tempTiles[counter]));
    counter++;

    //find location of robber and record it
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < tilesArr[i].length; j++){
            if(tilesArr[i][j].blocked === true){
                robberLocation = tilesArr[i][j]
            }
        }
    }

    //find location of robber and record it
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < tilesArr[i].length; j++){
            numTilePointers[tilesArr[i][j].number - 2].push(tilesArr[i][j])
        }
    }

    // don't remove this
    // it shouldn't be here but things break if it's not
    drawTiles();
}

//TODO create an init players method
// don't leave this loose
var p1 = new Player("Orange", false);
var p2 = new Player("Red", true);
var p3 = new Player("Purple", true);
var p4 = new Player("Blue", true);
// var p5= new Player("White", true);
// var p6 = new Player("Black", true);
playersArr.push(p1);
playersArr.push(p2);
playersArr.push(p3);
playersArr.push(p4);
// playersArr.push(p5);
// playersArr.push(p6);

var currPlayerIndex = Math.floor(Math.random() * playersArr.length);
var currPlayer = playersArr[currPlayerIndex];

//sets all game conditions initally
//called when last image finishes loading
function setup(){
    console.log("<1> entering set up method")

    //read in settings here to synchronize values
    syncSettings();

    // create canvas
    initCanvas();

    initRandomTable()
    populateDevCardDeck()

    setUpTiles()

    initVertices()
    generatePorts()

    //initializes canvas elements
    initCanvasElements();

    // these are stat tracking method not necessary for gameplay
    // TODO eventually all of these init methods should be handled together
    populateDiceResultsArr();
    calcProduction();

    //enter initial settlement placement phase
    initialSettlements()
}

async function initialSettlements(){

    console.log("<2> entering Initial Settlements Loop")

    //disable all buttons
    b_State.diceButtonEnabled = false;
    b_State.devButtonEnabled = false;
    b_State.roadButtonEnabled = false;
    b_State.settlementButtonEnabled = false;
    b_State.cityButtonEnabled = false;
    b_State.turnButtonEnabled = false;

    let botDelay = 250

    //go through players in order
    //WARNING use currPlayer to access player and not playersArr[i]
    for(let i = 0; i < playersArr.length; i++){

        //input for all players
        if(!currPlayer.isBot || !quickStarting){
            settlementButton();

            //create a function that waits for settlement to be built before continuing
            await waitForSettlement(currPlayer, 1);
            c_State.showVerts = false;

            roadButton();

            //a function that waits for road to be built before continuing
            await waitForRoad(currPlayer, 1);
        }
        //bot placement
        else{
            c_State.showVerts = false

            currPlayer.botBestSettlement()

            await sleep(botDelay)

            currPlayer.botBestRoad(currPlayer.settlementA.location)

            await sleep(botDelay)
        }

        if(i < playersArr.length - 1){
            currPlayerIndex = ++currPlayerIndex%(playersArr.length);
            currPlayer = playersArr[currPlayerIndex]
        }
    }

    //snake backwards through players
    for(let i = 0; i < playersArr.length; i++){

        //input for all players
        if(!currPlayer.isBot || !quickStarting){

            settlementButton();

            //create a function that waits for settlement to be built before continuing
            await waitForSettlement(currPlayer, 2);
            c_State.showVerts = false;

            roadButton();

            //a function that waits for road to be built before continuing
            await waitForRoad(currPlayer, 2);
        }
        //bot placement
        else{
            c_State.showVerts = false

            currPlayer.botBestSettlement()

            await sleep(botDelay)

            currPlayer.botBestRoad(currPlayer.settlementB.location)

            await sleep(botDelay)
        }

        if(i < playersArr.length - 1){
            currPlayerIndex = (currPlayerIndex + 3)%(playersArr.length);
            currPlayer = playersArr[currPlayerIndex]
        }
    }

    b_State.initialPlacementsComplete = true;

    //enter main game loop here
    mainGameLoop()
}

async function mainGameLoop(){
    console.log("<3> entering MainGameLoop")

    b_State.turnNumber = 1;

    //unbot all the players
    // for(let i = 0; i < playersArr.length; i++){
    //     playersArr[i].isBot = false;
    // }

    //turn loop
    do {

        if(currPlayer.isBot){
            await sleep(1000)
            currPlayer.botTurn()
            await sleep(500)
        }else{
            // this is for a specific edge case where a player can reach 10 points while it
            // is not their turn
            checkWinCondition()

            //disable all moves except dice and knight
            b_State.diceRolledThisTurn = false;
            freeze()
            b_State.diceButtonEnabled = true;

            //cap dev cards played per turn
            b_State.devCardPlayedThisTurn = false;
            b_State.anyDevCardEnabled = false;

            //preturn option to play knight card
            b_State.knightsEnabled = true;

            //await player rolling the dice
            await waitForDiceRoll()

            //handle this in roll dice method
            //if robber
                //await each player choosing resources to discard
                //await currPlayer moving robber
                //await currPlayer choosing player to rob

            //begin body of turn
            b_State.anyDevCardEnabled = true;

            //disable all moves which aren't legal for player
            // drawButtons()

            //main turn loop actions can happen asynchronously here 

            //await choice to end turn
            await waitForTurnButton(b_State.turnNumber);
        }
    
    }while(!b_State.winCondition)

    //do something when end of game condition is reached

    freeze();

    console.log("Game over")
    console.log(b_State.winner.color + " won the game")
}

//disables buttons which the user cannot push
function setButtons(player){

    //don't enable buttons when it's not the players turn
    if(player != currPlayer || b_State.winCondition){
        b_State.tradeButtonEnabled = false;
        b_State.devButtonEnabled = false;
        b_State.roadButtonEnabled = false;
        b_State.settlementButtonEnabled = false;
        b_State.cityButtonEnabled = false;
        b_State.turnButtonEnabled = false;
        b_State.diceButtonEnabled = false;
        return;
    }
    
    let building = b_State.buildingRoad || b_State.buildingSettlement || b_State.buildingCity;
    let trading = b_State.currentlyTrading;

    if(b_State.diceRolledThisTurn && !c_State.movingRobber && !c_State.showMonopolyMenu && !c_State.showYOPMenu){

        //trade button
        if(!building){
            b_State.tradeButtonEnabled = true;
        }else{
            b_State.tradeButtonEnabled = false;
        }
        
        //dev button
        if(!building && !trading && b_State.devCardArray.length > 0 && (currPlayer.resources[2] > 0 && currPlayer.resources[3] > 0 && currPlayer.resources[4] > 0)){
            b_State.devButtonEnabled = true;
        }else{
            b_State.devButtonEnabled = false;
        }

        //road
        if((!building || b_State.buildingRoad) && !trading && currPlayer.roadsRemaining > 0 && (currPlayer.resources[0] > 0 && currPlayer.resources[1] > 0) ){
            b_State.roadButtonEnabled = true;
        }else{
            b_State.roadButtonEnabled = false;
        }

        //settlement
        if((!building || b_State.buildingSettlement) && !trading && currPlayer.settlementsRemaining > 0 && (currPlayer.resources[0] > 0 && currPlayer.resources[1] > 0 && currPlayer.resources[2] > 0 && currPlayer.resources[3] > 0 ) ){
            b_State.settlementButtonEnabled = true;
        }else{
            b_State.settlementButtonEnabled = false;
        }

        //city 
        if((!building || b_State.buildingCity) && !trading && currPlayer.citiesRemaining > 0 && (currPlayer.resources[3] > 1 && currPlayer.resources[4] > 2) ){
            b_State.cityButtonEnabled = true;
        }else{
            b_State.cityButtonEnabled = false;
        }

        //turn
        if(!building && !trading && b_State.diceRolledThisTurn){
            b_State.turnButtonEnabled = true
        }else{
            b_State.turnButtonEnabled = false;
        }
        
    }else{

        b_State.tradeButtonEnabled = false;
        b_State.devButtonEnabled = false;
        b_State.roadButtonEnabled = false;
        b_State.settlementButtonEnabled = false;
        b_State.cityButtonEnabled = false;
        b_State.turnButtonEnabled = false;

    }
    
    //dice
    if(!b_State.diceRolledThisTurn && b_State.initialPlacementsComplete){
        b_State.diceButtonEnabled = true;
    }else{
        b_State.diceButtonEnabled = false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForSettlement(player, num){

    let built = false;

    while(!built){

        if(b_State.winCondition){
            break;
        }else if(5 - player.settlementsRemaining >= num){
            built = true
        }else{
            await sleep(100)
        }
    }
}

//bizarrely this is the exact same method body as waitForMonopolyChoice but it handles the global variable 
//differently outside of this method
//nvm it is now different
async function waitForYOPChoice(){

    let finished = false;

    while(!finished){

        if(c_State.yop2){
            return c_State.selectedResource
        }else{
            //console.log("waiting for resource num")
            await sleep(100)
        }
    }
}

async function waitForRobberMoved(){
    
    let finished = false;

    while(!finished){

        if(!c_State.movingRobber){
            return;
        }else{
            //console.log("waiting for resource num")
            await sleep(100)
        }
    }
}

async function waitForMonopolyChoice(){

    let resourceNum = -1

    while(resourceNum == -1){

        if(c_State.selectedResource != null){
            resourceNum = c_State.selectedResource
            c_State.selectedResource = null
        }else{
            //console.log("waiting for resource num")
            await sleep(100)
        }

    }

    return resourceNum;

}

async function waitForRoad(player, num){

    let built = false;

    while(!built){

        if(b_State.winCondition){
            break;
        }else if(15 - player.roadsRemaining >= num){
            built = true
        }else{
            await sleep(100)
        }
    }

    return true;
}

async function waitForTurnButton(currentTurn){

    let ended = false;

    while(!ended){

        if(b_State.winCondition){
            break;
        }else if(b_State.turnNumber > currentTurn){
            ended = true
        }else{
            await sleep(100)
        }
    }
}

async function waitForDiceRoll(){

    let diceRollFinished = false
    b_State.knightsEnabled = true

    while(!diceRollFinished){
        
        if(b_State.winCondition){
            break;
        }else if(b_State.diceRolledThisTurn && !c_State.movingRobber){
            diceRollFinished = true;
        }else{
            await sleep(100)
        } 
    }
}

//populate dev card array and unplayed dev card array then shuffle the dev card array 
// being used as deck
function populateDevCardDeck(){
    for(var i = 0; i < 14; i++){
        b_State.devCardArray.push(devCard.KNIGHT);
    }
    for(var i = 0; i < 5; i++){
        b_State.devCardArray.push(devCard.VP);
    }
    for(var i = 0; i < 2; i++){
        b_State.devCardArray.push(devCard.MONOPOLY);
    }
    for(var i = 0; i < 2; i++){
        b_State.devCardArray.push(devCard.ROAD);
    }
    for(var i = 0; i < 2; i++){
        b_State.devCardArray.push(devCard.PLENTY);
    }
    b_State.devCardArray = _.shuffle(b_State.devCardArray)
}

//TODO move this to stats file
//fill dice array with 0s
function populateDiceResultsArr(){
    for(var i = 0; i<11; i++){
        d_State.dice_results_arr.push({
            value: i+2,
            frequency: 0
        })
    }
}

//requires verticesArr to already exist
function generatePorts(){

    //4 3:1 ports and a 2:1 for every resource
    var tradesArr = [
        "3:1",
        "3:1",
        "3:1",
        "3:1",

        "wood",
        "brick",
        "sheep",
        "wheat",
        "ore",
    ]

    var portLocations = [
        [verticesArr[1][0], verticesArr[0][0]],
        [verticesArr[0][1], verticesArr[1][2]],
        [verticesArr[2][3], verticesArr[3][4]],

        [verticesArr[3][0], verticesArr[4][0]],
        [verticesArr[5][5], verticesArr[6][5]],
        [verticesArr[7][0], verticesArr[8][0]],

        [verticesArr[9][3], verticesArr[8][4]],
        [verticesArr[10][0], verticesArr[11][0]],
        [verticesArr[11][1], verticesArr[10][2]],
    ]

    //randomize port trades
    tradesArr = _.shuffle(tradesArr)

    for (var i = 0; i < 9; i++){
        portsArr.push(new Port(tradesArr[i], portLocations[i]))

        portsArr[i].vertices[0].port = portsArr[i]
        portsArr[i].vertices[1].port = portsArr[i]
    }
}

//--------------------------------------------------
//functions for game events
//--------------------------------------------------

function checkWinCondition(){

    if(currPlayer.getVP() + currPlayer.devCards[1] >= b_State.pointsToWin){
        b_State.winCondition = true;
        b_State.winner = currPlayer;
        alert("Game Over")
    }
}

//generates a dice roll between 1 and 12 by summing two d6
function rollDice(){

    b_State.diceRolledThisTurn = true;

    diceArr[0].roll()
    diceArr[1].roll()

    var result = diceArr[0].getValue() + diceArr[1].getValue()

    d_State.dice_results_arr[result - 2].frequency += 1;

    if(result === 7){
        //discard resources over 7 first
        //loop through all players
        for(let i = 0; i < playersArr.length; i++){
            if(playersArr[i].isBot){
                playersArr[i].botDiscard()
            }
        }

        //move robber after resources discarded
        moveRobber();
    }else{
        //generate resources

        generateResources(result);

    }
    return result;
}

//this name is kind of confusing tbh
//nothing is drawn on the canvas here
function drawDevCard(){
    if(b_State.devCardArray.length > 0){
        var card = b_State.devCardArray.pop();

        currPlayer.drawDevCard(card)
    }else{
        console.log("deck empty")
    }
}

function generateResources(result){

    //get array of tiles rolled
    var tiles = numTilePointers[result - 2]

    for(var i = 0; i < tiles.length; i++){
        
        //don't generate resources for blocked tiles
        if(tiles[i].blocked !== true){

            for(var j = 0; j < tiles[i].settlements.length; j++){
                var p = tiles[i].settlements[j].player;
                var r = tiles[i].resourceCard;

                var amount = 1;
                if(tiles[i].settlements[j].isCity){
                    amount = 2;
                }

                if(p !== null){

                    //TODO if two players get a resource and the bank doesn't have enough for both then neither player gets it
                    //console.log(p.resources)

                    switch(r){
                        case "wood":
                            if(b_State.bank[0] > 0){
                                b_State.bank[0] -= amount;
                                p.resources[0] += amount;
                            }
                            break;
                        
                        case "brick":
                            if(b_State.bank[1] > 0){
                                b_State.bank[1] -= amount;
                                p.resources[1] += amount;
                            }
                            break;

                        case "sheep":
                            if(b_State.bank[2] > 0){
                                b_State.bank[2] -= amount;
                                p.resources[2] += amount;
                            }
                            break;

                        case "wheat":
                            if(b_State.bank[3] > 0){
                                b_State.bank[3] -= amount;
                                p.resources[3] += amount;
                            }
                            break;

                        case "ore":
                            if(b_State.bank[4] > 0){
                                b_State.bank[4] -= amount;
                                p.resources[4] += amount;
                            }
                            break;
                        
                        default:

                    }
                }
            }
        }
    }
}

function playDevCard(card){
    
    //update unplayed dev cards tracker
    switch(card){
        case devCard.KNIGHT:
            d_State.unplayedDevCards.knight -= 1;
            d_State.playedDevCards.knight += 1;
            break;
        case devCard.VP:
            d_State.unplayedDevCards.vp -= 1;
            d_State.playedDevCards.vp += 1;
            break;
        case devCard.MONOPOLY:
            d_State.unplayedDevCards.monopoly -= 1;
            d_State.playedDevCards.monopoly += 1;
            break;
        case devCard.ROAD:
            d_State.unplayedDevCards.road -= 1;
            d_State.playedDevCards.road += 1;
            break;
        case devCard.PLENTY:
            d_State.unplayedDevCards.plenty -= 1;
            d_State.playedDevCards.plenty += 1;
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
    c_State.movingRobber = true;
    freeze()
}

function buildRoad(road, player){

    //do not build a road somewhere where one already exists
    if(road.player !== null || player.roadsRemaining <= 0){
        console.log("Cannot build a road here");
        return;
    }

    player.buildRoad(road)

    road.player = player;

    player.calcLongestRoad()

    b_State.buildingRoad = false;
    c_State.showRoads = false;
    unfreeze();
}

function buildSettlement(vertex, player){

    //do not build settlement somewhere that you can't
    if(vertex.dead === true || vertex.settlement !== null || player.settlementsRemaining <= 0){
        console.log("cannot build a settlement here")
        return;
    }

    //console.log("building a Settlement at " + vertex)

    //add settlement reference to vertex
    vertex.settlement = new Settlement(vertex, player);

    player.buildSettlement(vertex.settlement)

    //add settlement reference to each adjacent tile
    for(var i = 0; i < vertex.adjTiles.length; i++){
        vertex.adjTiles[i].settlements.push(vertex.settlement)
    }

    //make any adjacent vertecies dead so that settlements cannot be built on them
    vertex.build(vertex.settlement);

    b_State.buildingSettlement = false;
    c_State.showVerts = false;
    unfreeze();
}

function buildCity(settlement, player){

    settlement.isCity = true;
    player.buildCity();

    b_State.buildingCity = false;
    unfreeze();

}

function cancelAction(){

    console.log("canceling")

    c_State.showRoads = false;

    c_State.movingRobber = false;
    b_State.buildingRoad = false;
    b_State.buildingSettlement = false;
    b_State.buildingCity = false;

    //unfreeze()
    drawCanvas()
}

function turnButton(){
    
    b_State.turnNumber++;

    //move to next player
    currPlayerIndex = ++currPlayerIndex%(playersArr.length);
    currPlayer = playersArr[currPlayerIndex];

    b_State.currentlyTrading = false;

    console.log("turn completed")
}

function tradeButton(){

    if(!b_State.currentlyTrading){
        b_State.currentlyTrading = true;
    }else{
        b_State.currentlyTrading = false;
        clearSend();
        clearReceive();
    }
    freeze();
}

function freeze(){

    b_State.diceButtonEnabled = false;
    b_State.tradeButtonEnabled = false;
    b_State.devButtonEnabled = false;
    b_State.roadButtonEnabled = false;
    b_State.settlementButtonEnabled = false;
    b_State.cityButtonEnabled = false;
    b_State.turnButtonEnabled = false;
}

function unfreeze(){

    b_State.diceButtonEnabled = true;
    b_State.devButtonEnabled = true;
    b_State.roadButtonEnabled = true;
    b_State.settlementButtonEnabled = true;
    b_State.cityButtonEnabled = true;
    b_State.turnButtonEnabled = true;

}

//--------------------------------------------------
//end of functions for game events
//--------------------------------------------------





//--------------------------------------------------
//Button controls
//--------------------------------------------------


//called when dice button is clicked
function diceButton(){

    rollDice();
    drawDice()
    
    //updates dice results if they are visible
    graphicButton()
}

//event called when dev card button is clicked
function devButton(){
    drawDevCard()

    //updates graphics if necesary
    graphicButton()
}

function roadButton(){

    c_State.showRoads = true;
    b_State.buildingRoad = true;
    freeze();
}

function settlementButton(){

    b_State.buildingSettlement = true;
    c_State.showVerts = true;
    freeze();
}

//TODO
function cityButton(){

    b_State.buildingCity = true;
    freeze();
}

//fills the random table with angles between 0 and 2 PI Radians
function initRandomTable(){

    for(let i = 0; i < 100; i++){

        randomTable.push([])

        for(let j = 0; j < 100; j++){
            randomTable[i].push(Math.random() * 2 * Math.PI)
        }
    }
}