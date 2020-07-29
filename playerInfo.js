// this file controls a different canvas for drawing player info

var p_canvas = document.getElementById("playerInfo");
p_canvas.width = document.getElementById("playerDiv").clientWidth;
p_canvas.heigth = document.getElementById("playerDiv").clientHeight;

p_ctx = p_canvas.getContext("2d");


//important note everything coordinate wise is off by 15 for some reason
//the visible point that should be the origin is actually at (15,15)

//this is the only thing this entire file does
function drawPlayerInfo(){

    p_ctx.textAlign = "center"
    p_ctx.font = "20px Arial";

    p_ctx.rect(0, 0, p_canvas.width, 130);
    p_ctx.fillStyle = "floralwhite"
    p_ctx.fill()

    p_ctx.beginPath();
    p_ctx.arc(50, 45, 20, 0, 2 * Math.PI, false);
    p_ctx.closePath();
    p_ctx.fillStyle = p1.color;
    p_ctx.fill()

    p_ctx.fillStyle = "black"
    p_ctx.fillText("VP: " + p1.VP, 50, 110)
    //console.log(p1.VP)

    //resource cards
    p_ctx.beginPath();
    p_ctx.rect(120, 30, 25, 40);
    p_ctx.closePath();
    p_ctx.strokeStyle = "black"
    p_ctx.stroke();
    p_ctx.fillStyle = "lightgrey"
    p_ctx.fill();

    p_ctx.fillStyle = "black"
    p_ctx.fillText("R", 132.5, 60)

    p_ctx.fillStyle = "black"
    p_ctx.fillText(p1.totalResources(), 132.5, 100)

    //dev cards
    p_ctx.beginPath();
    p_ctx.rect(160, 30, 25, 40);
    p_ctx.closePath();
    p_ctx.strokeStyle = "black"
    p_ctx.stroke();
    p_ctx.fillStyle = "lightgrey"
    p_ctx.fill();

    p_ctx.fillStyle = "black"
    p_ctx.fillText("D", 172.5, 60)

    p_ctx.fillStyle = "black"
    p_ctx.fillText(p1.devCards.length, 172.5, 100)




    p_ctx.font = "15px Arial";
    p_ctx.textAlign = "right";

    //road length
    p_ctx.fillText("Longest Road: " + p1.longestRoad, p_canvas.width - 150, 30)

    //army size
    p_ctx.fillText("Army Size: " + p1.knightsPlayed, p_canvas.width - 150, 70)


    //roads
    p_ctx.fillText("Roads: " + p1.roadsRemaining, p_canvas.width - 10, 30)

    //settlements
    p_ctx.fillText("Settlements: " + p1.settlementsRemaining, p_canvas.width - 10, 70)

    //cities
    p_ctx.fillText("Cities: " + p1.citiesRemaining, p_canvas.width - 10, 110)


    



}