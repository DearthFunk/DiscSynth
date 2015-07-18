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

	menuController.$inject = ['$scope', '$rootScope', '$timeout', 'themeService', 'visualizerService', 'MENU_SIZE', 'audioService', 'localStorageService', 'SYNTHS', 'TEMPO_CONSTRAINTS', 'LENGTH_CONSTRAINTS'];

	function menuController($scope, $rootScope, $timeout, themeService, visualizerService, MENU_SIZE, audioService, localStorageService, SYNTHS, TEMPO_CONSTRAINTS, LENGTH_CONSTRAINTS) {

		$scope.themeService = themeService;
		$scope.audioService = audioService;
		$scope.visualizerService = visualizerService;
		$scope.menuSize = MENU_SIZE;
		$scope.TEMPO_CONSTRAINTS = TEMPO_CONSTRAINTS;
		$scope.LENGTH_CONSTRAINTS = LENGTH_CONSTRAINTS;

		$scope.editingVol = false;
		$scope.editingSpd = false;
		$scope.editingLen = false;

		$scope.importExportWindow = importExportWindow;
		$scope.changeVisualizer = changeVisualizer;
		$scope.changeTheme = changeTheme;
		$scope.changeSynth = changeSynth;
		$scope.resetSynth = resetSynth;
		$scope.helpWindow = helpWindow;

		////////////////////////////////////////////////

		function helpWindow() {
			$scope.importExportVisible = false;
			$scope.helpWindowVisible = !$scope.helpWindowVisible;
		}

		function importExportWindow() {
			$scope.helpWindowVisible = false;
			$scope.importExportVisible = !$scope.importExportVisible;
			var data = JSON.stringify(localStorageService.getStorageObject(themeService, visualizerService));
			$rootScope.$broadcast('importExport', data);
		}

		function changeTheme(item) {
			themeService.theme = item;
			$rootScope.$broadcast('themeChangeEvent');
		}
		function changeSynth(item) {
			audioService.synthTemplate = item;
			$rootScope.$broadcast('visualizerChangeEvent');
		}
		function changeVisualizer(item) {
			visualizerService.animation = item;
			$rootScope.$broadcast('visualizerChangeEvent');
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