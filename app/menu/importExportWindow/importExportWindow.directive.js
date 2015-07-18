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
			bindToController: true
		};
		return directive;
	}

	importExportController.$inject = ['$scope', 'animationService', 'themeService', 'audioService', '$localStorage'];
	function importExportController($scope, animationService, themeService, audioService, $localStorage) {

		var client = new ZeroClipboard(document.getElementById('copyButton'));
		$scope.textAreaData = '';
		$scope.importData = importData;
		$scope.importExport = importExport;

		////////////////////////////////////////////

		function importExport(e, data) {
			$scope.textAreaData = data;
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

				animationService.setAnimation();
				themeService.setTheme();
				audioService.setSynthTemplate();

			}
		}
	}
})();