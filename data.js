// stores data for real time analysis

d_State = {
    //contains values and frequency of dice rolls
    dice_results_arr: [],
    productionCapacity: [0, 0, 0, 0, 0],
}

//draws correct graphic to display
function graphicButton(){

    var graphic = document.getElementById("displayOptions").value

    switch(graphic){
        case "None":
            clearDisplay();
            break;

        case "Dice Distribution":  
            drawDiceResults();
            break;

        case "dev played":
            drawPlayedDevCards()
            break;

        case "dev unplayed":
            drawUnplayedDevCards()
            break;

        case "prod":
            drawProductionCapacity();
            break;

        default:
            break;
    }
}

//sums up dot values for each resource by checking all tiles
function calcProduction(){
    for(var i = 0; i < tilesArr.length; i++){
        for(var j = 0; j < tilesArr[i].length; j++){

            if(tilesArr[i][j].resourceCard === "wood"){
                d_State.productionCapacity[0] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "brick"){
                d_State.productionCapacity[1] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "sheep"){
                d_State.productionCapacity[2] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "wheat"){
                d_State.productionCapacity[3] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "ore"){
                d_State.productionCapacity[4] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }
        }
    }
}