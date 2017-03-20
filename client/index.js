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
import MovableChart from './components/movable-chart';

//set up the visualisation drawer
const valueVisualisation = valueComparison()
  .addValue({name:'aramco', value:0})
  .addContext({name:'apple', value:600000000000})
  .addContext({name:'exxon', value:300000000000});
  
const valueVisContainer = d3.select('.value-visualisation svg');

//create the calculator
const myCalc = calculator();
var oilPriceBox = document.getElementById('selected-oil-price');
var taxRateBox = document.getElementById('selected-tax-rate');

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
  .on('change', function(){
      oilPriceBox.textContent = this.value;
      myCalc.state({oilPrice: parseInt(this.value)});
  });  


const oilPriceChart = new MovableChart({
  width: 500,
  height: 200,
  years: [
    { label: '2017', value: 20 },
    { label: '2018', value: 100 },
    { label: '2019', value: 67 },
    { label: 'onwards', value: 72 },
  ],
  min: 20,
  max: 100,
});

oilPriceChart.render();
const controlsEl = document.querySelector('.controls');
controlsEl.appendChild(oilPriceChart.el);

oilPriceChart.on('update', (payload) => {
  console.log(payload); 
})

window.oilPriceChart = oilPriceChart;

//Add eventlistenter to tax rate slider 
d3.selectAll('#tax-rate-slider')
  .on('change', function(){
      taxRateBox.textContent = parseFloat(this.value) * 100;
      myCalc.state({taxRate: parseFloat(this.value)});
  })

//draw the visualisation
valueVisContainer
  .call(valueVisualisation);

//run the initial calculation
myCalc();