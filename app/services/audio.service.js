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
					delayTime: 0.8,
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
					delayTime: 0.5,
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
			setSynthTemplate: setSynthTemplate,
			updateSynthTemplate: updateSynthTemplate,
			setupAudioNodesAndDiscSlices: setupAudioNodesAndDiscSlices
		};

		service.setupAudioNodesAndDiscSlices();
		service.synthTemplate = service.synthTemplates[$localStorage.synthIndex];

		return service;

		/////////////////////////////////////

		function updateSynthTemplate() {
			var template = service.synthTemplate;
			var fx = service.fx;
			var node = service.node;
			template.osc1.type = node.osc1.type;
			template.osc1.detune = node.osc1.detune.value;
			template.osc2.type = node.osc2.type;
			template.osc2.detune = node.osc2.detune.value;
			template.osc3.type = node.osc3.type;
			template.osc3.detune = node.osc3.detune.value;
			template.bitcrusher.bypass = fx.bitcrusher.bypass;
			template.bitcrusher.bits = fx.bitcrusher.bits;
			template.bitcrusher.bufferSize = fx.bitcrusher.bufferSize;
			template.bitcrusher.normFreq = fx.bitcrusher.normFreq;
			template.delay.bypass = fx.delay.bypass;
			template.delay.wetLevel = fx.delay.wetLevel.value;
			template.delay.dryLevel = fx.delay.dryLevel.value;
			template.delay.feedback = fx.delay.feedback.value;
			template.delay.delayTime = fx.delay.delayTime.value;
			template.delay.cutoff = fx.delay.cutoff.value;
			template.overdrive.bypass = fx.overdrive.bypass;
			template.overdrive.curveAmount = fx.overdrive.curveAmount;
			template.overdrive.drive = fx.overdrive.drive.value;
			template.overdrive.outputGain = fx.overdrive.outputGain.value;
			template.moogfilter.bypass = fx.moogfilter.bypass;
			template.moogfilter.bufferSize = fx.moogfilter.bufferSize;
			template.moogfilter.cutoff = fx.moogfilter.cutoff;
			template.moogfilter.resonance = fx.moogfilter.resonance;
			template.tremolo.bypass = fx.tremolo.bypass;
			template.tremolo.intensity = fx.tremolo.intensity;
			template.tremolo.rate = fx.tremolo.rate;
			template.tremolo.stereoPhase = fx.tremolo.stereoPhase;
			template.convolver.bypass = fx.convolver.bypass;
			template.convolver.highCut = fx.convolver.highCut.value;
			template.convolver.lowCut = fx.convolver.lowCut.value;
			template.convolver.dryLevel = fx.convolver.dryLevel.value;
			template.convolver.wetLevel = fx.convolver.wetLevel.value;
		}

		function setSynthTemplate() {
			service.updateSynthTemplate();
			service.synthTemplate = service.synthTemplates[$localStorage.synthIndex];
			var template = service.synthTemplate;
			var fx = service.fx;
			var node = service.node;
			node.osc1.type =template.osc1.type;
			node.osc1.detune.value = template.osc1.detune;
			node.osc2.type = template.osc2.type;
			node.osc2.detune.value = template.osc2.detune;
			node.osc3.type = template.osc3.type;
			node.osc3.detune.value = template.osc3.detune;
			fx.bitcrusher.bypass = template.bitcrusher.bypass;
			fx.bitcrusher.bits = template.bitcrusher.bits;
			fx.bitcrusher.bufferSize = template.bitcrusher.bufferSize;
			fx.bitcrusher.normFreq = template.bitcrusher.normFreq;
			fx.delay.bypass = template.delay.bypass;
			fx.delay.wetLevel = template.delay.wetLevel;
			fx.delay.dryLevel = template.delay.dryLevel;
			fx.delay.feedback = template.delay.feedback;
			fx.delay.delayTime = template.delay.delayTime;
			fx.delay.cutoff = template.delay.cutoff;
			fx.overdrive.bypass = template.overdrive.bypass;
			fx.overdrive.curveAmount = template.overdrive.curveAmount;
			fx.overdrive.drive = template.overdrive.drive;
			fx.overdrive.outputGain = template.overdrive.outputGain;
			fx.moogfilter.bypass = template.moogfilter.bypass;
			fx.moogfilter.bufferSize = template.moogfilter.bufferSize;
			fx.moogfilter.cutoff = template.moogfilter.cutoff;
			fx.moogfilter.resonance = template.moogfilter.resonance;
			fx.tremolo.bypass = template.tremolo.bypass;
			fx.tremolo.intensity = template.tremolo.intensity;
			fx.tremolo.rate = template.tremolo.rate;
			fx.tremolo.stereoPhase = template.tremolo.stereoPhase;
			fx.convolver.bypass = template.convolver.bypass;
			fx.convolver.highCut = template.convolver.highCut;
			fx.convolver.lowCut = template.convolver.lowCut;
			fx.convolver.dryLevel = template.convolver.dryLevel;
			fx.convolver.wetLevel = template.convolver.wetLevel;
		}

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
			var msg = service.playing ? TIME_WORKER_POST_MESSAGE.start : TIME_WORKER_POST_MESSAGE.stop;
			timerWorker.postMessage(msg);
			console.log('postMessage: ', msg);
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