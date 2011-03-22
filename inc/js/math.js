//********************************
// general mathematical functions
//********************************

function roundFloat(value, n) {
	if(typeof(n)=="undefined") {
		n = 2;
	}
	var a = Math.pow(10, n);
	var num = Math.round(value * a)/a;
	return num;
}
function px2int(str) {
	var pos = str.indexOf('px');
	var num = parseInt(str.substring(0, pos));
	return num;
}