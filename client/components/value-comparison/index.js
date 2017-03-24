const d3 = require('d3');
const config = require('../calculator/config');

function layoutCircles(data,rScale, maxWidth){
  const radii = data.map(d=>({
    data:d,
    r:rScale(d.value)
  }));

  let totalCircleWidth = d3.sum(radii,d=>d.r) * 2;
  let circleSpacing = (maxWidth - totalCircleWidth)/data.length;

  const positions = radii.reduce((previous,current,i,a)=>{
    previous.pos.push({
      data: current.data,
      r: current.r,
      cx: previous.total + current.r,
    });
    return {
      total: previous.total + current.r * 2 + circleSpacing,
      pos: previous.pos,
    }
  },{total: circleSpacing/2, pos: []});

  return positions.pos;
}

function valueComparison(){
    let valueToCompare = 0;
    const context = [];

    function draw(parent){
        let values = [ valueToCompare, ...context ]
        let containerWidth = document.querySelector('.value-visualisation').getBoundingClientRect().width;
        let h = (containerWidth < 660) ? (containerWidth * 0.5) : 660;
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
            .classed("value-visualisation__main-marketcap", d => d.data.name === 'aramco')
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
            .transition(t)
            .attr("cx", d=>d.cx)
            .attr("cy", d=>yPosition)
            .attr("r", d=>d.r)

        //add value labels
        parent.selectAll(".value-visualisation__amountLabel")
            .data(layout, d => d.data.name )
            .enter()
            .append("text")
            .classed("value-visualisation__amountLabel", true)
            .classed("value-visualisation__main-amountLabel", d => d.data.name === 'aramco')
            .attr("x", d=>d.cx)
            .attr("y", yPosition+9);

        parent.selectAll(".value-visualisation__amountLabel").transition(t)
            .text(d => (Math.round(d.data.value / 1000000000)))
            .attr("x", d => d.cx)
            .attr("y", yPosition+9)

        //add name labels
        parent.selectAll(".value-visualisation__nameLabel")
            .data(layout, d => d.data.name )
            .enter()
            .append("text")
            .classed("value-visualisation__nameLabel", true)
            .classed("value-visualisation__main-nameLabel", d => d.data.name === 'aramco')
            .attr("x", d=>d.cx)
            .attr("y", yPosition);


        parent.selectAll(".value-visualisation__nameLabel").transition(t)
            .text(d => { return d.data.name} )
            .attr("x", d => d.cx)
            .attr("y", h-padding)
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
