function valueComparison(){
    let valueToCompare = 0;
    const context = [];

    function draw(parent){
        let values = [ valueToCompare, ...context ]
        parent.selectAll('p')
            .data(values, function(d){ return d.name; })
            .enter()
            .append('p');

        parent.selectAll('p')
            .text(function(d){
                return d.name +  ': ' + d.value;
            })
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