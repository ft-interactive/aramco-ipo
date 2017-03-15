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
import userInput from './components/user-inputs/index';
import NPV from './components/calculator/npv';

//set up the visualisation drawer
const valueVisualisation = valueComparison()
  .addContext({name:'apple', value:600000000000})
  .addContext({name:'exxon', value:300000000000})
  .addValue({name:'aramco', value:0});
  
const valueVisContainer = d3.select('.value-visualisation svg');

//create the calculator
const myCalc = calculator();
var oilPriceBox = document.getElementById('selected-oil-price');

d3.selectAll('.scenario-button')
  .on('click',function(){
    myCalc.state(this.dataset);
  });

//Set up a listener on the calculator so that when it changed we can update the page
myCalc.dispatch()
  .on('change', function(){
    const event = this;
    console.log('changed');
    valueVisualisation.addValue({
      name:'aramco',
      value: event.marketCap,
    });
    valueVisContainer
      .call(valueVisualisation);
  });

//Add eventlistener to on the oil price slider 
d3.selectAll('#oil-price-slider')
  .on('mousemove', function(){
      oilPriceBox.textContent = this.value;
      myCalc.state({oilPrice: parseInt(this.value)});
  });  


//draw the visualisation
valueVisContainer
  .call(valueVisualisation);

//run the initial calculation
myCalc();