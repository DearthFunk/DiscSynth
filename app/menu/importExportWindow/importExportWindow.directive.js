(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('importExportWindow', importExportWindow);

	function importExportWindow() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/menu/importExportWindow/importExportWindow.html',
			replace: true,
			controller: importExportController,
			bindToController: true,
			scope: {
				panelOpen: '=panelOpen'
			}
		};
		return directive;
	}

	importExportController.$inject = ['$scope', 'animationService', 'themeService', 'audioService', '$localStorage'];
	function importExportController($scope, animationService, themeService, audioService, $localStorage) {

		$scope.textAreaData = '';
		$scope.importData = importData;
		$scope.getTextAreaData = getTextAreaData;

		$scope.$watch('panelOpen', $scope.getTextAreaData);

		////////////////////////////////////////////

		function getTextAreaData() {
			$scope.textAreaData = JSON.stringify({
				themeIndex: $localStorage.themeIndex,
				synthIndex: $localStorage.synthIndex,
				animationIndex: $localStorage.animationIndex,
				discLength: $localStorage.discLength,
				volume: $localStorage.volume,
				tempo: $localStorage.tempo,
				synthTemplates: audioService.synthTemplates
			});
		}

		function importData() {
			var parsedData = JSON.parse($scope.textAreaData);
			if (angular.isDefined(parsedData)) {
				$localStorage.themeIndex = parsedData.themeIndex;
				$localStorage.synthIndex = parsedData.synthIndex;
				$localStorage.animationIndex = parsedData.animationIndex;
				$localStorage.discLength = parsedData.discLength;
				$localStorage.volume = parsedData.volume;
				$localStorage.tempo = parsedData.tempo;
				audioService.synthTemplates = parsedData.synthTemplates;

				audioService.setSynthTemplate();
				animationService.setAnimation();
				themeService.setTheme();
			}
		}
	}
})();