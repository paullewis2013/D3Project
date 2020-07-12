//Paul Lewis
//Started in July, 2020

//--------------------------------------------------
//instance fields
//--------------------------------------------------

//an array to store value and frequency of dice rolls
var dice_results_arr = [];

//array to store dev cards left in deck
var devCardArray = [];

//object to track number of each dev card which haven't been played
var unplayedDevCards = {knight: 14, vp: 5, monopoly: 2, road: 2, plenty: 2};
var playedDevCards = {knight: 0, vp: 0, monopoly: 0, road: 0, plenty: 0}

//array to store resource cards in bank
var bank = [];

var resultsShown = false
var turnNumber = 0

//defines enum for a dev card
const devCard = {
    KNIGHT: 'knight',
    VP: 'victory point',
    MONOPOLY: 'monopoly',
    ROAD: 'road building',
    PLENTY: 'year of plenty'
}

//defines enum for resource card
const resourceCard = {
    WOOD: 'wood',
    BRICK: 'brick',
    SHEEP: 'sheep',
    WHEAT: 'wheat',
    ORE: 'ore'
}

//--------------------------------------------------
//end of instance fields
//--------------------------------------------------



//important!
setup()

//sets all game conditions initally
function setup(){
    populateDevCardDeck()
    populateDiceArr()
}

//populate dev card array and unplayed dev card array then shuffle the dev card array 
// being used as deck
function populateDevCardDeck(){
    for(var i = 0; i < 14; i++){
        devCardArray.push(devCard.KNIGHT);
    }
    for(var i = 0; i < 5; i++){
        devCardArray.push(devCard.VP);
    }
    for(var i = 0; i < 2; i++){
        devCardArray.push(devCard.MONOPOLY);
    }
    for(var i = 0; i < 2; i++){
        devCardArray.push(devCard.ROAD);
    }
    for(var i = 0; i < 2; i++){
        devCardArray.push(devCard.PLENTY);
    }
    devCardArray = _.shuffle(devCardArray)
}

//fill dice array with 0s
function populateDiceArr(){
    for(var i = 0; i<11; i++){
        dice_results_arr.push({
            value: i+2,
            frequency: 0
        })
    }
}



//--------------------------------------------------
//functions for game events
//--------------------------------------------------

//generates a dice roll between 1 and 12 by summing two d6
function rollDice(){
    var result = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);

    dice_results_arr[result - 2].frequency += 1;

    return result;
}


function drawDevCard(){
    if(devCardArray.length > 0){
        var card = devCardArray.pop();
        document.getElementById("lastDevCard").innerHTML = "Last Dev card drawn: " + card
        document.getElementById("devCardsRemaining").innerHTML = "Dev Cards Remaining: : " + devCardArray.length
        //console.log(card)


        //need to remove this line later because these dev cards are not actually being played yet
        playDevCard(card)
    }else{
        console.log("deck empty")
    }
    
}

function playDevCard(card){
    
    //update unplayed dev cards tracker
    switch(card){
        case devCard.KNIGHT:
            unplayedDevCards.knight -= 1;
            playedDevCards.knight += 1;
            break;
        case devCard.VP:
            unplayedDevCards.vp -= 1;
            playedDevCards.vp += 1;
            break;
        case devCard.MONOPOLY:
            unplayedDevCards.monopoly -= 1;
            playedDevCards.monopoly += 1;
            break;
        case devCard.ROAD:
            unplayedDevCards.road -= 1;
            playedDevCards.road += 1;
            break;
        case devCard.PLENTY:
            unplayedDevCards.plenty -= 1;
            playedDevCards.plenty += 1;
            break;
        default:
            break;
    }
}

//--------------------------------------------------
//end of functions for game events
//--------------------------------------------------





//--------------------------------------------------
//Button controls
//--------------------------------------------------


//called when dice button is clicked
function diceButton(){
    document.getElementById("rollResult").innerHTML = "Roll Result: " + rollDice();
    //console.log(dice_results_arr);
    
    //updates dice results if they are visible
    graphicButton()

    turnNumber++;
    document.getElementById("turnNumber").innerHTML = "Turn number: " + turnNumber;
}

//event called when dev card button is clicked
function devButton(){
    drawDevCard()

    //updates graphics if necesary
    graphicButton()
}

//eventually move this and other button functions to a seperate js file
function graphicButton(){

    var graphic = document.getElementById("displayOptions").value
    //console.log(graphic)

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

        default:
            break;
    }

    // if(document.getElementById("resultsButton").innerHTML === "Show Results"){
        
    //     //make graph visible
    //     d3.select('svg')
    //         .attr("visibility", "visible");   

    //     drawDiceResults()
    //     document.getElementById("resultsButton").innerHTML = "Hide Results"
    //     resultsShown = true
    // }else{

    //     //hide graph
    //     d3.select('svg')
    //         .attr("visibility", "hidden");

    //     document.getElementById("resultsButton").innerHTML = "Show Results"
    // }
    
}

//--------------------------------------------------
//End of button controls
//--------------------------------------------------




//--------------------------------------------------
//Draw functions
//--------------------------------------------------

function clearDisplay(){
    d3.selectAll("svg > *").remove();
}


//use svg to show chart of dice roll distribution
function drawDiceResults() {

    //this line is so helpful jesus christ i spent like 3 hours figuring it out
    d3.selectAll("svg > *").remove(); 

    const margin = 50
    const width = 600 - 2 * margin;
    const height = 400 - 2 * margin;
    
    const svg = d3.select('svg')
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dice_results_arr, function(o) {return o.frequency}) + 3])
        .range([height, 0])

    chart.append("g")
        .call(d3.axisLeft(yScale))

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(dice_results_arr.map((s) => s.value))
        .padding(0.2)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
        

    //horizontal lines
    chart.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft()
            .scale(yScale)
            .tickSize(-width, 0, 0)
            .tickFormat(''))


    chart.selectAll("rect")
        .data(dice_results_arr)
        .enter()
        .append("rect")
        .attr('x', (s) => xScale(s.value))
        .attr('y', (s) => yScale(s.frequency))
        .attr('height', (s) => height - yScale(s.frequency))
        .attr('width', xScale.bandwidth())
        .attr("fill", "#a05d56")
        .style("opacity", 0.9)
        .exit()

    svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Frequency')
    
    //title
    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('Dice Roll Distribution')
    
}



function drawUnplayedDevCards(){

    var data = unplayedDevCards

    d3.selectAll("svg > *").remove();

     // set the dimensions and margins of the graph
     const margin = 50
     const width = 600;
     const height = 400;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(["knight", "vp", "monopoly", "road", "plenty"])
        .range(d3.schemeTableau10);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) {return d.value; })
    
    var data_ready = pie(d3.entries(data))

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
                if(d.value === 0){
                    return
                }
                var posA = arc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })

    // Add the polylines between chart and labels:
    svg
        .selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
            .text( function(d) {if(d.value != 0) return d.data.key + " (" + (d.value / (devCardArray.length) * 100).toFixed(2) + "%)" } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
}

//no reason to do this one until I implement a way to play a dev card
function drawPlayedDevCards(){

    var data = playedDevCards

    d3.selectAll("svg > *").remove();

     // set the dimensions and margins of the graph
     const margin = 50
     const width = 600;
     const height = 400;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // // Create dummy data
    // var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(["knight", "vp", "monopoly", "road", "plenty"])
        .range(d3.schemeTableau10);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) {return d.value; })
    
    var data_ready = pie(d3.entries(data))

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
                if(d.value === 0){
                    return
                }
                var posA = arc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })

    // Add the polylines between chart and labels:
    svg
        .selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
            .text( function(d) { if(d.value != 0) return d.data.key + " (" + d.value + ")"})
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    
}
