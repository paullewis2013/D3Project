//I'm moving the object definitions here for better manageability


//define settlement object
function Settlement(vertex) {
    this.isCity = false;
    this.location = vertex;
    this.player = null;
}


//define vertex object
function Vertex(cx, cy, hitbox) {
    this.cx = cx;
    this.cy = cy;
    this.hitbox = hitbox;
    this.adjTiles = [];
    this.adjVerts = [];
    this.dead = false;
    this.settlement = null;
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
