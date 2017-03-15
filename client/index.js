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

const valueVisualisation = valueComparison()
  .addContext({name:'exxon', value:1000000})
  .addContext({name:'apple', value:1000000000})
  .addValue({name:'aramco', value:0});
const valueVisContainer = d3.select('.value-visualisation');

const myCalc = calculator();

myCalc.state({
  longTermOilprice:15.5, 
  otherthing:"hello"
});

myCalc.dispatch()
  .on('change', function(){
    const event = this;
    valueVisualisation.addValue({
      name:'aramco',
      value:event.marketValue,
    });
    valueVisContainer
      .call(valueVisualisation);
  });


valueVisContainer
  .call(valueVisualisation);

myCalc();