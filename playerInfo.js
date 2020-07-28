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
    p_ctx.arc(50, 45, 25, 0, 2 * Math.PI, false);
    p_ctx.closePath();
    p_ctx.fillStyle = p1.color;
    p_ctx.fill()

    p_ctx.fillStyle = "black"
    p_ctx.fillText("VP: " + p1.VP, 50, 110)
    //console.log(p1.VP)




}