const config = require('./config');
const d3 = require('d3');
const npv = require('./npv');


function calculator(){
	const state = config;
	const dispatch = d3.dispatch('change');

	const calculate = function (){

		for(let i in state.years){
			let currentYear = state.years[i];

			//dynamically set oil price 
			let oilPrice = currentYear.oilPrice;


			//sales
			currentYear.sales = 365 * oilPrice * currentYear.oilProduction;

			//operating expenditure
			currentYear.opEx = currentYear.oilProduction * 365 * state.opexPerBarrel; 

			//royalties
			currentYear.royalties = state.royalties * currentYear.sales;

			//depreciation and amortization
			currentYear.depAmort = state.depAmortPerBoe * currentYear.oilProduction * 365;

			//pre-tax profit
			currentYear.preTax = currentYear.sales - (currentYear.opEx + currentYear.royalties + currentYear.depAmort);

			//tax amount
			//NB removed conditional if 0 + PLUS depreciation and amort
			let taxRate = currentYear.taxRate;
			currentYear.taxAmount = taxRate * (currentYear.preTax + currentYear.depAmort);
			console.log(currentYear.year + " oilprice: " + currentYear.oilPrice + " tax rate: " + currentYear.taxRate);

			//net profit
			currentYear.netProfit = currentYear.preTax - currentYear.taxAmount;

			//operating cash flow
			currentYear.opCashFlow = currentYear.netProfit + currentYear.depAmort;

			//capital expenditures
			currentYear.capEx = state.capexPerBarrel * currentYear.oilProduction * 365;

			//free cash flow
			currentYear.freeCashFlow = currentYear.opCashFlow - currentYear.capEx;

		}

		console.log("------------------");

		//terminal value of free cash flow 
		let freeCashFlowTerminalValue = state.years[(state.years.length - 1)].freeCashFlow / (state.costOfEquity - state.terminalGrowthRate );

		//10 year Treasury yield
		let accumulatedCashFlow = [];

		for(let i in state.years){
			accumulatedCashFlow.push(state.years[i].freeCashFlow);
		}
		accumulatedCashFlow.splice(
			accumulatedCashFlow[accumulatedCashFlow.length -1], 
			1, 
			(accumulatedCashFlow[accumulatedCashFlow.length -1] + freeCashFlowTerminalValue));

		let treasuryYield = npv(state.costOfEquity, accumulatedCashFlow) / 1000;

		let treasuryYieldBillion = treasuryYield * 1000000000;

		//calculated market cap
		let calculatedMarketCap = treasuryYieldBillion + state.refiningChems;

		//assign calculated marketcap to visualisation
		let marketCap = calculatedMarketCap;

		dispatch.call('change', { marketCap: marketCap, years: state.years });
	}

	const updateState = function(o) {
		for(let i in state.years){

			if(o.oilPrice){
				if(state.years[i].year === o.year){ 
					state.years[i].oilPrice = o.oilPrice; 
				}
				else if(state.years[i].year > 2019 && o.year === 'onwards') {
					state.years[i].oilPrice = o.oilPrice; 
				}
			}
			else if(o.taxRate){
				if(state.years[i].year === o.year){ 
					state.years[i].taxRate = o.taxRate; 
				}
				else if(state.years[i].year > 2019 && o.year === 'onwards') {
					state.years[i].taxRate = o.taxRate; 
				}
			}
			else if(o.scenario){
				if(o.scenario === 'optimistic'){
					Object.assign(state.years, state.years_optimistic);
				}
				else if(o.scenario === 'pessimistic'){
					Object.assign(state.years, state.years_pessimistic);
				}
				else{
					Object.assign(state.years, state.years_neutral);
				}
			}

		}
	
		calculate();
	}

	return {
		calculate,
		updateState,
		getDispatcher: () => dispatch,
	};
};

module.exports = calculator;