
import * as d3 from 'd3';
import config from './components/calculator/config';
import calculator from './components/calculator/index';
import valueComparison from './components/value-comparison/index';
import NPV from './components/calculator/npv';
import MovableChart from './components/movable-chart';

//set up the visualisation drawer
const valueVisualisation = valueComparison()
  .addValue({name:'aramco', value:0})
  .addContext({name:'apple', value:600000000000})
  .addContext({name:'exxon', value:300000000000});
  
const componentWidth = (window.screen.width < 500) ? (window.screen.width - 15) : 500; 
const numberYearsConfigurable = 3;

//DOM elements
const valueVisContainer = d3.select('.value-visualisation svg');
const controlsOil = document.querySelector('.controls-oil');
const controlsTax = document.querySelector('.controls-tax');

//create the calculator
const myCalc = calculator();

//Set up listener on the scenario buttons 
d3.selectAll('.scenario-button')
  .on('click',function(){
    myCalc.updateState(this.dataset);
  });

//Oil price chart set config
var oilPriceByYear = function(allYears){
  let oP = [];
  for(let inputYear in allYears){
    let x = { label: allYears[inputYear].year,
      value: allYears[inputYear].oilPrice }
      oP.push(x);          
    }
  return oP; 
} 

//Create and render moveable chart for oil prices
const oilPriceChart = new MovableChart({
    width: componentWidth,
    height: 200,
    min: 20,
    max: 100,
  });

oilPriceChart.setYears(oilPriceByYear(config.years)).init();
controlsOil.appendChild(oilPriceChart.elements.container); 

 //Add event dispatcher on data change in oil price chart
 oilPriceChart.on('update', (payload) => {
    let yearlist = generateYearList();
    
    myCalc.updateState({
      year: payload.year,
      oilPrice: payload.value
    });
  })

//Create and render moveable chart for tax rate
const taxRateChart = new MovableChart({
    width: componentWidth,
    height: 200,
    min: 20,
    max: 100,
  });
taxRateChart.setYears(oilPriceByYear(config.years)).init();
controlsTax.appendChild(taxRateChart.elements.container);

 //Add event dispatcher on data change in tax rate chart
 taxRateChart.on('update', (payload) => {
    let yearlist = generateYearList();
    myCalc.updateState({
      year: payload.year,
      taxRate: parseFloat(payload.value / 100)
    });
  })

//Set up a listener on the calculator so when it updates we can update the page
myCalc.getDispatcher()
  .on('change', function(){
    const event = this;

    valueVisualisation.addValue({
    name:'aramco',
      value: event.marketCap,
    });
    valueVisContainer
      .call(valueVisualisation);

    oilPriceChart.setYears(oilPriceByYear(event.years)).update();
    taxRateChart.setYears(event.years).update();
  });


//Generate list of years that can be configured
var generateYearList = function(){
  let yearlist = [];
  for(let i =0; i < config.years.length; i++){
    if(i < numberYearsConfigurable){
      yearlist.push(parseInt(config.years[i].year));
    } else{
      yearlist.push('onwards');
    }
  }
  return yearlist;
}

//draw the visualisation
valueVisContainer
  .call(valueVisualisation);

//run the initial calculation
myCalc.calculate();