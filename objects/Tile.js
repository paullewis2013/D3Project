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