(function () {
	'use strict';

	angular
		.module('discSynth', [
			'ngStorage',
			'animationModule',
			'menuModule'
		])
		.controller('discController', discController)
		.run(function($localStorage){
			$localStorage.$default({
				themeIndex: 0,
				synthIndex: 0,
				animationIndex: 0,
				discLength: 16,
				volume: 0.5,
				tempo: 120
			});
		});

	discController.$inject = ['$scope', 'themeService'];

	function discController($scope, themeService) {
		$scope.themeService = themeService;
	}

})();