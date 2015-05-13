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

	menuController.$inject = ['$scope', '$rootScope', '$timeout', 'themeService', 'eventService', 'visualizerService', 'MENU_SIZE', 'MAX_SPEED', 'MIN_SPEED', 'audioService', 'localStorageService', 'menuService'];

	function menuController($scope, $rootScope, $timeout, themeService, eventService, visualizerService, MENU_SIZE, MAX_SPEED, MIN_SPEED, audioService, localStorageService, menuService) {

		$scope.themeService = themeService;
		$scope.eventService = eventService;
		$scope.audioService = audioService;
		$scope.visualizerService = visualizerService;
		$scope.menuSize = MENU_SIZE;
		$scope.MAX_SPEED = MAX_SPEED;
		$scope.MIN_SPEED = MIN_SPEED;

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

		////////////////////////////////////////////////

		function updateLen(x) {
			$rootScope.$broadcast('discLenChange', x);
			//console.log(x);
			//discService.playing = false;
			//discService.discLength = 4 + Math.floor(x * 28);
			//discService.reCalculateDiscs();
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
			var data = JSON.stringify(localStorageService.getStorageInfo(menuService, themeService, visualizerService));
			$rootScope.$broadcast("importExport", data);
		}

		function changeTheme(item, index) {
			themeService.theme = item;
			menuService.themeIndex = index;
			$rootScope.$broadcast("themeChangeEvent");

		}

		function changeSynth(index) {
			//discService.switchSynthTemplate(index);
		}

		function resetSynth(index) {
			//discService.synthTemplates[index] = angular.copy(SYNTHS[index]);
			$scope.resetIndex = index;
			$timeout(function () {
				$scope.resetIndex = -1;
			}, 400)
		}

	}
})();