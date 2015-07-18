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

	menuController.$inject = ['$scope', '$timeout', '$localStorage', 'themeService', 'animationService', 'MENU_SIZE', 'audioService', 'SYNTHS', 'TEMPO_CONSTRAINTS', 'LENGTH_CONSTRAINTS'];

	function menuController($scope, $timeout, $localStorage, themeService, animationService, MENU_SIZE, audioService, SYNTHS, TEMPO_CONSTRAINTS, LENGTH_CONSTRAINTS) {

		$scope.themeService = themeService;
		$scope.audioService = audioService;
		$scope.animationService = animationService;
		$scope.menuSize = MENU_SIZE;
		$scope.TEMPO_CONSTRAINTS = TEMPO_CONSTRAINTS;
		$scope.LENGTH_CONSTRAINTS = LENGTH_CONSTRAINTS;
		$scope.changeTheme = changeTheme;
		$scope.changeAnimaton = changeAnimaton;
		$scope.$localStorage = $localStorage;

		$scope.editingVol = false;
		$scope.editingSpd = false;
		$scope.editingLen = false;
		$scope.showHelpWindow = false;
		$scope.showImportExportWindow = false;

		$scope.resetSynth = resetSynth;

		////////////////////////////////////////////////

		function changeTheme(index) {
			$localStorage.themeIndex = index;
			themeService.setTheme();
		}

		function changeAnimaton(index) {
			$localStorage.animationIndex = index;
			animationService.setAnimation();
		}

		function resetSynth(index) {
			audioService.synthTemplates[index] = angular.copy(SYNTHS[index]);
			$scope.resetIndex = index;
			$timeout(function () {
				$scope.resetIndex = -1;
			}, 400)
		}

	}
})();