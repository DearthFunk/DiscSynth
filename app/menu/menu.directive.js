(function () {
	'use strict';
	angular
		.module('menuModule', [])
		.directive('menu', menu)
		.constant('MENU_SIZE', 220)
		.constant('TEMPO_CONSTRAINTS', { MIN: 60,MAX: 180 })
		.constant('LENGTH_CONSTRAINTS', {MIN: 4, MAX: 32});

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
		$scope.$localStorage = $localStorage;

		$scope.changeTheme = changeTheme;
		$scope.changeSynth = changeSynth;
		$scope.changeAnimaton = changeAnimaton;

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
			$scope.$broadcast('redrawSliders');
		}

		function changeAnimaton(index) {
			$localStorage.animationIndex = index;
			animationService.setAnimation();
		}

		function changeSynth(index) {
			$localStorage.synthIndex = index;
			audioService.setSynthTemplate();
		}

		function resetSynth(index) {
			audioService.synthTemplates[index] = angular.copy(SYNTHS[index]);
			if (index === $localStorage.synthIndex) {
				audioService.synthTemplate = audioService.synthTemplates[index];
			}
			$scope.resetIndex = index;
			$timeout(function () {
				$scope.resetIndex = -1;
			}, 400)
		}

	}
})();