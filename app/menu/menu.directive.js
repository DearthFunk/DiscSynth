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

    function menuController($scope, $rootScope, $timeout,themeService,discService,eventService,visualizerService, SYNTHS, MENU_SIZE)	{

        $scope.themeService = themeService;
        $scope.eventService = eventService;
        $scope.visualizerService = visualizerService;
        $scope.discService = discService;
        $scope.menuSize = MENU_SIZE;

        $scope.editingVol = false;
        $scope.editingSpd = false;
        $scope.editingLen = false;


        $scope.updateLen = {
            toRun: function(x) {
                discService.playing = false;
                discService.discLength = 4 + Math.floor(x*28);
                discService.reCalculateDiscs();
            }
        };
        $scope.updateLen.toRun(discService.len);

        $scope.changeVisualizer = function(index) {
            visualizerService.clearCanvas();
            visualizerService.visualizerIndex = index;
        };


        $scope.helpWindow = function() {
            $scope.importExportVisible = false;
            $scope.helpWindowVisible = !$scope.helpWindowVisible;
        };
        $scope.importExportWindow = function() {
            $scope.helpWindowVisible = false;
            $scope.importExportVisible = !$scope.importExportVisible;
            var data = JSON.stringify(getStorageInfo(discService,themeService,visualizerService));
	        $rootScope.$broadcast("importExport",data);
        };

        $scope.changeTheme = function(item) {
            themeService.theme = item;
            discService.reCalculateDiscs();
	        $rootScope.$broadcast("themeChangeEvent");

        };

        $scope.changeSynth = function(index) {
            discService.switchSynthTemplate(index);
        };

        $scope.resetSynth = function(index) {
            discService.synthTemplates[index] = angular.copy(SYNTHS[index]);
            $scope.resetIndex = index;
            $timeout(function() {
                $scope.resetIndex = -1;
            },400)
        }

    }