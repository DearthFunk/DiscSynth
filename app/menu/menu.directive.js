(function () {
	'use strict';
	angular
		.module('menuModule', [])
		.directive('menu', menu);

	menu.$inject = [];

	function menu() {
		var directive = {
			restrict: 'C',
			templateUrl: 'app/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope', '$timeout', 'themeService', 'animationService', 'MENU_SIZE', 'audioService', 'localStorageService', 'SYNTHS', 'TEMPO_CONSTRAINTS', 'LENGTH_CONSTRAINTS'];

	function menuController($scope, $timeout, themeService, animationService, MENU_SIZE, audioService, localStorageService, SYNTHS, TEMPO_CONSTRAINTS, LENGTH_CONSTRAINTS) {

		$scope.themeService = themeService;
		$scope.audioService = audioService;
		$scope.animationService = animationService;
		$scope.menuSize = MENU_SIZE;
		$scope.TEMPO_CONSTRAINTS = TEMPO_CONSTRAINTS;
		$scope.LENGTH_CONSTRAINTS = LENGTH_CONSTRAINTS;

		$scope.editingVol = false;
		$scope.editingSpd = false;
		$scope.editingLen = false;
		$scope.showHelpWindow = false;
		$scope.showImportExportWindow = false;

		$scope.resetSynth = resetSynth;


/*
		var data = JSON.stringify(localStorageService.getStorageObject(themeService, animationService));
		$rootScope.$broadcast('importExport', data);
*/

		////////////////////////////////////////////////


		function resetSynth(index) {
			audioService.synthTemplates[index] = angular.copy(SYNTHS[index]);
			$scope.resetIndex = index;
			$timeout(function () {
				$scope.resetIndex = -1;
			}, 400)
		}

	}
})();