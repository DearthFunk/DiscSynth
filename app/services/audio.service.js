(function () {
	'use strict';
	angular
		.module('discSynth')
		.factory('audioService', audioService);

	audioService.$inject =['$localStorage', 'SYNTHS', 'TIME_WORKER_POST_MESSAGE', '$window', 'LENGTH_CONSTRAINTS', 'genColors'];

	function audioService($localStorage, SYNTHS, TIME_WORKER_POST_MESSAGE, $window, LENGTH_CONSTRAINTS, genColors) {
		var audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() : null;
		var audioBufferSize = 1024;
		var nextNoteTime = 0;
		var notesInQueue = [];
		var tuna = new Tuna(audioCtx);
		var timerWorker = new Worker('./app/services/metronomeworker.js');
		timerWorker.onmessage = scheduler;
		timerWorker.postMessage({'interval':25}); //25 is the interval run value

		$localStorage.$default({
			tempo: 120,
			synthIndex: 0,
			discLength: 12
		});


		var service = {
			playing: false,
			storage: $localStorage,
			synthTemplates: angular.copy(SYNTHS), //localStorageService.storage ? localStorageService.storage.synthTemplates : angular.copy(SYNTHS),
			node : {},
			fx: {},
			clickTrack: 0,
			startStopPlayback: startStopPlayback,
			playNotes: playNotes,
			slice: [],
			maxFreq: 1500,
			randomize: randomize
		};
		service.synthTemplate = service.synthTemplates[0];//localStorageService.storage ? localStorageService.storage.synthIndex : 0];
		for (var i = 0; i <= LENGTH_CONSTRAINTS.MAX; i++) {
			service.slice.push({
				a1: 0,
				a2: 0,
				c: '',
				osc: [
					{x: 0, y: 0, rad: 0, active: false, freq: 200},
					{x: 0, y: 0, rad: 0, active: false, freq: 600},
					{x: 0, y: 0, rad: 0, active: false, freq: 1400},
					{x: 0, y: 0, rad: 0, active: false, freq: -1}
				]
			});
		}

		angular.element($window).bind('keydown', keyDownEvent);

		initAudioNodes();

		return service;

		/////////////////////////////////////

		function randomize() {
			for (var discIndex = 0; discIndex < service.slice.length - 1; discIndex++) {
				for (var layer = 0; layer < service.slice[discIndex].osc.length; layer++) {
					var cell = service.slice[discIndex].osc[layer];
					cell.active = genColors.get.randomNumber(1,3,0) === 1;
					if (cell.active) {
						cell.freq = genColors.get.randomNumber(20, service.maxFreq, 0);
					}
				}
			}
		}

		function getFreqArray (depth, removal) {
			var theSmallArray = [];
			var theFreqArray = new Uint8Array(  service.node.analyser.frequencyBinCount);
			service.node.analyser.getByteFrequencyData(theFreqArray);
			var x = depth == undefined ? 1 : depth;
			var len = theFreqArray.length - removal;
			for (var i = 0; i < len; i += x) {
				theSmallArray.push(theFreqArray[i]);
			}
			return theSmallArray;
		}

		function getTimeArray (depth, removal) {
			var theSmallArray = [];
			var theTimeArray = new Uint8Array(service.node.analyser.frequencyBinCount);
			service.node.analyser.getByteTimeDomainData(theTimeArray);
			var x = depth == undefined ? 1 : depth;
			var len = theTimeArray.length - removal;
			for (var i = 0; i < len; i += x) {
				theSmallArray.push(theTimeArray[i]);
			}
			return theSmallArray;
		}

		function getAverageDB() {
			var dbArray = new Uint8Array(service.node.analyser.frequencyBinCount);
			service.node.analyser.getByteFrequencyData(dbArray);
			var values = 0;
			for (var i = 0; i < dbArray.length; i++) {
				values += dbArray[i];
			}
			return values / dbArray.length;
		}

		function keyDownEvent(e) {
			// NEEDS AN APPLY
			switch (e.keyCode) {
				case 32 :
					service.playing = !service.playing;
					service.playing ? service.node.stopper.connect(service.fx.moogfilter.input) : service.node.stopper.disconnect();
					break;
				case 65 : service.fx.bitcrusher.bypass = !service.fx.bitcrusher.bypass; break;
				case 83 : service.fx.overdrive.bypass = !service.fx.overdrive.bypass;	break;
				case 68 : service.fx.tremolo.bypass = !service.fx.tremolo.bypass;		break;
				case 90 : service.fx.convolver.bypass = !service.fx.convolver.bypass;	break;
				case 88 : service.fx.moogfilter.bypass = !service.fx.moogfilter.bypass;	break;
				case 67 : service.fx.delay.bypass = !service.fx.delay.bypass;			break;
			}
		}
		function startStopPlayback() {
			service.playing = !service.playing;
			if (service.playing) {
				service.node.masterGain.connect(service.node.analyser);
				service.node.masterGain.connect(audioCtx.destination);
			}
			else {
				service.node.masterGain.disconnect();
			}
			notesInQueue = [];
			nextNoteTime = audioCtx.currentTime;
			timerWorker.postMessage(service.playing ? TIME_WORKER_POST_MESSAGE.start : TIME_WORKER_POST_MESSAGE.stop);
		}

		function playNotes() {

		}

		function scheduler(e) {
			if (e.data === TIME_WORKER_POST_MESSAGE.tick) {
				while (nextNoteTime < audioCtx.currentTime + 0.1) {
					notesInQueue.push({
						note: service.clickTrack,
						time: nextNoteTime
					});
					//actually play something
					service.playNotes();
					//setup next note
					var secondsPerBeat = 60.0 / service.storage.tempo;
					nextNoteTime += 0.25 * secondsPerBeat;
					service.clickTrack++;
					if (service.clickTrack >= service.storage.discLength) {
						service.clickTrack = 0;
					}
				}
			}
		}

		function initAudioNodes() {

			service.node.osc1 = audioCtx.createOscillator();
			service.node.osc2 = audioCtx.createOscillator();
			service.node.osc3 = audioCtx.createOscillator();
			service.node.masterGain = audioCtx.createGain();
		//	service.node.masterGain.gain.value = localStorageService.storage ? localStorageService.storage.volume : 0.5;
			service.node.javascript = audioCtx.createScriptProcessor(audioBufferSize, 0, 1);
			service.node.analyser = audioCtx.createAnalyser();

			service.fx.moogfilter = new tuna.MoogFilter();
			service.fx.tremolo = new tuna.Tremolo();
			service.fx.convolver = new tuna.Convolver();
			service.fx.delay = new tuna.Delay();
			service.fx.overdrive = new tuna.Overdrive();
			service.fx.overdrive.algorithmIndex = 5;
			service.fx.bitcrusher = new tuna.Bitcrusher();

			service.node.osc1.connect(service.fx.moogfilter.input);
			service.node.osc2.connect(service.fx.moogfilter.input);
			service.node.osc3.connect(service.fx.moogfilter.input);
			service.fx.moogfilter.connect(service.fx.overdrive.input);
			service.fx.overdrive.connect(service.fx.bitcrusher.input);
			service.fx.bitcrusher.connect(service.fx.tremolo.input);
			service.fx.tremolo.connect(service.fx.convolver.input);
			service.fx.convolver.connect(service.fx.delay.input);
			service.fx.delay.connect(service.node.masterGain);

			service.node.analyser.smoothingTimeConstant = 0.3;
			service.node.analyser.fftSize = audioBufferSize / 2;
			service.node.analyser.connect(service.node.javascript);
			service.node.javascript.connect(audioCtx.destination);
			service.node.osc1.frequency.value = 0;
			service.node.osc2.frequency.value = 0;
			service.node.osc3.frequency.value = 0;

			service.node.osc1.start();
			service.node.osc2.start();
			service.node.osc3.start();

		}

		/*


		 audioService.switchSynthTemplate = function (index) {
		 //get current synth data
		 var data = {
		 osc1: {type: disc.node.osc1.type, detune: disc.node.osc1.detune.value},
		 osc2: {type: disc.node.osc2.type, detune: disc.node.osc2.detune.value},
		 osc3: {type: disc.node.osc3.type, detune: disc.node.osc2.detune.value},
		 bitcrusher: {
		 bypass: disc.fx.bitcrusher.bypass,
		 bits: disc.fx.bitcrusher.bits,
		 bufferSize: disc.fx.bitcrusher.bufferSize,
		 normFreq: disc.fx.bitcrusher.normFreq
		 },
		 delay: {
		 bypass: disc.fx.delay.bypass,
		 wetLevel: disc.fx.delay.wetLevel.value,
		 dryLevel: disc.fx.delay.dryLevel.value,
		 feedback: disc.fx.delay.feedback.value,
		 delayTime: disc.fx.delay.delayTime.value,
		 cutoff: disc.fx.delay.cutoff.value
		 },
		 overdrive: {
		 bypass: disc.fx.overdrive.bypass,
		 curveAmount: disc.fx.overdrive.curveAmount,
		 drive: disc.fx.overdrive.drive.value,
		 outputGain: disc.fx.overdrive.outputGain.value
		 },
		 moogfilter: {
		 bypass: disc.fx.moogfilter.bypass,
		 bufferSize: disc.fx.moogfilter.bufferSize,
		 cutoff: disc.fx.moogfilter.cutoff,
		 resonance: disc.fx.moogfilter.resonance
		 },
		 tremolo: {
		 bypass: disc.fx.tremolo.bypass,
		 intensity: disc.fx.tremolo.intensity,
		 rate: disc.fx.tremolo.rate,
		 stereoPhase: disc.fx.tremolo.stereoPhase
		 },
		 convolver: {
		 bypass: disc.fx.convolver.bypass,
		 highCut: disc.fx.convolver.highCut.value,
		 lowCut: disc.fx.convolver.lowCut.value,
		 dryLevel: disc.fx.convolver.dryLevel.value,
		 wetLevel: disc.fx.convolver.wetLevel.value
		 }
		 };


		 //copy current synth and store, then change index
		 disc.synthTemplates[disc.synthIndex] = angular.copy(data);
		 disc.synthIndex = index;

		 //load new synth template
		 disc.loadSynth(index);
		 };
		 disc.loadSynth = function (index) {

		 var template = disc.synthTemplates[index];

		 console.log(template);
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

		*/
	}
})();