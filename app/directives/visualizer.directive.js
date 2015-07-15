(function () {
	'use strict';

	angular
		.module('visualizerModule', [])
		.directive('visualizer', visualizer);

	function visualizer() {
		var directive = {
			restrict: 'EA',
			template: '<canvas class="visualizer"></canvas>',
			replace: true,
			controller: visualizerController,
			bindToController: true
		};
		return directive;
	}

	function visualizerController() {

	}

})();