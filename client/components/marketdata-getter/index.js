import * as d3Request from 'd3-request';

module.exports = function(key) {
  if (!key) console.error('no source ID specified');

  const data = {};

  var callback = function(d){ console.log('DATA', d) };
  var error = function(e){ console.log('ERROR', e) };

  function getter(symbol, metrics){
    if(metrics === undefined) metrics = false;
    const hashkey = symbol + String(metrics);

    if( data[hashkey] !== undefined){
      callback( data[key] );
    }else{
      var URL = 'https://markets.ft.com/research/webservices/securities/v1/quotes?symbols=' + symbol + '&source=' + key;
      if(metrics){
        URL = 'https://markets.ft.com/research/webservices/securities/v1/performance-metrics?symbols=' + symbol + '&source=' + key;
      }

      d3Request.json(URL, function(err, jsonData){
          if (err !== null){
            error(err);
            return;
          }
          data[hashkey] = jsonData;
          callback(data[hashkey]);
        })
    }
  }

  getter.data = function(){
    return data;
  }

  getter.callback = function(f){
    callback = f;
    return getter;
  }

  getter.error = function(f){
    error = f;
    return getter;
  }

  return getter;
};
