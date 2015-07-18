(function () {
	'use strict';
	angular
		.module('animationModule',[])
		.service('animationService', animationService);

	animationService.$inject = ['$localStorage'];

	function animationService($localStorage) {

		var service = {
			setAnimation: setAnimation,
			animations: [
				{index: 0, functionToRun: false},
				{index: 1, functionToRun: 'visParticles'},
				{index: 2, functionToRun: 'visScope'},
				{index: 3, functionToRun: 'visTunnel'},
				{index: 4, functionToRun: 'MathMachine'},
				{index: 5, functionToRun: 'Burst'}
			]
		};

		console.log($localStorage.animationIndex);
		service.setAnimation();

		return service;

		/////////////////////////////////

		function setAnimation() {
			service.animation = service.animations[$localStorage.animationIndex];
		}

	}
})();