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

	menuController.$inject = ['$scope', '$rootScope', '$timeout', 'themeService', 'discService', 'eventService', 'visualizerService', 'SYNTHS', 'MENU_SIZE'];

	function menuController($scope, $rootScope, $timeout, themeService, discService, eventService, visualizerService, SYNTHS, MENU_SIZE) {

		$scope.themeService = themeService;
		$scope.eventService = eventService;
		$scope.visualizerService = visualizerService;
		$scope.discService = discService;
		$scope.menuSize = MENU_SIZE;

		$scope.editingVol = false;
		$scope.editingSpd = false;
		$scope.editingLen = false;

		$scope.importExportWindow = importExportWindow;
		$scope.changeVisualizer = changeVisualizer;
		$scope.changeTheme = changeTheme;
		$scope.changeSynth = changeSynth;
		$scope.resetSynth = resetSynth;
		$scope.helpWindow = helpWindow;
		$scope.updateLen = updateLen;

		updateLen(discService.len);

		////////////////////////////////////////////////

		function updateLen(x) {
			discService.playing = false;
			discService.discLength = 4 + Math.floor(x * 28);
			discService.reCalculateDiscs();
		}

		function changeVisualizer(index) {
			visualizerService.clearCanvas();
			visualizerService.visualizerIndex = index;
		}

		function helpWindow() {
			$scope.importExportVisible = false;
			$scope.helpWindowVisible = !$scope.helpWindowVisible;
		}

		function importExportWindow() {
			$scope.helpWindowVisible = false;
			$scope.importExportVisible = !$scope.importExportVisible;
			var data = JSON.stringify(localStorageService.getStorageInfo(discService, themeService, visualizerService));
			$rootScope.$broadcast("importExport", data);
		}

		function changeTheme(item) {
			themeService.theme = item;
			discService.reCalculateDiscs();
			$rootScope.$broadcast("themeChangeEvent");

		}

		function changeSynth(index) {
			discService.switchSynthTemplate(index);
		}

		function resetSynth(index) {
			discService.synthTemplates[index] = angular.copy(SYNTHS[index]);
			$scope.resetIndex = index;
			$timeout(function () {
				$scope.resetIndex = -1;
			}, 400)
		}
	}
})();