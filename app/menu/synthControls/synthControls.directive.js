(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('synthControls', synthControls);

	synthControls.$inject = [];

	function synthControls() {
		var directive = {
			restrict: 'C',
			templateUrl: 'app/menu/synthControls/synthControls.html',
			replace: true,
			controller: synthControlsController,
			bindToController: true
		};
		return directive
	}

	synthControlsController.$inject = ['$scope', 'audioService'];

	function synthControlsController($scope, audioService) {

		$scope.audioService = audioService;
		$scope.oscWaveTypes = [
			{txt: 'Sine', type: 'sine'},
			{txt: 'Square', type: 'square'},
			{txt: 'SawTooth', type: 'sawtooth'},
			{txt: 'Triangle', type: 'triangle'}
		];

	}
})();