// GRABBED FROM GITHUB: https://github.com/cwilso/metronome
// PROPS TO Chris Wilson: https://github.com/cwilso

var timerID=null;
var interval=100;

self.onmessage=function(e){
	if (e.data==0) {
		timerID=setInterval(function(){postMessage(2);},interval)
	}
	else if (e.data.interval) {
		interval=e.data.interval;
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage(2);},interval)
		}
	}
	else if (e.data==1) {
		clearInterval(timerID);
		timerID=null;
	}
};