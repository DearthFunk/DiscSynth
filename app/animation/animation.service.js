(function () {
	'use strict';
	angular
		.module('animationModule',[])
		.service('visualizerService', visualizerService);

	function visualizerService(localStorageService) {

		var cnv = document.querySelectorAll('.visualizerCanvas')[0];
		var ctx = cnv.getContext('2d');

		var service = {
			animations: [
				{index: 0, functionToRun: false},
				{index: 1, functionToRun: 'visParticles'},
				{index: 2, functionToRun: 'visScope'},
				{index: 3, functionToRun: 'visTunnel'},
				{index: 4, functionToRun: 'MathMachine'},
				{index: 5, functionToRun: 'Burst'}
			]
		};
		service.animation = service.animations[localStorageService.storage ? localStorageService.storage.visualizerIndex : 0];

		return service;

	}
})();