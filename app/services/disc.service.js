(function () {
	'use strict';
	angular
		.module('discServiceModule', [])
		.factory('discService', discService);

	discService.$inject = ['localStorageService', 'mathService', 'LENGTH_CONSTRAINTS'];

	function discService(localStorageService, mathService, LENGTH_CONSTRAINTS) {
		var service = {
			discLength: localStorageService.storage ? parseInt(localStorageService.storage.discLength,10) : 12,
			slice: [], 
			playing: false,
			clickTrack: 0,
			maxFreq: 1500,
			randomize: randomize
		};

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

		console.log(service, localStorageService.storage);
		return service;

		/////////////////////////////////////

		function randomize() {
			for (var discIndex = 0; discIndex < service.slice.length - 1; discIndex++) {
				for (var layer = 0; layer < service.slice[discIndex].osc.length; layer++) {
					service.slice[discIndex].osc[layer].active = Math.random() >= 0.5;
					service.slice[discIndex].osc[layer].freq = mathService.randomNumber(100, service.maxFreq, 0);
				}
			}
		}

	}
})();