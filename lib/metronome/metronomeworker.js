// GRABBED FROM GITHUB: https://github.com/cwilso/metronome
// PROPS TO Chris Wilson: https://github.com/cwilso

var timerID=null;
var interval=100;

self.onmessage=function(e){
	//console.log(e);
	if (e.data==0) {

		//console.log("starting");
		timerID=setInterval(function(){postMessage(2);},interval)
	}
	else if (e.data.interval) {
		//console.log("setting interval");
		interval=e.data.interval;
		//console.log("interval="+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage(2);},interval)
		}
	}
	else if (e.data==1) {
		//console.log("stopping");
		clearInterval(timerID);
		timerID=null;
	}
};