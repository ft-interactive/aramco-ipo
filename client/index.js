/*
  TODO: delete this comment

  This file is where you bootstrap your JS code
  For example import stuff here:

  import {select} from 'd3-selection';
  import myComponent from './components/my-component';

  Split logical parts of you project into components e.g.

  /client
    - /components
        - /component-name
            - styles.scss
            - index.js
            - template.html

*/
import * as d3 from 'd3';
import calculator from './components/calculator/index';
import valueComparison from './components/value-comparison/index';

//set up the visualisation drawer
const valueVisualisation = valueComparison()
  .addContext({name:'exxon', value:1000000})
  .addContext({name:'apple', value:1000000000})
  .addValue({name:'aramco', value:0});
  
const valueVisContainer = d3.select('.value-visualisation');

//create the calculator
const myCalc = calculator();

d3.selectAll('.scenario-button')
  .on('click',function(){
    console.log('clicked', this.dataset);
    myCalc.state(this.dataset);
  });

//Set up a listener on the calculator so that when it changed we can update the page
myCalc.dispatch()
  .on('change', function(){
    const event = this;
    console.log('changed');
    valueVisualisation.addValue({
      name:'aramco',
      value:event.marketValue,
    });
    valueVisContainer
      .call(valueVisualisation);
  });

//draw the visualisation
valueVisContainer
  .call(valueVisualisation);

//run the initial calculation
myCalc();