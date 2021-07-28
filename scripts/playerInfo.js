const playersInfoWidth = 350;

//this is the only thing this entire file does
function drawPlayerInfo(){

    var offset = (canvas.height * 0.25)  / playersArr.length;

    //draw background
    ctx.fillStyle = "#93a1a1"
    ctx.fillRect(0, offset * 4, playersInfoWidth, 85);

    for(let i = 0; i < playersArr.length; i++){

        ctx.textAlign = "center"
        ctx.font = "20px Arial";

        ctx.rect(0, offset * i, playersInfoWidth, offset);
        ctx.fillStyle = "#fdf6e3"
        
        //used to show which players turn it is
        if(playersArr[i] == currPlayer){
            ctx.fillStyle = "#9dd9b8"
        }

        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();

        //draw player circle
        ctx.beginPath();
        ctx.arc(50, offset/3 + offset * i, 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = playersArr[i].color;
        ctx.fill()

        //draw user icon on top of player circle
        ctx.drawImage(images[9], 30 - 1, offset/3 - 24 + offset * i, 42, 40)

        ctx.fillStyle = "black"

        let vp = playersArr[i].getVP()
        if(playersArr[i].devCards[1] > 0){
            vp += "(" + (vp + playersArr[i].devCards[1]) + ")"
        }

        ctx.fillText("VP: " + vp, 50, offset * i + offset * .8)
        //console.log(p1.VP)

        var cardTop = offset * i + offset * .25;

        let cardPath = new Path2D();

        //resource cards
        ctx.beginPath();
        cardPath.rect(120, cardTop, 25, 40);
        ctx.closePath();
        ctx.strokeStyle = "black"
        ctx.stroke(cardPath);
        ctx.fillStyle = "lightgrey"
        ctx.fill(cardPath);

        ctx.fillStyle = "black"
        ctx.fillText("R", 132.5, cardTop + 28)

        ctx.fillStyle = "black"
        ctx.fillText(playersArr[i].totalResources(), 132.5, cardTop + 60)
        

        let devPath = new Path2D();

        //dev cards

        let devCount =  playersArr[i].devCards[0] + 
                        playersArr[i].devCards[1] +
                        playersArr[i].devCards[2] +
                        playersArr[i].devCards[3] +
                        playersArr[i].devCards[4]


        ctx.beginPath();
        devPath.rect(160, cardTop, 25, 40);
        ctx.closePath();
        ctx.strokeStyle = "black"
        ctx.stroke(devPath);
        ctx.fillStyle = "lightgrey"
        ctx.fill(devPath);

        ctx.fillStyle = "black"
        ctx.fillText("D", 172.5, cardTop + 28)

        ctx.fillStyle = "black"
        ctx.fillText(devCount, 172.5, cardTop + 60)


        let fontH = offset/7;
        ctx.font = fontH + "px Arial";
        ctx.textAlign = "right";

        //7.5 is half the height of the font
        //road length
        ctx.fillText("Longest Road: " + playersArr[i].longestRoad, playersInfoWidth - 20, offset * i + offset * 1/3 + fontH/2)

        //army size
        ctx.fillText("Army Size: " + playersArr[i].knightsPlayed, playersInfoWidth - 20, offset * i + offset * 2/3 + fontH/2)


        //roads
        // ctx.fillText("Roads: " + playersArr[i].roadsRemaining, playersInfoWidth - 10, offset * i + offset * 1/4 + fontH/2)

        //settlements
        // ctx.fillText("Settlements: " + playersArr[i].settlementsRemaining, playersInfoWidth - 10, offset * i + offset * 2/4 + fontH/2)

        //cities
        // ctx.fillText("Cities: " + playersArr[i].citiesRemaining, playersInfoWidth - 10, offset * i + offset * 3/4 + fontH/2)
    }

    drawTurnNum(playersInfoWidth - 10, 430);
    drawTimer(playersInfoWidth - 10, 465);
    drawDice(80, 465);
}