const config = require('./config');
const d3 = require('d3');
const npv = require('./npv');


function calculator(){
	const state = config;
	const dispatch = d3.dispatch('change');

	function calculate(){


		for(let i in state.years){
			let currentYear = state.years[i];

			console.log("in the calculator current year oil price " + currentYear.oilPrice);

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
			let taxRate = state.taxRate ? state.taxRate : 0.5;
			currentYear.taxAmount = taxRate * (currentYear.preTax + currentYear.depAmort);

			//net profit
			currentYear.netProfit = currentYear.preTax - currentYear.taxAmount;

			//operating cash flow
			currentYear.opCashFlow = currentYear.netProfit + currentYear.depAmort;

			//capital expenditures
			currentYear.capEx = state.capexPerBarrel * currentYear.oilProduction * 365;

			//free cash flow
			currentYear.freeCashFlow = currentYear.opCashFlow - currentYear.capEx;

		}

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
		console.log("calculated market cap " + calculatedMarketCap);

		//assign calculated marketcap to visualisation
		let marketCap = state.marketcap ? parseInt(state.marketcap) : calculatedMarketCap;

		dispatch.call('change', { marketCap: marketCap });
	}

	calculate.state = function(o) {
		for(let i in state.years){
			if(state.years[i].year == o.year){ 
				console.log("year oil price " + o.oilPrice);
				state.years[i].oilPrice = o.oilPrice; 
			}
		}
	
		calculate();
	}

	calculate.dispatch = function(){
		return dispatch;
	}

	return calculate;
};

module.exports = calculator;