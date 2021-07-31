// stores data for real time analysis

d_State = {
    //contains values and frequency of dice rolls
    dice_results_arr: [],
}

//sums up dot values for each resource by checking all tiles
function calcProduction(){
    for(var i = 0; i < tilesArr.length; i++){
        for(var j = 0; j < tilesArr[i].length; j++){

            if(tilesArr[i][j].resourceCard === "wood"){
                productionCapacity[0] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "brick"){
                productionCapacity[1] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "sheep"){
                productionCapacity[2] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "wheat"){
                productionCapacity[3] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }else if(tilesArr[i][j].resourceCard === "ore"){
                productionCapacity[4] += (6 - Math.abs(7 - tilesArr[i][j].number))
            }
        }
    }
}