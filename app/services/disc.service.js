(function () {
	'use strict';
	angular
		.module('discServiceModule', [])
		.factory('discService', discService);

	discService.$inject = ['$localStorage', 'mathService', 'LENGTH_CONSTRAINTS'];

	function discService($localStorage, mathService, LENGTH_CONSTRAINTS) {
		$localStorage.$default({ discLength: 12 });
		var service = {
			storage: $localStorage,
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

		return service;

		/////////////////////////////////////

		function randomize() {
			for (var discIndex = 0; discIndex < service.slice.length - 1; discIndex++) {
				for (var layer = 0; layer < service.slice[discIndex].osc.length; layer++) {
					service.slice[discIndex].osc[layer].active = mathService.randomNumber(1,3,0) === 1;
					service.slice[discIndex].osc[layer].freq = mathService.randomNumber(20, service.maxFreq, 0);
				}
			}
		}

	}
})();