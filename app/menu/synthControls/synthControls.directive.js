(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('synthControls', synthControls);

	synthControls.$inject = [];

	function synthControls() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/menu/synthControls/synthControls.html',
			replace: true,
			controller: synthControlsController,
			bindToController: true,
			scope: {
				fx: '=fx',
				node: '=node',
				playing: '=playing'
			}
		};
		return directive
	}

	synthControlsController.$inject = ['$scope', '$window', 'themeService', 'audioService'];

	function synthControlsController($scope, $window, themeService, audioService) {

		angular.element($window).bind('keydown', keyDownEvent);

		$scope.themeService = themeService;
		$scope.oscWaveTypes = [
			{txt: 'Sine', type: 'sine'},
			{txt: 'Square', type: 'square'},
			{txt: 'SawTooth', type: 'sawtooth'},
			{txt: 'Triangle', type: 'triangle'}
		];

		/////////////////////////////////////////////

		function keyDownEvent(e) {
			switch (e.keyCode) {
				case 32 : audioService.startStop(); break;
				case 49 : $scope.fx.moogfilter.bypass = !$scope.fx.moogfilter.bypass;	break;
				case 50 : $scope.fx.overdrive.bypass = !$scope.fx.overdrive.bypass;	    break;
				case 51 : $scope.fx.bitcrusher.bypass = !$scope.fx.bitcrusher.bypass;   break;
				case 52 : $scope.fx.tremolo.bypass = !$scope.fx.tremolo.bypass;		    break;
				case 53 : $scope.fx.convolver.bypass = !$scope.fx.convolver.bypass; 	break;
				case 54 : $scope.fx.delay.bypass = !$scope.fx.delay.bypass;			    break;
			}
			$scope.$digest();
		}
	}
})();