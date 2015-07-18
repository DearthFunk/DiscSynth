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

	importExportController.$inject = ['$scope', 'animationService', 'themeService'];
	function importExportController($scope, animationService, themeService) {

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
/*
				menuService.len = parsedData.len;
				menuService.spd = parsedData.spd;
				menuService.vol = parsedData.vol;
				menuService.synthIndex = parsedData.synthIndex;
				menuService .synthTemplates = angular.copy(parsedData.synthTemplates);
*/
				themeService.themeIndex = parsedData.themeIndex;
				animationService.animationInde = parsedData.animationInde;
			}
			$scope.importExportVisible = !$scope.importExportVisible;
		}
	}
})();