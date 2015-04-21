var discSynthLocalStorage = JSON.parse(localStorage.getItem('discSynthLocalStorage'));

if (discSynthLocalStorage != null) {
    if ('active' in discSynthLocalStorage) {
        if (!discSynthLocalStorage.active){ discSynthLocalStorage = false}
    }
    else {
        discSynthLocalStorage = false;
    }
}
else {
    discSynthLocalStorage = false;
}

var visualizers = [
    {globalCompositeOperation: "",                   clearCanvas:false, functionToRun: false},
    {globalCompositeOperation: "lighter",            clearCanvas:true,  functionToRun: "visParticles"},
	{globalCompositeOperation: "lighter",            clearCanvas:false, functionToRun: "visScope"},
	{globalCompositeOperation: "lighter",            clearCanvas:true, functionToRun: "visTunnel"},
	{globalCompositeOperation: "lighter",            clearCanvas:true, functionToRun: "visMathMachine"},
	{globalCompositeOperation: "lighter",            clearCanvas:true, functionToRun: "visBurst"}

];

/*-------------------------------------------------------------------------------------------------BROWSER ID---------*/
var browserType = navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M;//.join(' ');
})();
var isChrome = browserType[0] == "Chrome";
var isFirefox = browserType[0] == "Firefox";
var isSafari = browserType[0] == "Safari";


/*-------------------------------------------------------------------------------------------------SYNTH TEMPLATES----*/


