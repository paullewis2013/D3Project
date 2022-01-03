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
//player is to set a specific player deadroads is to track visited roads
//works recursively
Vertex.prototype.getLongestPath = function (player, deadRoads){

    let newRoads = [];

    //finds all unexplored roads 
    for(let i = 0; i < this.adjRoads.length; i++){

        if(this.adjRoads[i].player === player && !deadRoads.includes(this.adjRoads[i])){
            newRoads.push(this.adjRoads[i])
        }
    }
    
    //base case is no adj roads of given color that aren't in deadRoads list
    if(newRoads.length === 0){
        return 0;
    }
    //for each unexplored road call the method again recursively on the vertex at the other end of the road
    else{

        //track results of each recursive call
        let scores = [];

        for(let i = 0; i < newRoads.length; i++){

            //create a new dead roads list for next recursive call
            let updatedDeadRoads = [];
            for(let j = 0; j < deadRoads.length; j++){
                updatedDeadRoads.push(deadRoads[j])
            }

            //add current road
            updatedDeadRoads.push(newRoads[i]);

            //get the next vertex for recursive call
            nextVert = newRoads[i].getOppositeVert(this);

            scores.push(1 + nextVert.getLongestPath(player, updatedDeadRoads))
        }

        let max = 0;

        for(let i = 0; i < scores.length; i++){
            max = (scores[i] > max) ? scores[i] : max;
        }

        //take the maximum value returned from of any of the recursive calls
        return max;
    }
}