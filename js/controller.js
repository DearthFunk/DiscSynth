angular.module('discSynth', [

    "eventServiceModule",
    "discServiceModule",
    "themeServiceModule",
    "visualizerServiceModule",

    "knobElement",
	"sliderHorizontalElement",
    "dropDownElement",

    "importExportWindowModule",
    "helpWindowModule",
    "synthControlsModule",
    "menuModule"


])
.controller('discController',
    function discController( $scope , themeService ){
        $scope.importExportVisible = false;
        $scope.helpWindowVisible = false;
        $scope.themeService = themeService;
    }
);
