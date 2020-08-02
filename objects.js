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


//define road object
function Road(player, hitbox){
    this.player = player;
    this.hitbox = hitbox;
    this.adjRoads = [];
    this.i;
    this.j;
}


//define player object
function Player(color){
    this.VP = 0;
    this.resources = [0, 0, 0, 0, 0];
    this.devCards = [];
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
}
Player.prototype.buildSettlement = function(settlement){
    
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

    this.VP++;
    this.settlementsRemaining--;
    this.settlements.push(settlement);
}
Player.prototype.buildRoad = function(r){
    this.roadsRemaining--;
    this.roads.push(r)

    //calculate longest road here
    this.calcLongestRoad();
}
Player.prototype.totalResources = function(){
    
    var sum = 0

    for(var i = 0; i < 5; i++){
        sum += this.resources[i];
    }

    return sum;
}
Player.prototype.buildCity = function(){
    this.settlementsRemaining++;
    this.citiesRemaining--;
    this.VP++;
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

    //TODO

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

