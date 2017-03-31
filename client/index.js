
import * as d3 from 'd3';
import config from './components/calculator/config';
import calculator from './components/calculator/index';
import valueComparison from './components/value-comparison/index';
import NPV from './components/calculator/npv';
import MovableChart from './components/movable-chart';
import gaEventTracking from './components/core/ga-custom-tracking';
import flags from '../config/flags.js';

//set up the visualisation drawer
const valueVisualisation = valueComparison()
  .addValue({name:'aramco', value:0});

const marketData = require('marketdata-getter');
const market = marketData.marketdata('5d32d7c412')
  .callback((response)=>{
    let appleValue = 0;
    let alphabetValue = 0;
    
    response.data.items.forEach((d,i)=>{
      if (d.symbolInput === 'aapl') {
        appleValue += Number(d.pricePerformance.marketCap);
      }
      else if (d.symbolInput === 'goog' || d.symbolInput === 'googl') {
        alphabetValue += Number(d.pricePerformance.marketCap);
      }
      else throw new Error(`Unexpected ticker symbol in results: ${d.symbolInput}`);
    });
    
    valueVisualisation.addContext({
      name: 'Apple',
      value: appleValue,
    });

    valueVisualisation.addContext({
      name: 'Alphabet',
      value: alphabetValue,
    });

    valueVisContainer.call(valueVisualisation);

    const dataTime = d3.timeFormat('%B %e %Y')
      (d3.isoParse(response.timeGenerated));

    d3.select('.value-visualisation footer')
      .text('* Apple and Alphabet valuation based on market cap data as of ' + dataTime);
});

let chartContainerWidth = document.querySelector('.controls-oil').getBoundingClientRect().width;
const componentWidth = (chartContainerWidth < 660) ? (chartContainerWidth - 15) : 660;
const numberYearsConfigurable = 3;

//DOM elements
const valueVisContainer = d3.select('.value-visualisation svg');
const controlsOil = document.querySelector('.controls-oil');
const controlsTax = document.querySelector('.controls-tax');
const oilProdButtons = document.querySelectorAll('.oilprod-button');
const scenarioButtons = document.querySelectorAll('.scenario-button');

//get the market data
market('aapl,goog,googl', true);

//create the calculator
const myCalc = calculator();

//Set up listener on the scenario buttons
d3.selectAll('.scenario-button')
  .on('click',function(){
    myCalc.updateState(this.dataset);
    if(flags.googleAnalytics === true) gaEventTracking('ScenarioButtons', 'valueChange', 'IPO Calculator');
  });

//For moveable charts reconfigure properties so they can be read
var reformatData = function(allYears, property){
  let reformattedData = [];
  for(let inputYear in allYears){
    let x = {
      label: allYears[inputYear].year,
    }
    if(property === 'oilPrice'){ x.value = allYears[inputYear].oilPrice }
    else if(property === 'taxRate'){ x.value = allYears[inputYear].taxRate * 100 }

    reformattedData.push(x);
  }
   return compressDataForView(reformattedData);
}

var compressDataForView = function(data){
  let shortenedYearList = generateYearList();
  let shortenedData = [];

  shortenedYearList.map(( year, i) =>{
      if(year == data[i].label){
        shortenedData.push(data[i]);
      }
      else if(year === 'onwards'){
        data[i].label = 'onwards';
        shortenedData.push(data[i]);
      }
    }
  );
  return shortenedData.slice(0,( numberYearsConfigurable +1) );
};

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

var highlightSelected = function(chosenOilProd, buttons){
  for(let i =0; i < buttons.length; i++){
      if(chosenOilProd == buttons[i].dataset.oilprod){
        buttons[i].classList.add('o-buttons--standout');
      }
      else {
        buttons[i].classList.remove('o-buttons--standout');
      }
  }
};

var highlightSelectedScenario = function(scenario, buttons){
  for(let i=0; i<buttons.length; i++){
    if(scenario == buttons[i].dataset.scenario){
        buttons[i].classList.add('o-buttons--standout');
      }
      else {
        buttons[i].classList.remove('o-buttons--standout');
      }
  }
};

//Create and render moveable chart for oil prices
const oilPriceChart = new MovableChart({
    name: 'oilPrice',
    width: componentWidth,
    height: 220,
    min: 20,
    max: 100,
  });

oilPriceChart.setYears(reformatData(config.years, 'oilPrice')).init();
controlsOil.appendChild(oilPriceChart.elements.container);

 //Add event dispatcher on data change in oil price chart
 oilPriceChart.on('update', (payload) => {
    let yearlist = generateYearList();

    myCalc.updateState({
      year: payload.year,
      oilPrice: payload.value
    });
    if(flags.googleAnalytics === true) gaEventTracking('MovableChart', 'valueChange', 'IPO Calculator');
  })

 //Set up listener on oil production buttons
for(let i =0; i < oilProdButtons.length; i++){
  oilProdButtons[i].addEventListener(
    "click",
    function(){
      myCalc.updateState(this.dataset);
      if(flags.googleAnalytics === true) gaEventTracking('Variable2Buttons', 'valueChange', 'IPO Calculator');
     }
  )
};

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

    //update oil price chart
    oilPriceChart.setYears(reformatData(event.years, 'oilPrice')).update();

    //update tax rate buttons
    highlightSelected(event.years[0].oilProduction, oilProdButtons);

    //update scenario buttons
    highlightSelectedScenario(event.scenario, scenarioButtons);
  });


//draw the visualisation
valueVisContainer
  .call(valueVisualisation);

//run the initial calculation
myCalc.calculate();
