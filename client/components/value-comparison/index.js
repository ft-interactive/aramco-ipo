const d3 = require('d3');
const config = require('../calculator/config');

function layoutCircles(data,rScale, maxWidth){
  const radii = data.map(d=>({
    data:d,
    r:rScale(d.value)
  }));

  var totalCircleWidth = d3.sum(radii,d=>d.r) * 2;
  var circleSpacing = (maxWidth - totalCircleWidth)/data.length-1;
  let totalX = 0;
  const positions = radii.map((d,i)=>{
    const value = {
      cx:totalX + d.r + (i * circleSpacing),
      r:d.r,
      data:d,
    }
    totalX = value.cx + d.r;
    return value;
  });

  console.log(positions);
  return positions;
}

function valueComparison(){
    let valueToCompare = 0;
    const context = [];

    function draw(parent){
        let values = [ valueToCompare, ...context ]
        let h = 250;
        let containerWidth = document.querySelector('.value-visualisation').getBoundingClientRect().width;
        let w = (containerWidth < 660) ? (containerWidth - 15) : 660;
        let optimisticMarketCap = config.optimisticMarketCap;

        let padding = 5;

        var t = d3.transition()
                .duration(500)

        //ensure that market cap value sets the *area* of the circle
        var rScale = d3.scalePow().exponent(0.5)
                        .domain([0, optimisticMarketCap ])
                        .range([0, (w/6)]);

        var layout = layoutCircles(values, rScale, (w - padding * 2));

        let optimisticDataset = [{
          data:{
            'value': optimisticMarketCap
          },
          cx:layout[0].cx,
          r:rScale(optimisticMarketCap)
        }];

        console.log(optimisticDataset,layout);

        const yPosition = h/2;
        const yNamePosition = h - padding;

        parent.attr("viewbox", "0 0 " + w + " " + h)
                .attr("height", h)
                .attr("width", w);

        //set company values as circles
        parent.selectAll("circle")
            .data(layout, d => d.data.name )
            .enter()
            .append("circle")
            .classed("value-visualisation__marketcap", true)
            .classed("value-visualisation__main-marketcap", d => d.name === 'aramco')
            .attr("cx", d=>d.cx)
            .attr("cy", yPosition);

        parent.selectAll(".value-visualisation__marketcap").transition(t)
            .attr("r", d=>d.r);

        parent.selectAll(".value-visualisation__marketcap").transition(t)
            .attr("cx", d => d.cx)
            .attr("cy", yPosition);

        //set optimistic company valuation as dotted circle
        parent.selectAll(".value-visualisation__main-optimistic-marketcap")
            .data(optimisticDataset)
            .enter()
            .append("circle")
            .classed("value-visualisation__main-optimistic-marketcap", true)
            .attr("cx", d=>d.cx)
            .attr("cy", yPosition);

        parent.selectAll(".value-visualisation__main-optimistic-marketcap")
            .attr("cx", d=>d.x)
            .attr("cy", d=>yPosition)
            .attr("r", d=>d.r)

        //add value labels
        parent.selectAll(".value-visualisation__amountLabel")
            .data(values, d => d.data.name )
            .enter()
            .append("text")
            .classed("value-visualisation__amountLabel", true)
            .classed("value-visualisation__main-amountLabel", d => d.name === 'aramco')
            .attr("x", d=>d.cx)
            .attr("y", yPosition);

        parent.selectAll(".value-visualisation__amountLabel").transition(t)
            .text(d => (Math.round(d.data.value / 1000000000)))
            .attr("x", d => d.x)
            .attr("y", yPosition)

        //add name labels
        parent.selectAll(".value-visualisation__nameLabel")
            .data(values, d => d.data.name )
            .enter()
            .append("text")
            .classed("value-visualisation__nameLabel", true)
            .classed("value-visualisation__main-nameLabel", d => d.name === 'aramco')
            .attr("x", d=>d.cx)
            .attr("y", yPosition);


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
