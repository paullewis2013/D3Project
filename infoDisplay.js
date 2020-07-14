//this is a file to store all of the functions for manipulating the svg
//display in the upper right corner

//make sure this file is loaded on the page before the board.js file

//I'm pretty sure this should just contain code for drawing d3 charts but maybe theres other things too


//removes all elements on the svg display
function clearDisplay(){
    d3.selectAll("svg > *").remove();

    const svg = d3.select('svg')
        .attr("width", svgWidth + 2 * margin)
        .attr("height", svgHeight + 2 * margin)

    //title
    svg.append('text')
        .attr('x', svgWidth / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('Select info to display below')
}


//use svg to show chart of dice roll distribution
function drawDiceResults() {

    //this line is so helpful jesus christ i spent like 3 hours figuring it out
    d3.selectAll("svg > *").remove(); 

    const margin = 50
    const width = svgWidth - 2 * margin;
    const height = svgHeight - 2 * margin;
    
    const svg = d3.select('svg')
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)

    const chart = svg.append('g')
        .attr('transform', `translate(${margin * 1.5}, ${margin})`);

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


//creates a donut chart with all the dev cards that have not been played yet
function drawUnplayedDevCards(){

    var data = unplayedDevCards

    d3.selectAll("svg > *").remove();

     // set the dimensions and margins of the graph
     const margin = 50
     const width = svgWidth;
     const height = svgHeight;

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
     const width = svgWidth;
     const height = 300;

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