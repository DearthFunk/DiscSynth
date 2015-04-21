angular
	.module('visualizerModule',[])
	.directive('visualizer', visualizer);

	function visualizer(){
		var directive = {
			restrict: 'EA',
			template: '<canvas class="visualizer"></canvas>',
			replace: true,
			controller: visisualizerController,
			bindToController: true
		};
		return directive;
	}

	function visisualizerController() {

	}

