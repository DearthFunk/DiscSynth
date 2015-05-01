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

		$scope.resetIndex = -1;
		$scope.audioService = audioService;
		$scope.oscWaveTypes = [
			{txt: 'Sine', type: 'sine'},
			{txt: 'Square', type: 'square'},
			{txt: 'SawTooth', type: 'sawtooth'},
			{txt: 'Triangle', type: 'triangle'}
		];

		$scope.$on('keyDownEvent', keyDownEvent);

		///////////////////////////////////////

		function keyDownEvent(e, args) {
			switch (args.keyCode) {
				case 32 :
					audioService.playing = !audioService.playing;
					audioService.playing ? audioService.node.stopper.connect(audioService.fx.moogfilter.input) : audioService.node.stopper.disconnect();
					break;
				case 65 :
					audioService.fx.bitcrusher.bypass = !audioService.fx.bitcrusher.bypass;
					break;
				case 83 :
					audioService.fx.overdrive.bypass = !audioService.fx.overdrive.bypass;
					break;
				case 68 :
					audioService.fx.tremolo.bypass = !audioService.fx.tremolo.bypass;
					break;
				case 90 :
					audioService.fx.convolver.bypass = !audioService.fx.convolver.bypass;
					break;
				case 88 :
					audioService.fx.moogfilter.bypass = !audioService.fx.moogfilter.bypass;
					break;
				case 67 :
					audioService.fx.delay.bypass = !audioService.fx.delay.bypass;
					break;
			}
		}
	}
})();