  
 //custom tracking for IPO Calculator
function gaEventTracking(category, action, label){
	if (!window.ga) return;
	ga('send', {
		hitType: 'event',
		eventCategory: category,
		eventAction: action,
		eventLabel: label,
	});
}
 
module.exports = gaEventTracking;