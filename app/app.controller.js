(function () {
	'use strict';

	angular
		.module('discSynth', [
			'ngStorage',
			'animationModule',
			'menuModule'
		])
		.constant('MENU_SIZE', 220)
		.constant('LOCAL_STORAGE_OBJECT_NAME', 'discSynthLocalStorage')
		.constant('TEMPO_CONSTRAINTS', { MIN: 60,MAX: 180 })
		.constant('LENGTH_CONSTRAINTS', {MIN: 4, MAX: 32})
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
		])
		.constant('THEMES', [
			{
				backgroundImage: "url('img/5.jpg')",
				discBorder1: "rgba(255,100,0,1)",
				discBorder2: "rgba(255,255,100,0.5)",
				discTileStart: "#00FF00",
				discTileEnd: "#0000FF",
				discLines: "#000000",
				discHover: "rgba(0,0,0,0.4)",
				discFont: "#FFFFFF",
				discPlayLine: "rgba(0,0,0,0.6)",
				menuHighlight: "#00FF00",
				menuSectionalBackground: "rgba(100,100,255,0.4)",
				centerBorder: "rgba(0,0,0,0.7)",
				centerFill: "rgba(255,255,255,0.3)",
				centerPlay: "rgba(255,0,0,0.2)",
				centerStop: "rgba(0,255,0,0.2)",
				centerText: "#000000"
			},
			{
				backgroundImage: "url('img/1.jpg')",
				discBorder1: "rgba(0,0,0,0.5)",
				discBorder2: "rgba(255,255,255,0.5)",
				discTileStart: "#FF0000",
				discTileEnd: "#0000FF",
				discLines: "#FFFFFF",
				discHover: "rgba(255,255,255,0.2)",
				discFont: "#FFFFFF",
				discPlayLine: "rgba(255,255,255,0.2)",
				menuHighlight: "#FFFF00",
				menuSectionalBackground: "rgba(255,255,0,0.1)",
				centerBorder: "rgba(255,255,255,0.7)",
				centerFill: "rgba(255,255,255,0.3)",
				centerPlay: "rgba(255,0,0,0.2)",
				centerStop: "rgba(0,255,0,0.2)",
				centerText: "#000000"
			},
			{
				backgroundImage: "url('img/2.jpg')",
				discBorder1: "rgba(255,0,0,1)",
				discBorder2: "rgba(0,255,0,0.5)",
				discTileStart: "#FFA500",
				discTileEnd: "#FFFF00",
				discLines: "#FFFFFF",
				discHover: "rgba(255,255,255,0.2)",
				discFont: "#FFFFFF",
				discPlayLine: "rgba(255,255,255,0.2)",
				menuHighlight: "#FFA500",
				menuSectionalBackground: "rgba(255,0,0,0.1)",
				centerBorder: "rgba(255,255,255,0.7)",
				centerFill: "rgba(255,255,255,0.3)",
				centerPlay: "rgba(255,0,0,0.2)",
				centerStop: "rgba(0,255,0,0.2)",
				centerText: "#000000"
			},
			{
				backgroundImage: "url('img/3.jpg')",
				discBorder1: "rgba(0,0,0,1)",
				discBorder2: "rgba(0,0,0,0)",
				discTileStart: "#FF0000",
				discTileEnd: "#0000FF",
				discLines: "#FFFFFF",
				discHover: "rgba(0,0,0,0.2)",
				discFont: "#000000",
				discPlayLine: "rgba(0,0,0,0.5)",
				menuHighlight: "#FFFFFF",
				menuSectionalBackground: "rgba(255,255,255,0.1)",
				centerBorder: "rgba(255,255,255,0.7)",
				centerFill: "rgba(255,255,255,0.3)",
				centerPlay: "rgba(255,0,0,0.2)",
				centerStop: "rgba(0,255,0,0.2)",
				centerText: "#000000"
			},
			{
				backgroundImage: "url('img/4.jpg')",
				discBorder1: "rgba(255,100,100,1)",
				discBorder2: "rgba(255,255,100,0.5)",
				discTileStart: "#FFFF00",
				discTileEnd: "#FFFFFF",
				discLines: "#FFFFFF",
				discHover: "rgba(0,0,0,0.2)",
				discFont: "#FFFFFF",
				discPlayLine: "rgba(0,0,0,0.5)",
				menuHighlight: "#cdcdcd",
				menuSectionalBackground: "rgba(255,255,0,0.4)",
				centerBorder: "rgba(255,255,255,0.7)",
				centerFill: "rgba(255,255,255,0.3)",
				centerPlay: "rgba(255,0,0,0.2)",
				centerStop: "rgba(0,255,0,0.2)",
				centerText: "#000000"
			},
			{
				backgroundImage: "url('img/6.jpg')",
				discBorder1: "rgba(255,255,255,1)",
				discBorder2: "rgba(0,0,0,0.5)",
				discTileStart: "#FFFFFF",
				discTileEnd: "#FFFFFF",
				discLines: "#000000",
				discHover: "rgba(0,0,0,0.6)",
				discFont: "#FFFFFF",
				discPlayLine: "rgba(0,0,0,0.3)",
				menuHighlight: "#FFFFFF",
				menuSectionalBackground: "rgba(255,255,255,0.1)",
				centerBorder: "rgba(255,255,255,0.7)",
				centerFill: "rgba(255,255,255,0.3)",
				centerPlay: "rgba(255,0,0,0.2)",
				centerStop: "rgba(0,255,0,0.2)",
				centerText: "#000000"
			}
		])
		.controller('discController', discController);

	discController.$inject = ['$scope', '$localStorage', 'themeService'];

	function discController($scope, $localStorage, themeService) {
		$scope.themeService = themeService;

		console.log('SETTING');
		$localStorage.$default({
			themeIndex: 4,
			animationIndex: 2,
			discLength: 16,
			volume: 0.5,
			tempo: 120
		});

	}

})();