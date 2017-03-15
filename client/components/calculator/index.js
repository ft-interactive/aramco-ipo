const config = require('./config');
const d3 = require('d3');

function calculator(){
	const state = config;
	let currentYear;
	const dispatch = d3.dispatch('change');

	function calculate(){
		// for(let i in state.years){
		// 	let currentYear = state.years[i];
		// 	let oilPrice = state.longTermOilPrice;
		// 	if(currentYear.year < 2019) oilPrice = state.oilPriceAverage;
		// 	currentYear.sales = 365 * oilPrice * currentYear.oilProduction;

		// 	if(i === 0){
		// 		var lastYearSales = state.sales2016;
		// 	} else {
		// 		lastYearSales = state.years[i - 1].sales;
		// 	} 	
		// 	currentYear.salesGrowth = (currentYear.sales / lastYearSales) - 1;

		// 	currentYear.ebitda = currentYear.ebitdaMargins * currentYear.sales;

		// 	console.log(currentYear);
		// }

		dispatch.call('change', { marketValue: 1000000000000 });
	}

	calculate.state = function(o) {
		Object.assign(state, o);
	}

	calculate.dispatch = function(){
		return dispatch;
	}

	return calculate;
};

module.exports = calculator;