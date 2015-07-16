(function () {
	'use strict';

	angular
		.module('discSynth')
		.directive('animation', animation);

	function animation() {
		var directive = {
			restrict: 'EA',
			template: '<canvas class="animation"></canvas>',
			replace: true,
			controller: animationController,
			bindToController: true
		};
		return directive;
	}

	function animationController() {

	}

})();