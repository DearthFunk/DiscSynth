function getStorageInfo(discService,themeService,visualizerService) {
    return {
        active: true,
        vol: discService.node.masterGain.gain.value,
	    spd: discService.spd,
        len: discService.len,
        synthIndex: discService.synthIndex,
        themeIndex: themeService.theme.index,
        visualizerIndex: visualizerService.visualizerIndex,
        synthTemplates: deepCopy(discService.synthTemplates)
    };
}
function hexToRGBA(hex,opacity){

    //var newHex = typeof hex === 'undefined' ? "000000" :
    var newHex = hex.replace('#','');

    r = parseInt(newHex.substring(0,2), 16);
    g = parseInt(newHex.substring(2,4), 16);
    b = parseInt(newHex.substring(4,6), 16);
    return 'rgba('+r+','+g+','+b+','+opacity+')';
}
function hexArray(c1,c2,length) {
	length -= 1;

	var steps = [];
	var newArray = [];
	var newC1 = c1.replace('#','').match(/.{1,2}/g);
	var newC2 = c2.replace('#','').match(/.{1,2}/g);
	for (i = 0;  i < 3; i++) {
		newC1[i] = parseInt(newC1[i], 16);
		newC2[i] = parseInt(newC2[i], 16);
		steps.push( newC1[i] == newC2[i] ? 0 : (newC1[i] - newC2[i]) / length * -1 );
	}
	for (var i = 0; i < length+1; i++) {
		newArray.push(
			"#" +
            ("0" + parseInt( Math.floor( steps[0] * i + newC1[0])).toString(16)).slice(-2) +
            ("0" + parseInt( Math.floor( steps[1] * i + newC1[1])).toString(16)).slice(-2) +
            ("0" + parseInt( Math.floor( steps[2] * i + newC1[2])).toString(16)).slice(-2)
		)
	}
	return newArray;
}
function randomNumber (from,to,decimals) {
    if (decimals != undefined) {
        return (Math.random()*(Number(to)-Number(from))+Number(from)).toFixed(decimals);
    }
    else {
        return Math.random()*(to-from)+from;
    }
}
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}
function randomHex() {
    return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
}


function randomRGBA (o) {
    return 'rgba(' +
        Math.floor(Math.random()*255+1) + ',' +
        Math.floor(Math.random()*255+1) + ',' +
        Math.floor(Math.random()*255+1) + ',' +
        o + ')';
}

