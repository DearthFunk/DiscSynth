(function () {
	'use strict';
	angular
		.module('animationModule',[])
		.service('animationService', animationService);

	animationService.$inject = ['$localStorage', 'crazy', 'burst', 'mathMachine', 'particles', 'tunnel'];

	function animationService($localStorage, crazy, burst, mathMachine, particles, tunnel) {

		var service = {
			setAnimation: setAnimation,
			animations: [
				{index: 0, service: false},
				{index: 1, service: crazy},
				{index: 2, service: burst},
				{index: 3, service: mathMachine},
				{index: 4, service: particles},
				{index: 5, service: tunnel}
			]
		};

		service.setAnimation();

		return service;

		/////////////////////////////////

		function setAnimation() {
			service.animation = service.animations[$localStorage.animationIndex];
		}

	}
})();