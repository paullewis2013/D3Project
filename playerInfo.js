// this file controls a different canvas for drawing player info

var p_canvas = document.getElementById("playerInfo");
p_canvas.width = document.getElementById("playerDiv").clientWidth;
p_canvas.height = document.getElementById("playerDiv").clientHeight;

p_ctx = p_canvas.getContext("2d");


//important note everything coordinate wise is off by 15 for some reason
//the visible point that should be the origin is actually at (15,15)

//this is the only thing this entire file does
function drawPlayerInfo(){

    var offset = p_canvas.height / playersArr.length;

    for(let i = 0; i < playersArr.length; i++){

        p_ctx.textAlign = "center"
        p_ctx.font = "20px Arial";

        p_ctx.rect(0, offset * i, p_canvas.width, offset);
        p_ctx.fillStyle = "floralwhite"
        p_ctx.fill()
        p_ctx.stroke()

        p_ctx.beginPath();
        p_ctx.arc(50, offset/3 + offset * i, 20, 0, 2 * Math.PI, false);
        p_ctx.closePath();
        p_ctx.fillStyle = playersArr[i].color;
        p_ctx.fill()

        p_ctx.fillStyle = "black"
        p_ctx.fillText("VP: " + playersArr[i].VP, 50, offset * i + offset * .8)
        //console.log(p1.VP)

        var cardTop = offset * i + offset * .35;

        let cardPath = new Path2D();

        //resource cards
        p_ctx.beginPath();
        cardPath.rect(120, cardTop, 25, 40);
        p_ctx.closePath();
        p_ctx.strokeStyle = "black"
        p_ctx.stroke(cardPath);
        p_ctx.fillStyle = "lightgrey"
        p_ctx.fill(cardPath);

        p_ctx.fillStyle = "black"
        p_ctx.fillText("R", 132.5, cardTop + 25)

        p_ctx.fillStyle = "black"
        p_ctx.fillText(playersArr[i].totalResources(), 132.5, cardTop + 60)
        

        let devPath = new Path2D();

        //dev cards
        p_ctx.beginPath();
        devPath.rect(160, cardTop, 25, 40);
        p_ctx.closePath();
        p_ctx.strokeStyle = "black"
        p_ctx.stroke(devPath);
        p_ctx.fillStyle = "lightgrey"
        p_ctx.fill(devPath);

        p_ctx.fillStyle = "black"
        p_ctx.fillText("D", 172.5, cardTop + 25)

        p_ctx.fillStyle = "black"
        p_ctx.fillText(playersArr[i].devCards.length, 172.5, cardTop + 60)



        p_ctx.font = "15px Arial";
        p_ctx.textAlign = "right";

        //road length
        p_ctx.fillText("Longest Road: " + playersArr[i].longestRoad, p_canvas.width - 150, offset * i + offset * 1/3)

        //army size
        p_ctx.fillText("Army Size: " + playersArr[i].knightsPlayed, p_canvas.width - 150, offset * i + offset * 2/3)


        //roads
        p_ctx.fillText("Roads: " + playersArr[i].roadsRemaining, p_canvas.width - 10, offset * i + offset * 1/4)

        //settlements
        p_ctx.fillText("Settlements: " + playersArr[i].settlementsRemaining, p_canvas.width - 10, offset * i + offset * 2/4)

        //cities
        p_ctx.fillText("Cities: " + playersArr[i].citiesRemaining, p_canvas.width - 10, offset * i + offset * 3/4)
    }


}