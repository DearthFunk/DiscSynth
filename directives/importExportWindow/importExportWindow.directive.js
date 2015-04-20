angular
	.module('importExportWindowModule', [])
    .directive('importExportWindow', importExportWindow);

function importExportWindow() {
	var directive = {
		restrict: 'EA',
		templateUrl: 'directives/importExportWindow/importExportWindow.html',
		replace: true,
		controller: importExportController,
		bindToController: true
	};
	return directive;
}

importExportController.$inject = ['$scope', 'discService', 'visualizerService', 'themeService'];
function importExportController($scope, discService, visualizerService, themeService) {

    var client = new ZeroClipboard( document.getElementById("copyButton") );
    $scope.textAreaData = '';
	$scope.importData = importData;
	$scope.importExport = importExport;
	$scope.$on('importExport', $scope.importExport);

	////////////////////////////////////////////

    function importExport(e, data){
        $scope.textAreaData = data;
    }

    function importData() {
        var parsedData = JSON.parse($scope.textAreaData);
        if (parsedData != null){
            discService.len = parsedData.len;
            discService.spd = parsedData.spd;
            discService.node.masterGain.gain.value = parsedData.vol;
            discService.synthIndex = parsedData.synthIndex;
            discService.synthTemplates = angular.copy(parsedData.synthTemplates);
            themeService.themeIndex = parsedData.themeIndex;
            visualizerService.visualizerIndex = parsedData.visualizerIndex;
        }
        $scope.importExportVisible = !$scope.importExportVisible;
    }
}