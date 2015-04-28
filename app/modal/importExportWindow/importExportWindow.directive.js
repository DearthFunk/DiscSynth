(function () {
	'use strict';
	angular
		.module('modalModule')
		.directive('importExportWindow', importExportWindow);

	function importExportWindow() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/modal/importExportWindow/importExportWindow.html',
			replace: true,
			controller: importExportController,
			bindToController: true
		};
		return directive;
	}

	importExportController.$inject = ['$scope', 'menu', 'visualizerService', 'themeService'];
	function importExportController($scope, menu, visualizerService, themeService) {

		console.log(menu);
		var client = new ZeroClipboard(document.getElementById('copyButton'));
		$scope.textAreaData = '';
		$scope.importData = importData;
		$scope.importExport = importExport;
		$scope.$on('importExport', $scope.importExport);

		////////////////////////////////////////////

		function importExport(e, data) {
			$scope.textAreaData = data;
		}

		function importData() {
			var parsedData = JSON.parse($scope.textAreaData);
			if (parsedData != null) {
				menu.len = parsedData.len;
				menu.spd = parsedData.spd;
				menu.vol = parsedData.vol;
				menu.synthIndex = parsedData.synthIndex;
				menu.synthTemplates = angular.copy(parsedData.synthTemplates);
				themeService.themeIndex = parsedData.themeIndex;
				visualizerService.visualizerIndex = parsedData.visualizerIndex;
			}
			$scope.importExportVisible = !$scope.importExportVisible;
		}
	}
})();