const d3 = require('d3');
const config = require('../calculator/config');

function valueComparison(){
    let valueToCompare = 0;
    const context = [];

    function draw(parent){
        let values = [ valueToCompare, ...context ]

        let h = 250;
        let containerWidth = document.querySelector('.value-visualisation').getBoundingClientRect().width;
        let w = (containerWidth < 660) ? (containerWidth - 15) : 660;
        let maxPossibleValue = config.maxPossibleMarketCap
        let maxPossibleDataset = [{"value": maxPossibleValue}];
        let padding = 5;

        var t = d3.transition()
                .duration(1000);

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
                    return (w/6 * i) + (padding * i) + rScale(d.value);
                } 
                return previousWidths + (padding * i) + rScale(d.value); 
            }
        }

        var yPositioning = function(){
            return h/2;
        }
        var yNamePositioning = function(){
            return h - padding;
        }
        
        parent.attr("viewbox", "0 0 " + w + " " + h)
                .attr("height", h)
                .attr("width", w);

        //set company values as circles       
        parent.selectAll("circle")
            .data(values, d => d.name )
            .enter()
            .append("circle")
            .classed("value-visualisation__marketcap", true)
            .classed("value-visualisation__main-marketcap", d => d.name === 'aramco')
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning())

        parent.selectAll(".value-visualisation__marketcap").transition(t)
            .attr("r", d => rScale(d.value))

        parent.selectAll(".value-visualisation__marketcap").transition(t)
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning())

        //set optimistic company valuation as dotted circle      
        parent.selectAll(".value-visualisation__main-optimistic-marketcap")
            .data(maxPossibleDataset)
            .enter()
            .append("circle")
            .classed("value-visualisation__main-optimistic-marketcap", true)
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning());

        parent.selectAll(".value-visualisation__main-optimistic-marketcap")
            .attr("cx", (d,i) => xPositioning(d, i))
            .attr("cy", d => yPositioning())
            .attr("r", d => rScale(d.value))

        //add value labels     
        parent.selectAll(".value-visualisation__amountLabel")
            .data(values, d => d.name ) 
            .enter()
            .append("text")
            .classed("value-visualisation__amountLabel", true)
            .classed("value-visualisation__main-amountLabel", d => d.name === 'aramco')
            .attr("x", (d,i) => xPositioning(d, i))
            .attr("y", () => yPositioning());

        parent.selectAll(".value-visualisation__amountLabel").transition(t)       
            .text(d => (Math.round(d.value / 1000000000)))
            .attr("x", (d,i) => xPositioning(d, i))
            .attr("y", () => yPositioning() + 9)

        //add name labels
        parent.selectAll(".value-visualisation__nameLabel")
            .data(values, d => d.name )
            .enter()
            .append("text")
            .classed("value-visualisation__nameLabel", true)
            .classed("value-visualisation__main-nameLabel", d => d.name === 'aramco')
            .attr("x", (d,i) => xPositioning(d,i)) 
            .attr("y", () => yNamePositioning());


        parent.selectAll(".value-visualisation__nameLabel").transition(t)
            .text(d => { return d.name} )
            .attr("x", (d,i) => xPositioning(d,i)) 
            .attr("y", () => yNamePositioning())
            .style("text-anchor", "middle")

        //if circle engulfs label, make label white 
        parent.selectAll('.value-visualisation__nameLabel')
            .classed("value-visualisation__nameLabelWhite", d => (rScale(d.value) * 2) > (h - (padding*2)));

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
