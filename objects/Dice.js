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