(function () {
	'use strict';
	angular
		.module('audioServiceModule', [])
		.factory('audioService', audioService);

	function audioService(localStorageService, menuService, SYNTHS, $timeout) {
		var audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() : null;
		var nextNoteTime = audioCtx.currentTime;
		var tuna = new Tuna(audioCtx);
		var clickPromise;

		var service = {
			audioBufferSize: 1024,
			synthTemplates: angular.isObject(localStorageService.storage) ? localStorageService.storage.synthTemplates : angular.copy(SYNTHS),
			playing: false,
			clickTrack: 0,
			node : {},
			fx: {},
			disc: {slices:[], colors:[]}
		};

		initAudioNodes();
		clickTrack();

		return service;

		/////////////////////////////////////

		function initAudioNodes() {
			for (var i = 0; i < 33; i++) { //disc setup
				service.disc.slices.push({
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
			service.node.stopper = audioCtx.createGain();
			service.node.masterGain = audioCtx.createGain();
			service.node.masterGain.gain.value = angular.isDefined(localStorageService.storage) ? localStorageService.storage.vol : 0.5;
			service.node.javascript = audioCtx.createScriptProcessor(service.audioBufferSize, 0, 1);
			service.node.analyser = audioCtx.createAnalyser();

			service.fx.moogfilter = new tuna.MoogFilter();
			service.fx.tremolo = new tuna.Tremolo();
			service.fx.convolver = new tuna.Convolver();
			service.fx.delay = new tuna.Delay();
			service.fx.overdrive = new tuna.Overdrive();
			service.fx.overdrive.algorithmIndex = 5;
			service.fx.bitcrusher = new tuna.Bitcrusher();

			service.node.stopper.connect(service.fx.moogfilter.input);
			service.fx.moogfilter.connect(service.fx.tremolo.input);
			service.fx.tremolo.connect(service.fx.convolver.input);
			service.fx.convolver.connect(service.fx.delay.input);
			service.fx.delay.connect(service.fx.overdrive.input);
			service.fx.overdrive.connect(service.fx.bitcrusher.input);
			service.fx.bitcrusher.connect(service.node.masterGain);
			service.node.masterGain.connect(service.node.analyser);
			service.node.masterGain.connect(audioCtx.destination);
			service.node.analyser.smoothingTimeConstant = 0.3;
			service.node.analyser.fftSize = service.audioBufferSize / 2;
			service.node.analyser.connect(service.node.javascript);
			service.node.javascript.connect(audioCtx.destination);
			service.node.osc1.frequency.value = 0;
			service.node.osc2.frequency.value = 0;
			service.node.osc3.frequency.value = 0;
			service.node.osc1.connect(service.node.stopper);
			service.node.osc2.connect(service.node.stopper);
			service.node.osc3.connect(service.node.stopper);

			service.node.osc1.start();
			service.node.osc2.start();
			service.node.osc3.start();

		}
		function clickTrack() {
			while (nextNoteTime < audioCtx.currentTime + 0.1) {
				nextNoteTime += 1.1 - menuService.spd;
				if (service.playing) {
					service.clickTrack++;
				}
				if (service.clickTrack >= menuService.len) {
					service.clickTrack = 0;
				}

				service.node.osc1.frequency.value = !service.playing ? 0 : service.disc.slices[service.clickTrack].osc[0].active ? service.disc.slices[service.clickTrack].osc[0].freq : 0;
				service.node.osc2.frequency.value = !service.playing ? 0 : service.disc.slices[service.clickTrack].osc[1].active ? service.disc.slices[service.clickTrack].osc[1].freq : 0;
				service.node.osc3.frequency.value = !service.playing ? 0 : service.disc.slices[service.clickTrack].osc[2].active ? service.disc.slices[service.clickTrack].osc[2].freq : 0;

			}
			clickPromise = $timeout(clickTrack, 25);
		}

	}
})();