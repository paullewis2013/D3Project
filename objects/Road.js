//define road object
function Road(player, hitbox){
    this.player = player;
    this.hitbox = hitbox;
    this.adjRoads = [];
    this.adjVerts = [];
    this.i;
    this.j;
}
//pass the road a vertex and if the vertex is adjacent return the opposite adjacent vertex
Road.prototype.getOppositeVert = function(v){

    if(this.adjVerts.includes(v)){

        //console.log("opposite vert included")

        if(this.adjVerts[0] === v){
            return this.adjVerts[1]
        }else{
            return this.adjVerts[0]
        }
    }

    //if the vertex wasn't adjacent return null
    return null;
}