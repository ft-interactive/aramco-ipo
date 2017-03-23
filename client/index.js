
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
  
let chartContainerWidth = document.querySelector('.controls-oil').getBoundingClientRect().width; 
const componentWidth = (chartContainerWidth < 660) ? (chartContainerWidth - 15) : 660; 
const numberYearsConfigurable = 3;

//DOM elements
const valueVisContainer = d3.select('.value-visualisation svg');
const controlsOil = document.querySelector('.controls-oil');
const controlsTax = document.querySelector('.controls-tax');
const taxRateButtons = document.querySelectorAll('.taxrate-button');

//create the calculator
const myCalc = calculator();

//Set up listener on the scenario buttons 
d3.selectAll('.scenario-button')
  .on('click',function(){
    myCalc.updateState(this.dataset);
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

var highlightSelected = function(chosenTaxRate, taxButtons){
  for(let i =0; i < taxButtons.length; i++){
      if(chosenTaxRate == taxButtons[i].dataset.taxrate){
        taxButtons[i].classList.add('selected');
      }
      else {
        taxButtons[i].classList.remove('selected');
      }
  }
};

//Create and render moveable chart for oil prices
const oilPriceChart = new MovableChart({
    name: 'oilPrice',
    width: componentWidth,
    height: 200,
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
  })

 //Set up listener on tax rate buttons
for(let i =0; i < taxRateButtons.length; i++){
  taxRateButtons[i].addEventListener(
    "click",
    function(){
      myCalc.updateState(this.dataset);
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

    oilPriceChart.setYears(reformatData(event.years, 'oilPrice')).update();
    highlightSelected(event.years[0].taxRate, taxRateButtons);
  });


//draw the visualisation
valueVisContainer
  .call(valueVisualisation);

//run the initial calculation
myCalc.calculate();