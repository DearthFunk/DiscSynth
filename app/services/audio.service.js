(function () {
	'use strict';
	angular
		.module('discSynth')
		.factory('audioService', audioService)
		.constant('TIME_WORKER_POST_MESSAGE',{
			start : 0,
			stop: 1,
			tick : 2
		})
		.constant('SYNTHS', [
			{
				index: 0,
				osc1: {type: 'sine', detune: -400},
				osc2: {type: 'square', detune: 0},
				osc3: {type: 'sawtooth', detune: 1675},
				bitcrusher: {bypass: false, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: true,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.5,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: true, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 5910.5, cutoff: 0.552, resonance: 3.8},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 100},
				convolver: {bypass: true, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 1,
				osc1: {type: 'square', detune: -925},
				osc2: {type: 'square', detune: 0},
				osc3: {type: 'sawtooth', detune: -925},
				bitcrusher: {bypass: false, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.5,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: true, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 5910.4, cutoff: 0.552, resonance: 3.8},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 30},
				convolver: {bypass: false, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 2,
				osc1: {type: 'square', detune: -1000},
				osc2: {type: 'sine', detune: 200},
				osc3: {type: 'sine', detune: 1000},
				bitcrusher: {bypass: true, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 0.7,
					dryLevel: 1,
					feedback: 0.68,
					delayTime: 121,
					cutoff: 20000
				},
				overdrive: {bypass: false, curveAmount: 0.95, drive: 0.95, outputGain: 1},
				moogfilter: {bypass: true, bufferSize: 5910.4, cutoff: 0.552, resonance: 3.8},
				tremolo: {bypass: true, intensity: 0.831, rate: 0.594, stereoPhase: 0},
				convolver: {bypass: true, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 3,
				osc1: {type: 'square', detune: 0},
				osc2: {type: 'square', detune: 0},
				osc3: {type: 'sawtooth', detune: 0},
				bitcrusher: {bypass: true, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: true,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.4,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: false, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: true, bufferSize: 4096, cutoff: 0.065, resonance: 3.5},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 180},
				convolver: {bypass: false, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 4,
				osc1: {type: 'sine', detune: 0},
				osc2: {type: 'sine', detune: 600},
				osc3: {type: 'sine', detune: 0},
				bitcrusher: {bypass: true, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 1,
					dryLevel: 0,
					feedback: 0.7,
					delayTime: 16.9,
					cutoff: 3752.875
				},
				overdrive: {bypass: true, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 1777.6, cutoff: 0.215, resonance: 0.525},
				tremolo: {bypass: true, intensity: 0.875, rate: 1, stereoPhase: 0},
				convolver: {bypass: false, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 5,
				osc1: {type: 'square', detune: -1175},
				osc2: {type: 'sawtooth', detune: 475},
				osc3: {type: 'triangle', detune: -475},
				bitcrusher: {bypass: false, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.4,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: false, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 12260.8, cutoff: 0.252, resonance: 0.55},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 0},
				convolver: {bypass: true, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			}
		]);

	audioService.$inject =['$localStorage', 'genColors', 'SYNTHS', 'LENGTH_CONSTRAINTS', 'TIME_WORKER_POST_MESSAGE'];

	function audioService($localStorage, genColors, SYNTHS, LENGTH_CONSTRAINTS, TIME_WORKER_POST_MESSAGE) {
		var audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() : null;
		var audioBufferSize = 1024;
		var nextNoteTime = 0;
		var notesInQueue = [];
		var tuna = new Tuna(audioCtx);
		var timerWorker = new Worker('./app/services/metronomeworker.js');
		timerWorker.onmessage = scheduler;
		timerWorker.postMessage({'interval':25}); //25 is the interval run value

		var service = {
			playing: false,
			synthTemplates: angular.copy(SYNTHS), //localStorageService.storage ? localStorageService.storage.synthTemplates : angular.copy(SYNTHS),
			node : {},
			fx: {},
			clickTrack: 0,
			slice: [],
			maxFreq: 1500,
			randomize: randomize,
			startStop: startStop,
			playNotes: playNotes,
			getAverageDB: getAverageDB,
			setSynthTemplate: setSynthTemplate
		};

		setupAudioNodesAndDiscSlices();
		service.setSynthTemplate();

		return service;

		/////////////////////////////////////

		function setSynthTemplate() {
			service.synthTemplate = service.synthTemplates[$localStorage.synthIndex];
		}

		/*function mergeObject(obj1, obj2) {
			for (var p in obj2) {
				try {
					// Property in destination object set; update its value.
					if ( obj2[p].constructor==Object ) {
						obj1[p] = mergeObject(obj1[p], obj2[p]);

					} else {
						obj1[p] = obj2[p];

					}
				} catch(e) {
				}
			}
			return obj1;
		}

		unction setSynthTemplate(index) {
			var template = service.synthTemplates[index];
			mergeObject(template.moogfilter, service.fx.moogfilter);
			mergeObject(template.overdrive, service.fx.overdrive);
			mergeObject(template.bitcrusher, service.fx.bitcrusher);
			mergeObject(template.tremolo, service.fx.tremolo);
			mergeObject(template.convolver, service.fx.convolver);
			mergeObject(template.delay, service.fx.delay);
			mergeObject(template.osc1, service.node.osc1);
			mergeObject(template.osc2, service.node.osc2);
			mergeObject(template.osc3, service.node.osc3);
		}

		function setSynthAudio(index) {
			var template = service.synthTemplates[index];
			mergeObject(service.fx.moogfilter, template.moogfilter);
			mergeObject(service.fx.overdrive, template.overdrive);
			mergeObject(service.fx.bitcrusher, template.bitcrusher);
			mergeObject(service.fx.tremolo, template.tremolo);
			mergeObject(service.fx.convolver, template.convolver);
			mergeObject(service.fx.delay, template.delay);
			mergeObject(service.node.osc1, template.osc1);
			mergeObject(service.node.osc2, template.osc2);
			mergeObject(service.node.osc3, template.osc3);
		}*/

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

		function getAverageDB() {
			var dbArray = new Uint8Array(service.node.analyser.frequencyBinCount);
			service.node.analyser.getByteFrequencyData(dbArray);
			var values = 0;
			for (var i = 0; i < dbArray.length; i++) {
				values += dbArray[i];
			}
			return values / dbArray.length;
		}


		function startStop() {
			service.playing = !service.playing;
			service.node.stopperGain.gain.value = service.playing ? 1 : 0;
			notesInQueue = [];
			nextNoteTime = audioCtx.currentTime;
			timerWorker.postMessage(service.playing ? TIME_WORKER_POST_MESSAGE.start : TIME_WORKER_POST_MESSAGE.stop);
		}

		function playNotes() {
			var osc1 = service.slice[service.clickTrack].osc[0];
			var osc2 = service.slice[service.clickTrack].osc[1];
			var osc3 = service.slice[service.clickTrack].osc[2];
			service.node.osc1.frequency.value = !service.playing ? 0 : osc1.active ? osc1.freq : 0;
			service.node.osc2.frequency.value = !service.playing ? 0 : osc2.active ? osc2.freq : 0;
			service.node.osc3.frequency.value = !service.playing ? 0 : osc3.active ? osc3.freq : 0;
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
					var secondsPerBeat = 60.0 / $localStorage.tempo;
					nextNoteTime += 0.25 * secondsPerBeat;
					service.clickTrack++;
					if (service.clickTrack >= $localStorage.discLength) {
						service.clickTrack = 0;
					}
				}
			}
		}

		function setupAudioNodesAndDiscSlices() {
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

			service.node.osc1 = audioCtx.createOscillator();
			service.node.osc2 = audioCtx.createOscillator();
			service.node.osc3 = audioCtx.createOscillator();
			service.node.masterGain = audioCtx.createGain();
			service.node.stopperGain = audioCtx.createGain();
			service.node.masterGain.gain.value = $localStorage.volume;
			service.node.stopperGain.gain.value = 1;

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

			service.node.masterGain.connect(service.node.stopperGain);
			service.node.stopperGain.connect(service.node.analyser);
			service.node.stopperGain.connect(audioCtx.destination);

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
	}
})();