angular.module('discServiceModule', [])
    .service("discService", function($window,$timeout,themeService,$rootScope, SYNTHS, MENU_SIZE){

        var disc = this;
        var audioCtx = typeof AudioContext !== 'undefined' ?	new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() :	null;
        var nextNoteTime = audioCtx.currentTime;
        var tuna = new Tuna(audioCtx);
        var cnv = document.querySelectorAll('.discCanvas')[0];
        var ctx = cnv.getContext("2d");
        //var clickTrack = 0;
        var hoverRing,hoverDisc,ringSelect,discSelect,mouseDownY,startFreq,centerButtonSize = -1;
        var w, h, midX, midY, angleSize, drawPromise,clickPromise,distanceFromCenter;
        var colors = [];
        var ctrlKey = false;
		var audioBufferSize = 1024;

        disc.synthTemplates =   angular.isObject(discSynthLocalStorage) ? discSynthLocalStorage.synthTemplates : angular.copy(SYNTHS);
        disc.synthIndex =       angular.isObject(discSynthLocalStorage) ? discSynthLocalStorage.synthIndex : 0;
        disc.spd =              angular.isObject(discSynthLocalStorage) ? discSynthLocalStorage.spd : 0.5;
        disc.len =              angular.isObject(discSynthLocalStorage) ? discSynthLocalStorage.len : 0.5;
        disc.playing = false;
        disc.discLength = 0;
        disc.clickTrack = 0;
        disc.discs = [];
        disc.node = {};
        disc.fx = {};
        disc.rad = 0;

        for (var i = 0; i < 33; i++) { //disc setup
            disc.discs.push({
                a1: 0,
                a2: 0,
                c: '',
                osc: [
                    {x: 0, freq: 200, y: 0, rad:0, active:false},
                    {x: 0, freq: 600, y: 0, rad:0, active:false},
                    {x: 0, freq: 1400, y: 0, rad:0, active:false},
                    {x: 0, freq: -1, y: 0, rad:0, active:false}
                ]
            });
        }

        var timer = function() {
            disc.drawDisc();
            drawPromise = $timeout(timer, 10);
        };

        disc.windowResize = function() {
            w = $window.innerWidth;
            h = $window.innerHeight;
            cnv.style.width = w +'px';
            cnv.style.height = h + 'px';
            angular.element(cnv).attr({width:  w, height: h	});
			disc.reCalculateDiscs();
        };

		disc.reCalculateDiscs = function() {
			midX = (w-MENU_SIZE) / 2;
			midY = h/2;
			disc.rad = (h/2)-10;
            centerButtonSize = disc.rad/3;
			angleSize = (1 / disc.discLength) * Math.PI*2;
			colors = hexArray(themeService.theme.discTileStart,themeService.theme.discTileEnd,disc.discLength);
			for (var i = 0; i < disc.discs.length; i++) {
                var a1 = angleSize * i;
                var a2 = angleSize * (i+1);
                var theDisc = disc.discs[i];
                theDisc.a1 = a1;
                theDisc.a2 = a2;
				for (var d = 0; d < 4; d++) {
                    theDisc.osc[d].x = midX + ((d+3) / 6 * disc.rad) * Math.cos(a1);
                    theDisc.osc[d].y = midY + ((d+3) / 6 * disc.rad) * Math.sin(a1);
                    theDisc.osc[d].rad = (d+3) / 6 * disc.rad;
                }
			}
		};

        disc.randomize = function() {
            for (var discIndex = 0; discIndex < disc.discs.length-1; discIndex++) {
                for (var layer = 0; layer < disc.discs[discIndex].osc.length; layer++) {
                    disc.discs[discIndex].osc[layer].active = Math.random() >= 0.5;
                    disc.discs[discIndex].osc[layer].freq = parseInt(randomNumber(100,15000,0));
                }
            }
        };

        disc.drawDisc = function() {
			ctx.clearRect(0,0,w,h);
			for (var i = 0; i < disc.discs.length-1; i++) {
				var disc1 = disc.discs[i];
                var disc2 = disc.discs[ i + 1 ];
				for (var layer = 0; layer < disc1.osc.length-1; layer++) {
                    if (i < disc.discLength) {
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.moveTo(disc1.osc[layer].x, disc1.osc[layer].y);
                        ctx.arc(midX, midY, disc1.osc[layer].rad, disc1.a1, disc1.a2, false);
                        ctx.lineTo(disc2.osc[layer+1].x,disc2.osc[layer+1].y);
                        ctx.arc(midX, midY, disc1.osc[layer+1].rad, disc1.a2, disc1.a1, true);
                        ctx.lineTo(disc1.osc[layer].x, disc1.osc[layer].y);

                        if (disc1.osc[layer].active && i == disc.clickTrack) {
                            ctx.strokeStyle = themeService.theme.discLines;
                            ctx.fillStyle = hexToRGBA(colors[i],0.7);
                            ctx.fill();
                        }
                        if (disc1.osc[layer].active) {
                            ctx.strokeStyle = themeService.theme.discLines;
                            ctx.fillStyle = hexToRGBA(colors[i],0.4);
                            ctx.fill();
                        }
                        else if (i == disc.clickTrack) {
                            ctx.strokeStyle = themeService.theme.discLines;
                            ctx.fillStyle = themeService.theme.discPlayLine;
                            ctx.fill();
                        }
                        else if (layer == hoverRing && hoverDisc == i) {
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = themeService.theme.discLines;
                            ctx.fillStyle = themeService.theme.discHover;
                            ctx.fill();
                        }
                        else {
                            ctx.strokeStyle = hexToRGBA(themeService.theme.discLines,0.2);
                        }
                        ctx.stroke();
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.font = "16px Times New Roman";
                        ctx.fillStyle = themeService.theme.discFont;

                        var a = (disc1.a2 - disc1.a1) * i + (angleSize/2);
                        var r = (disc1.osc[layer].rad + disc1.osc[layer+1].rad)/2;
                        var x = midX + (r) * Math.cos(a);
                        var y = midY + (r) * Math.sin(a);

                        ctx.fillText(disc1.osc[layer].freq, x, y);
                        ctx.closePath();
                    }
				}
			}

            //MAIN DISC BORDER (inner and outer)
            ctx.lineWidth = 2;
            ctx.strokeStyle = themeService.theme.discBorder1;
            ctx.beginPath();ctx.arc(midX, midY, disc.rad+1, 0,Math.PI*2, false);ctx.stroke();ctx.closePath();
            ctx.beginPath();ctx.arc(midX, midY, disc.rad/2 - 2, 0,Math.PI*2, false);ctx.stroke();ctx.closePath();

            ctx.lineWidth = 1;
            ctx.strokeStyle = themeService.theme.discBorder2;
            ctx.beginPath();ctx.arc(midX, midY, disc.rad+2, 0,Math.PI*2, false);ctx.stroke();ctx.closePath();
            ctx.beginPath();ctx.arc(midX, midY, disc.rad/2 - 3, 0,Math.PI*2, false);ctx.stroke();ctx.closePath();


            //CENTER PLAY BUTTON
            ctx.beginPath();
            ctx.fillStyle = disc.playing ? themeService.theme.centerPlay : themeService.theme.centerStop;
            ctx.arc(midX, midY, centerButtonSize, 0,Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(midX, midY, centerButtonSize+ 5, 0,Math.PI*2, false);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = themeService.theme.centerBorder;
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.font = "60px Keys";
            ctx.fontWeight = "bold";
            ctx.lineWidth = 50;
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillStyle = themeService.theme.centerText;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 3;
            ctx.shadowColor = "#FFFFFF";
            ctx.fillText(disc.playing ? 'STOP' : 'PLAY',midX,midY);
            ctx.closePath();
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;

        };

        disc.windowResize();
        timer();

/*-------------------------------------------------HANDLERS-----------------------------------------------------------*/
/*-------------------------------------------------HANDLERS-----------------------------------------------------------*/
/*-------------------------------------------------HANDLERS-----------------------------------------------------------*/
        disc.handleMouseDown = function(e) {
            if (distanceFromCenter < centerButtonSize) {
                disc.playing = !disc.playing;
                disc.playing ?
                    disc.node.stopper.connect(disc.fx.moogfilter.input) :
                    disc.node.stopper.disconnect();
            }
            else if (distanceFromCenter < disc.rad && distanceFromCenter > disc.rad/2) {
                if (!ctrlKey) {
                    disc.discs[hoverDisc].osc[hoverRing].active = !disc.discs[hoverDisc].osc[hoverRing].active;
                }
                else {
                    ringSelect = hoverRing;
                    discSelect = hoverDisc;
                    mouseDownY = e.clientY;
                    startFreq = disc.discs[discSelect].osc[ringSelect].freq;
                }
            }
        };

        disc.handleMouseMove = function(e) {
            distanceFromCenter = Math.sqrt( Math.pow(e.clientX - (w - MENU_SIZE) / 2, 2) + Math.pow(e.clientY - (h/2), 2) );
            if (distanceFromCenter < disc.rad && distanceFromCenter > disc.rad/2) {
                for (var layer = 0; layer < disc.discs[0].osc.length-1; layer++) {
                    var d1 = (layer+3)/ 6 * disc.rad;
                    var d2 = (layer+4)/ 6 * disc.rad;
                    if (distanceFromCenter > d1 && distanceFromCenter < d2) {
                        hoverRing = layer;
                        break;
                    }
                }
                var angle = Math.atan2((h/2) - e.clientY,(w-MENU_SIZE) / 2 - e.clientX) + Math.PI;
                for (var i = 0; i < disc.discs.length-1; i++) {
                    if (angle > disc.discs[i].a1 && angle < disc.discs[i].a2) {
                        hoverDisc = i;
                        break;
                    }
                }
            }
            else {
                hoverRing = -1;
                hoverDisc = -1;
            }

            if (ringSelect > -1 && discSelect > -1 && ctrlKey) {
                var newFreq = startFreq + ((mouseDownY-e.clientY)*2);
                disc.discs[discSelect].osc[ringSelect].freq = newFreq < 0 ? 0 : newFreq > 15000 ? 15000 : newFreq;
            }
        };

        disc.handleMouseUp = function() {
            ringSelect = -1;
            discSelect = -1;
        };
        disc.handleKeyUp = function(e){
            ctrlKey = e.ctrlKey;
        };
        disc.handleKeyDown = function(e){
            ctrlKey = e.ctrlKey;
            switch (e.keyCode) {
                case 32 :
                    disc.playing = !disc.playing;
                    disc.playing ? disc.node.stopper.connect(disc.fx.moogfilter.input) : disc.node.stopper.disconnect();
                    break;
                case 65 : disc.fx.bitcrusher.bypass = !disc.fx.bitcrusher.bypass; break;
                case 83 : disc.fx.overdrive.bypass = !disc.fx.overdrive.bypass;   break;
                case 68 : disc.fx.tremolo.bypass = !disc.fx.tremolo.bypass;       break;
                case 90 : disc.fx.convolver.bypass = !disc.fx.convolver.bypass;         break;
                case 88 : disc.fx.moogfilter.bypass = !disc.fx.moogfilter.bypass;         break;
                case 67 : disc.fx.delay.bypass = !disc.fx.delay.bypass;           break;
            }
        };


/*-------------------------------------------------AUDIO STUFF------------------------------------------------*/
/*-------------------------------------------------AUDIO STUFF------------------------------------------------*/
/*-------------------------------------------------AUDIO STUFF------------------------------------------------*/
        disc.node.osc1 = audioCtx.createOscillator();
        disc.node.osc2 = audioCtx.createOscillator();
        disc.node.osc3 = audioCtx.createOscillator();
        disc.node.stopper = audioCtx.createGain();
        disc.node.masterGain = audioCtx.createGain();
        disc.node.masterGain.gain.value = angular.isObject(discSynthLocalStorage) ? discSynthLocalStorage.vol : 0.5;
        disc.node.javascript = audioCtx.createScriptProcessor(audioBufferSize, 0, 1);
        disc.node.analyser = audioCtx.createAnalyser();

        disc.fx.moogfilter = new tuna.MoogFilter();
        disc.fx.tremolo = new tuna.Tremolo();
        disc.fx.convolver = new tuna.Convolver();
        disc.fx.delay = new tuna.Delay();
        disc.fx.overdrive = new tuna.Overdrive();
        disc.fx.overdrive.algorithmIndex = 5;
        disc.fx.bitcrusher = new tuna.Bitcrusher();

        disc.node.stopper.connect   (disc.fx.moogfilter.input);
        disc.fx.moogfilter.connect    (disc.fx.tremolo.input);
        disc.fx.tremolo.connect   (disc.fx.convolver.input);
        disc.fx.convolver.connect	(disc.fx.delay.input);
        disc.fx.delay.connect     (disc.fx.overdrive.input);
        disc.fx.overdrive.connect (disc.fx.bitcrusher.input);
        disc.fx.bitcrusher.connect(disc.node.masterGain);
        disc.node.masterGain.connect(disc.node.analyser);
        disc.node.masterGain.connect(audioCtx.destination);
        disc.node.analyser.smoothingTimeConstant = 0.3;
        disc.node.analyser.fftSize = audioBufferSize / 2;
        disc.node.analyser.connect(disc.node.javascript);
        disc.node.javascript.connect(audioCtx.destination);
        disc.node.osc1.frequency.value = 0;
        disc.node.osc2.frequency.value = 0;
        disc.node.osc3.frequency.value = 0;
        disc.node.osc1.connect(disc.node.stopper);
        disc.node.osc2.connect(disc.node.stopper);
        disc.node.osc3.connect(disc.node.stopper);

        disc.node.osc1.start();
        disc.node.osc2.start();
        disc.node.osc3.start();

        disc.switchSynthTemplate = function(index) {
            //get current synth data
            var data = {
                osc1: {type:disc.node.osc1.type, detune:disc.node.osc1.detune.value},
                osc2: {type:disc.node.osc2.type, detune:disc.node.osc2.detune.value},
                osc3: {type:disc.node.osc3.type, detune:disc.node.osc2.detune.value},
                bitcrusher:{
                    bypass:disc.fx.bitcrusher.bypass,
                    bits:disc.fx.bitcrusher.bits,
                    bufferSize:disc.fx.bitcrusher.bufferSize,
                    normFreq:disc.fx.bitcrusher.normFreq
                },
                delay:{
                    bypass:disc.fx.delay.bypass,
                    wetLevel:disc.fx.delay.wetLevel.value,
                    dryLevel:disc.fx.delay.dryLevel.value,
                    feedback:disc.fx.delay.feedback.value,
                    delayTime:disc.fx.delay.delayTime.value,
                    cutoff:disc.fx.delay.cutoff.value
                },
                overdrive:{
                    bypass:disc.fx.overdrive.bypass,
                    curveAmount:disc.fx.overdrive.curveAmount,
                    drive:disc.fx.overdrive.drive.value,
                    outputGain:disc.fx.overdrive.outputGain.value
                },
                moogfilter:{
                    bypass:disc.fx.moogfilter.bypass,
                    bufferSize: disc.fx.moogfilter.bufferSize,
                    cutoff: disc.fx.moogfilter.cutoff,
                    resonance: disc.fx.moogfilter.resonance
                },
                tremolo:{
                    bypass:disc.fx.tremolo.bypass,
                    intensity:disc.fx.tremolo.intensity,
                    rate:disc.fx.tremolo.rate,
                    stereoPhase:disc.fx.tremolo.stereoPhase
                },
                convolver:{
                    bypass:disc.fx.convolver.bypass,
                    highCut:disc.fx.convolver.highCut.value,
                    lowCut:disc.fx.convolver.lowCut.value,
                    dryLevel:disc.fx.convolver.dryLevel.value,
                    wetLevel:disc.fx.convolver.wetLevel.value
                }
            };


            //copy current synth and store, then change index
            disc.synthTemplates[disc.synthIndex] = angular.copy(data);
            disc.synthIndex = index;

            //load new synth template
            disc.loadSynth(index);
        };
        disc.loadSynth = function(index) {

            var template = disc.synthTemplates[index];

            disc.node.osc1.type = template.osc1.type;
            disc.node.osc2.type = template.osc2.type;
            disc.node.osc3.type = template.osc3.type;
            disc.node.osc1.detune.value = template.osc1.detune;
            disc.node.osc2.detune.value = template.osc2.detune;
            disc.node.osc3.detune.value = template.osc3.detune;
            disc.fx.bitcrusher.bypass = template.bitcrusher.bypass;
            disc.fx.bitcrusher.bits = template.bitcrusher.bits;
            disc.fx.bitcrusher.bufferSize = template.bitcrusher.bufferSize;
            disc.fx.bitcrusher.normFreq = template.bitcrusher.normFreq;
            disc.fx.delay.bypass = template.delay.bypass;
            disc.fx.delay.wetLevel.value = template.delay.wetLevel;
            disc.fx.delay.dryLevel.value = template.delay.dryLevel;
            disc.fx.delay.feedback.value = template.delay.feedback;
            disc.fx.delay.delayTime.value = template.delay.delayTime;
            disc.fx.delay.cutoff.value = template.delay.cutoff;
            disc.fx.overdrive.bypass = template.overdrive.bypass;
            disc.fx.overdrive.curveAmount = template.overdrive.curveAmount;
            disc.fx.overdrive.drive.value = template.overdrive.drive;
            disc.fx.overdrive.outputGain.value = template.overdrive.outputGain;
            disc.fx.moogfilter.bypass = template.moogfilter.bypass;
            disc.fx.moogfilter.bufferSize = template.moogfilter.bufferSize;
            disc.fx.moogfilter.cutoff = template.moogfilter.cutoff;
            disc.fx.moogfilter.resonance = template.moogfilter.resonance;

            disc.fx.tremolo.bypass = template.tremolo.bypass;
            disc.fx.tremolo.intensity = template.tremolo.intensity;
            disc.fx.tremolo.rate = template.tremolo.rate;
            disc.fx.tremolo.stereoPhase = template.tremolo.stereoPhase;

            disc.fx.convolver.bypass = template.convolver.bypass;
            disc.fx.convolver.highCut.value = template.convolver.highCut;
            disc.fx.convolver.lowCut.value = template.convolver.lowCut;
            disc.fx.convolver.dryLevel.value = template.convolver.dryLevel;
            disc.fx.convolver.wetLevel.value = template.convolver.wetLevel;


        };
        disc.loadSynth(disc.synthIndex);

        /*----------------------------------------------------------------------------------------CLICK TRACK---------*/
        disc.clickTrackPlayer = function() {
            while (nextNoteTime < audioCtx.currentTime + 0.1 ) {
                nextNoteTime += 1.1 - disc.spd;
                if (disc.playing) {
                    disc.clickTrack++;
                }
                if (disc.clickTrack >= disc.discLength) {
                    disc.clickTrack = 0;
                }
                disc.node.osc1.frequency.value = !disc.playing ? 0 : disc.discs[disc.clickTrack].osc[0].active ? disc.discs[disc.clickTrack].osc[0].freq : 0;
                disc.node.osc2.frequency.value = !disc.playing ? 0 : disc.discs[disc.clickTrack].osc[1].active ? disc.discs[disc.clickTrack].osc[1].freq : 0;
                disc.node.osc3.frequency.value = !disc.playing ? 0 : disc.discs[disc.clickTrack].osc[2].active ? disc.discs[disc.clickTrack].osc[2].freq : 0;
            }
            clickPromise = $timeout(disc.clickTrackPlayer, 25);
        };
        disc.clickTrackPlayer();

    });