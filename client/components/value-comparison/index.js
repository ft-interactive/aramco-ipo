const d3 = require('d3');
const config = require('../calculator/config');

function valueComparison(){
    let valueToCompare = 0;
    const context = [];

    function draw(parent){
        let values = [ valueToCompare, ...context ]

        let h = 200;
        let w = (window.screen.width < 500) ? (window.screen.width - 15) : 500
        let maxPossibleValue = config.maxPossibleMarketCap
        let maxPossibleDataset = [{"value": maxPossibleValue}];
        let rightPadding = 5;

        var t = d3.transition()
                .duration(1000);

        // var te = d3.easeElastic.period(0.4);

        //ensure that market cap value sets the *area* of the circle
        var rScale = d3.scalePow().exponent(0.5)
                        .domain([0, maxPossibleValue ])
                        .range([0, (w/6)]); 

        //allow for dynamic positioning of circles
        var xPositioning = function(d, i){
            var previousWidths;
            if(i === 0){
                return (w/3) - (w/6);
            }
            else {
                let previousValues = values.slice(0, i);
                previousWidths = previousValues.reduce(function(acc, d){ 
                    return acc + (rScale(d.value) * 2.5); 
                }, 0);
                if(previousWidths < w/6 ){
                    return (w/6 * i) + (rightPadding * i) + rScale(d.value);
                } 
                return previousWidths + (rightPadding * i) + rScale(d.value); 
            }
        }

        var yPositioning = function(){
            return h/2;
        }
        var yNamePositioning = function(){
            return h;
        }
        
        parent.attr("viewbox", "0 0 " + w + " " + h)
                .attr("height", h)
                .attr("width", w);

        //set company values as circles       
        parent.selectAll(".potentialValue")
            .data(values, d => d.name )
            .enter()
            .append("circle")
            .classed("potentialValue", true)
            .classed("main", d => d.name === 'aramco')
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning())
            .style("fill", "#26747a");

        parent.selectAll(".potentialValue").transition(t)
            .attr("r", d => rScale(d.value))


        parent.selectAll(".potentialValue").transition(t)
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning())

        //style main company differently 
        parent.selectAll(".main")
            .style("fill", "rgb(215, 112, 108)");
            

        //set max possible company value as dotted circle      
        parent.selectAll(".maxPotentialValue")
            .data(maxPossibleDataset)
            .enter()
            .append("circle")
            .classed("maxPotentialValue", true)
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning());

        parent.selectAll(".maxPotentialValue")
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning())
            .attr("r", d => rScale(d.value))
            .style("fill", "none")
            .style("stroke-dasharray", ("10,3"))
            .style("stroke", "rgb(215, 112, 108)");

        //add value labels     
        parent.selectAll(".amountLabel")
            .data(values, d => d.name ) 
            .enter()
            .append("text")
            .classed("amountLabel", true)
            .attr("x", (d,i) => xPositioning(d, i))
            .attr("y", () => yPositioning());

        parent.selectAll(".amountLabel").transition(t)       
            .text(d => "$" + (Math.round(d.value / 1000000000)) + "bn")
            .attr("x", (d,i) => xPositioning(d, i))
            .attr("y", () => yPositioning())
            .style("fill", "white")
            .style("text-anchor", "middle");

        //add name labels
        parent.selectAll(".nameLabel")
            .data(values, d => d.name )
            .enter()
            .append("text")
            .classed("nameLabel", true)
            .attr("x", (d,i) => xPositioning(d,i)) 
            .attr("y", () => yNamePositioning());

        parent.selectAll(".nameLabel").transition(t)
            .text(d => { return d.name.toUpperCase()} )
            .attr("x", (d,i) => xPositioning(d,i)) 
            .attr("y", () => yNamePositioning())
            .style("fill", "black")
            .style("text-anchor", "middle"); 
    }

    draw.addContext = function(x){
        context.push(x);
        return draw;
    }

    draw.addValue = function(x){
        valueToCompare = x;
        return draw;
    }

    return draw;
}

module.exports = valueComparison;
