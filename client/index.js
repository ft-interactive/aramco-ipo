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

import calculator from './components/calculator/index';

var myCalc = calculator();

myCalc.state({
  longTermOilprice:15.5, 
  otherthing:"hello"
});

myCalc();