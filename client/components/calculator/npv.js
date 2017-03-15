//net present value calculation

function NPV(rate, values){ //rate is expressed as a decimal i.e. 5% is passed as 0.05;
    if(rate === undefined) return;

    return values.reduce(function(npv, value, i){
        npv += value/Math.pow((1+rate), i+1);
        return npv;
    }, 0);
}

module.exports = NPV;

if (require.main === module) {
    //test
    function round(x, precision){
        var scale = Math.pow(10, precision);
        return Math.round(x*scale)/scale;
    }

    function roughlyEqualTo(a,b, precision = 1){
        var aboutTheSame = (round(a, precision) === round(b, precision));
        console.log(a + '~=' + b + '?', aboutTheSame)
        return aboutTheSame;
    }

    var testValue1 = NPV(0.1, [53290, 53290, 54903, 56549, 58227, 59939, 61686 + 771071]) / 1000; // should be ~669.7
    var testValue2 = NPV(0.02, [-5000, 800, 950, 1080, 1220, 1500]);
    var testValue3 = NPV(0.05, [2000, 2400, 2900, 3500, 4100]) -10000; 
    
    roughlyEqualTo(testValue1, 669.7);
    roughlyEqualTo(testValue2, 196.88);
    roughlyEqualTo(testValue3, 2678.68);
};