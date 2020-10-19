//I'm moving the object definitions here for better manageability


//define settlement object
function Settlement(vertex, player) {
    this.isCity = false;
    this.location = vertex;
    this.player = player;
}


//define vertex object
function Vertex(cx, cy, hitbox) {
    this.cx = cx;
    this.cy = cy;
    this.hitbox = hitbox;
    this.adjTiles = [];
    this.adjVerts = [];
    this.adjRoads = [];
    this.dead = false;
    this.settlement = null;
    this.port = null;
}
Vertex.prototype.toString = function () {
    var string = "";

    for (var i = 0; i < this.adjTiles.length; i++) {
        string += "("

        if (this.adjTiles[i].blocked == true) {
            string += "blocked"
        }
        string += `${this.adjTiles[i].number}_${this.adjTiles[i].resourceCard})`
    }

    //string += this.adjTiles.length

    return string
}
Vertex.prototype.build = function (settlement) {
    this.settlement = settlement;

    //loop through adjacent verts and make them unbuildable
    for (var i = 0; i < this.adjVerts.length; i++) {
        this.adjVerts[i].dead = true;
    }

}
//player is to set a specific player deadroads is to track visited roads
//works recursively
Vertex.prototype.getLongestPath = function (player, deadRoads){

    let newRoads = [];

    //finds all unexplored roads 
    for(let i = 0; i < this.adjRoads.length; i++){

        if(this.adjRoads[i].player === player && !deadRoads.includes(this.adjRoads[i])){
            newRoads.push(this.adjRoads[i])
        }

    }
    
    //base case is no adj roads of given color that aren't in deadRoads list
    if(newRoads.length === 0){
        return 0;
    }
    //for each unexplored road call the method again recursively on the vertex at the other end of the road
    else{

        //track results of each recursive call
        let scores = [];

        for(let i = 0; i < newRoads.length; i++){

            //create a new dead roads list for next recursive call
            let updatedDeadRoads = [];
            for(let j = 0; j < deadRoads.length; j++){
                updatedDeadRoads.push(deadRoads[j])
            }

            //add current road
            updatedDeadRoads.push(newRoads[i]);

            //get the next vertex for recursive call
            nextVert = newRoads[i].getOppositeVert(this);

            scores.push(1 + nextVert.getLongestPath(player, updatedDeadRoads))

        }

        let max = 0;

        for(let i = 0; i < scores.length; i++){
            max = (scores[i] > max) ? scores[i] : max;
        }

        //take the maximum value returned from of any of the recursive calls
        return max;

    }



}


//define road object
function Road(player, hitbox){
    this.player = player;
    this.hitbox = hitbox;
    this.adjRoads = [];
    this.adjVerts = [];
    this.i;
    this.j;
}
//pass the road a vertex and if the vertex is adjacent return the opposite adjacent vertex
Road.prototype.getOppositeVert = function(v){

    if(this.adjVerts.includes(v)){

        //console.log("opposite vert included")

        if(this.adjVerts[0] === v){
            return this.adjVerts[1]
        }else{
            return this.adjVerts[0]
        }

    }

    //if the vertex wasn't adjacent return null
    return null;
    

}


//define player object
function Player(color, isBot){
    this.isBot = isBot;
    this.VP = 0;
    this.name = "";
    this.resources = [0, 0, 0, 0, 0];
    this.devCards = [0, 0, 0, 0, 0];
    this.roadsRemaining = 15;
    this.settlementsRemaining = 5;
    this.citiesRemaining = 4;
    this.longestRoad = 0;
    this.knightsPlayed = 0;
    this.color = color;
    this.tradecost = [4, 4, 4, 4, 4];
    this.settlements = [];
    this.roads = [];

    this.settlementA = null;
    this.settlementB = null;

    this.visited = [];
}
Player.prototype.setBot = function(isBot){
    this.isBot = isBot;
}
Player.prototype.buildSettlement = function(settlement){
    
    //console.log("building a settlement")

    if(this.VP === 0){
        this.settlementA = settlement;
    }else if(this.VP === 1){
        this.settlementB = settlement;

        //TODO player gets 1 of each resource for settlement B
        let v = this.settlementB.location;
        let amount = 1;

        for(let i = 0; i < v.adjTiles.length; i++){

            let r = v.adjTiles[i].resourceCard;

            switch(r){

                case "wood":
                    if(bank[0] > 0){
                        bank[0] -= amount;
                        this.resources[0] += amount;
                    }
                    break;
                
                case "brick":
                    if(bank[1] > 0){
                        bank[1] -= amount;
                        this.resources[1] += amount;
                    }
                    break;

                case "sheep":
                    if(bank[2] > 0){
                        bank[2] -= amount;
                        this.resources[2] += amount;
                    }
                    break;

                case "wheat":
                    if(bank[3] > 0){
                        bank[3] -= amount;
                        this.resources[3] += amount;
                    }
                    break;

                case "ore":
                    if(bank[4] > 0){
                        bank[4] -= amount;
                        this.resources[4] += amount;
                    }
                    break;
                
                default:

            
            }

        }

    }

    if(initialPlacementsComplete){
        //take players resources and give them to the bank
        this.resources = [this.resources[0] - 1, this.resources[1] - 1, this.resources[2] - 1, this.resources[3] - 1, this.resources[4]];
        bank = [bank[0] + 1, bank[1] + 1, bank[2] + 1, bank[3] + 1, bank[4]];
    }

    //give player better trade rate with bank
    if(settlement.location.port !== null){

        let trade = settlement.location.port.trade

        switch(trade){

            case "3:1":

                //lower any tradecosts that were 4:1 to 3:1
                for(let i = 0; i < this.tradecost.length; i++){
                    if(this.tradecost[i] > 3){
                        this.tradecost[i] = 3;
                    }
                }

                break;

            case "wood":

                this.tradecost[0] = 2
                break;

            case "brick":

                this.tradecost[1] = 2
                break;

            case "sheep":

                this.tradecost[2] = 2
                break;

            case "wheat":

                this.tradecost[3] = 2
                break;

            case "ore":

                this.tradecost[4] = 2
                break;
        }

    }
    
    this.VP++;
    this.settlementsRemaining--;
    this.settlements.push(settlement);

    checkWinCondition()
}
Player.prototype.buildRoad = function(r){
    this.roadsRemaining--;
    this.roads.push(r)

    if(initialPlacementsComplete){
        //take players resources and give them to the bank
        this.resources = [this.resources[0] - 1, this.resources[1] - 1, this.resources[2], this.resources[3], this.resources[4]];
        bank = [bank[0] + 1, bank[1] + 1, bank[2], bank[3], bank[4]];
    }

    //longest road will be calculated in board.js file

    checkWinCondition()
}
Player.prototype.totalResources = function(){
    
    var sum = 0

    for(var i = 0; i < 5; i++){
        sum += this.resources[i];
    }

    return sum;
}
Player.prototype.buildCity = function(){
    
    
    //take players resources and give them to the bank
    this.resources = [this.resources[0], this.resources[1], this.resources[2], this.resources[3] - 2, this.resources[4] - 3];
    bank = [bank[0], bank[1], bank[2], bank[3] + 2, bank[4] + 3];


    this.settlementsRemaining++;
    this.citiesRemaining--;
    this.VP++;

    checkWinCondition()
}
Player.prototype.drawDevCard = function(card){

    //take players resources and give them to the bank
    this.resources = [this.resources[0], this.resources[1], this.resources[2] - 1, this.resources[3] - 1, this.resources[4] - 1];
    bank = [bank[0], bank[1], bank[2] + 1, bank[3] + 1, bank[4] + 1];
    
    switch(card){
        case "knight": 

            this.devCards[0]++

            break;

        case "victory point": 

            this.devCards[1]++

            break;

        case "monopoly": 

            this.devCards[2]++

            break;

        case "road building": 

            this.devCards[3]++

            break;

        case "year of plenty": 

            this.devCards[4]++

            break;

        default:
    }

    checkWinCondition()
}
Player.prototype.playDevCard = async function(card){
    
    devCardPlayedThisTurn = true;

    switch(card){

        case "knight": 

            console.log("playing a " + card)

            //remove knight from player hand and do actions for playing knight
            this.devCards[0]--;
            this.knightsPlayed++;

            //check largest army condition
            if(this.knightsPlayed >= 3){
                if(largestArmyHolder == null){
                    largestArmyHolder = this
                }else{
                    if(this.knightsPlayed > largestArmyHolder.knightsPlayed){
                        largestArmyHolder = this
                    }
                }
            }

            //select a tile

                //select a tile for bot

                //or take human input to select tile

                //set tile to blocked
                //set old tile to unblocked

            //select a player to rob

                //select a player to rob as bot

                //or take human input to select tile

            //take a random resource from the selected player
            //and give it to the player who played the knight

            //TODO add this code to 7 roll also

            break;

        case "victory point": 

            console.log("Can't play this card " + card)

            //maybe give some input that this cannot be played during a turn
            devCardPlayedThisTurn = false;

            break;

        case "monopoly": 

            console.log("playing a " + card)

            this.devCards[2]--;
            
            let resourceNum = 0

            //bot selects a resource randomly
            if(this.isBot){
                resourceNum = Math.floor(Math.random() * 5)
            }
            //have player select a resource manually
            else{

                //set a global variable to mark that a resource is being selected
                //draw the trade menu on the canvas
                showMonopolyMenu = true;

                //block until a resouce is selected
                resourceNum = await waitForMonopolyChoice()

                console.log("Monopoly played on resource: " + resourceNum)

                //restore global variable to default state
                showMonopolyMenu = false;
            }

            //take the cards
            for(let i = 0; i < playersArr.length; i++){
                
                //for each other player take their cards of given type and transfer them to player
                if(playersArr[i] != this){
                    let loot = playersArr[i].resources[resourceNum]
                    playersArr[i].resources[resourceNum] = 0
                    this.resources[resourceNum] += loot
                }
            }


            break;

        case "road building": 

            console.log("playing a " + card)
            
            this.devCards[3]--;

            //lets player build 2 roads

            //loop twice
            for(let i = 0; i < 2; i++){
                
                if(this.roadsRemaining > 0){
                    //bot way to do this
                    if(this.isBot){

                    
                    }
                    //human way
                    else{
                        //TODO make road free and don't let player click out of it

                        roadButton()
                        await waitForRoad(this, 14 - this.roadsRemaining)
                    }
                }
                
            }




            break;

        case "year of plenty": 

            console.log("playing a " + card)

            this.devCards[4]--;


            //TODO get input from player about which two resouces (contained in the bank) that they want
            let resourceNum1 = 0
            let resourceNum2 = 0

            //take those two resouces from the bank and give them to player
            bank[resourceNum1]--
            this.resources[resourceNum1]++

            bank[resourceNum2]--
            this.resources[resourceNum2]++

            break;

        default:


    }

    // drawHand()
    // drawButtons()

    checkWinCondition()

}
Player.prototype.getBuildableRoads = function(){

    let buildableRoads = [];

    //first and second settlements during initial placement have special rules for road placement
    if(this.VP === 1){
        if(this.roadsRemaining === 15){
            return this.settlementA.location.adjRoads;
        }
        return [];
    }else if(this.VP === 2){
        if(this.roadsRemaining === 14){
            return this.settlementB.location.adjRoads;
        }
    }
    
    //loop through roads
    for(let i = 0; i < this.roads.length; i++){
        for(let j = 0; j < this.roads[i].adjRoads.length; j++){
            
            // console.log(this.roads[i].adjRoads[j])

            //check if road is already there
            if(this.roads[i].adjRoads[j].player === null){
                //console.log(this.roads[i].adjRoads[j])
                buildableRoads.push(this.roads[i].adjRoads[j])
            }
        }
    }
    
    return buildableRoads;

}
Player.prototype.calcLongestRoad = function(){

    let currLength = 0;
    let length = 0;

    //get an array of all reachable vertices for given player
    let verts = this.getReachableVertices();
    //console.log("numVerts = " + verts.length)

    //for each vertex, find the longest path that includes that vertex
    for(let i = 0; i < verts.length; i++){
        
        currLength = verts[i].getLongestPath(this, [])

        //compare current vertex longest path and longest previous path and set length to the longer one
        length = (currLength > length) ? currLength : length
    }

    //update longest road length for player
    this.longestRoad = length;


    //TODO if longest road changes hands do that here
    //road must be at least 5 and greater than any other players longest road
    if(this.longestRoad >= 5){

        //if longest road holder is null then no player has longest road yet
        if(longestRoadHolder == null){
            longestRoadHolder = this;
        }else{
            if(this.longestRoad > longestRoadHolder.longestRoad){
                longestRoadHolder = this;
            }
        }

    }

}
Player.prototype.getBuildableVertices = function(){

    let buildableVerts = []

    for(var i = 0; i < 12; i++){

        for(var j = 0; j < verticesArr[i].length; j++){
            
            if(verticesArr[i][j].settlement === null && verticesArr[i][j].dead !== true){
                // ctx.fillStyle = "white";
                // ctx.fill(verticesArr[i][j].hitbox)
                // ctx.stroke(verticesArr[i][j].hitbox)

                // //for debug
                // // ctx.fillStyle = "black"
                // // ctx.fillText(i + "," + j, verticesArr[i][j].cx, verticesArr[i][j].cy + 5)

                for(let k = 0; k < verticesArr[i][j].adjRoads.length; k++){
                    if(verticesArr[i][j].adjRoads[k].player === currPlayer){
                        buildableVerts.push(verticesArr[i][j])
                    }
                }

            }
        }

    }

    return buildableVerts

}
Player.prototype.getReachableVertices = function(){

    let reachableVerts = [];

    //loop through every vertex in the board and return any vertex that has an adjacent road for the current player
    for(var i = 0; i < 12; i++){

        for(var j = 0; j < verticesArr[i].length; j++){
            
            //look at each road for given vertex and add the vertex if current player has an adjacent road
            for(let k = 0; k < verticesArr[i][j].adjRoads.length; k++){
                
                if(verticesArr[i][j].adjRoads[k].player === this ){
                    if(!reachableVerts.includes(verticesArr[i][j])){
                        reachableVerts.push(verticesArr[i][j])
                    }
                }
            }

            
        }

    }
    

    return reachableVerts;
}
Player.prototype.getVP = function(){

    let result = this.VP;

    //add points for longest road
    if(longestRoadHolder === this){
        result += 2;
    }

    //add points for largest army 
    if(largestArmyHolder === this){
        result += 2;
    }

    return result;

}
Player.prototype.botBestSettlement = function(){

    let highestUtilityVert = null
    let highestUtility = 0

    //find open vertex with most production points
    for(let i = 0; i < 12; i++){
        for(let j = 0; j < verticesArr[i].length; j++){

            //only check settlements that are buildable
            if(verticesArr[i][j].settlement == null && !verticesArr[i][j].dead){
                
                let utility = this.botCalcSettlementValue(verticesArr[i][j])

                //this favor settlements higher on the board since there isn't a chance of picking
                //later equally valued settlements
                if(utility > highestUtility){
                    highestUtilityVert = verticesArr[i][j]
                    highestUtility = utility
                }
            }
            

        }
    }

    buildSettlement(highestUtilityVert, this) 


}
Player.prototype.botBestRoad = function(base){

    //very naive approach to roads
    //just builds a random legal road

    potentialRoads = this.getBuildableRoads()

    let randomIndex = Math.floor(Math.random() * (potentialRoads.length))

    // buildRoad(potentialRoads[randomIndex], this)


    //experimental

    let potentialRoadScores = [];
    this.visited = []

    //for each potential road out of settlement explore to see if there are buildable vertices
    for(let i = 0; i < potentialRoads.length; i++){
        this.visited = []
        potentialRoadScores.push(this.botCalcRoadValue(potentialRoads[i], base))
    }

    //loop through potential road scores and build road with highest score
    let index = 0
    let max = 0

    for(let i = 0; i < potentialRoadScores.length; i++){
        console.log(potentialRoadScores[i])

        if(potentialRoadScores[i] > max){
            index = i
            max = potentialRoadScores[i]
        }
    }

    buildRoad(potentialRoads[index], this)

}
Player.prototype.botDiscard = function(){

    //figure out how many total cards player has
    let numCards = 0

    for(let i = 0; i < this.resources.length; i++){
        numCards += this.resources[i]
    }

    let numToDiscard = 0

    //if cards is greater than 7 need to discard half
    if(numCards > 7){
        numToDiscard = Math.floor(numCards/2)

        //discard one card at a time until you no longer need to discard
        while(numToDiscard > 0){

            //generate a random resourceType
            let resourceType = Math.floor(Math.random() * 5)

            if(this.resources[resourceType] != 0){
                //return card to bank
                this.resources[resourceType]--
                bank[resourceType]++

                //reduce counters for remaining cards
                numCards--
                numToDiscard--
            }
            
        }
    }

}
Player.prototype.botCalcSettlementValue = function(vertex){
    
    //calculates value of a settlement as 0 if it cannot build there or the sum of production value otherwise

    if(vertex.settlement != null || vertex.dead){
        return 0
    }

    //sum of production points for tile
    let currCount = 0
    for(let k = 0; k < vertex.adjTiles.length; k++){

        if(vertex.adjTiles[k].number !== 7){
            currCount += 6 - Math.abs(7 - vertex.adjTiles[k].number)
        }

    }

    //add in extra weight for ports
    if(vertex.port != null){
        currCount++;
    }

    //add in extra weight for 2nd settlement resources
    if(!initialPlacementsComplete && this.VP == 1){

        //create array of adjacent resources
        let foundResources = []

        for(let i = 0; i < vertex.adjTiles.length; i++){
            let r = vertex.adjTiles[i].resourceCard

            switch(r){
                
                case "wood":
                    foundResources[0]++
                    break;
                
                case "brick":
                    foundResources[1]++
                    break;

                case "sheep":
                    foundResources[2]++
                    break;

                case "wheat":
                    foundResources[3]++
                    break;

                case "ore":
                    foundResources[4]++
                    break;
                
                default:

            }
        }

        //if it provides an initial road
        if(foundResources[0] != 0 && foundResources[1] != 0){
            currCount++
        }

        //if it provides an initial dev card
        if(foundResources[2] != 0 && foundResources[3] != 0 && foundResources[4] != 0){
            currCount++
        }

    }

    //add in extra weight for expansion potential

    //add in extra weight for resource synergy

    //add in extra weight for diversity of resources



    return currCount
}
Player.prototype.botCalcRoadValue = function(road, base){

    //console.log("called recursively")

    //create essentially a binary tree spanning outwards from road

    let value = 0

    //move outwards once
    d1 = road.getOppositeVert(base)
    this.visited.push(road)
    this.visited.push(d1)

    //console.log(d1.toString())

    //base case is a dead end road
    if(d1.settlement != null){
        return 0;
    }


    //loop through adjacent roads to d1
    for(let i = 0; i < d1.adjRoads.length; i++){

        //explore paths down open roads
        if(d1.adjRoads[i].player == null && !this.visited.includes(d1.adjRoads[i])){
            
            value += 0.5 * this.botCalcRoadValue(d1.adjRoads[i], d1)
        }
    }   

    return value + this.botCalcSettlementValue(base)
}


//define dice object
function Dice() {
    this.value = 1;
    this.img = "Dice-1.png";
}
Dice.prototype.roll = function () {
    this.value = Math.floor(Math.random() * 6) + 1;
}
Dice.prototype.getValue = function () {
    return this.value;
}
//returns a string with the url for the correct image
//images from wikipedia commons
Dice.prototype.getImg = function () {
    if (this.value === 0) {
        return this.img;
    } else if (this.value === 1) {
        this.img = "assets/Dice-1.png";
        return this.img;
    } else if (this.value === 2) {
        this.img = "assets/Dice-2.png";
        return this.img;
    } else if (this.value === 3) {
        this.img = "assets/Dice-3.png";
        return this.img;
    } else if (this.value === 4) {
        this.img = "assets/Dice-4.png";
        return this.img;
    } else if (this.value === 5) {
        this.img = "assets/Dice-5.png";
        return this.img;
    } else {
        this.img = "assets/Dice-6.png";
        return this.img;
    }
}


//define tile object
function Tile(r, num, color, path) {
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
Tile.prototype.block = function () {
    this.blocked = true;
}
Tile.prototype.unBlock = function () {
    this.blocked = false;
}
Tile.prototype.getPath = function () {
    return this.path;
}


//define port object
function Port(trade, verts){
    this.vertices = verts;
    this.trade = trade;
    this.cx = 0;
    this.cy = 0;
}

