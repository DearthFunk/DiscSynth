angular.module('importExportWindowModule', [])

    .directive('importExportWindow', function (discService,themeService,visualizerService) {
        return {
            restrict:'C',
            templateUrl:'directives/importExportWindow/importExportWindow.html',
            replace: true,
            link: function(scope)	{

                var client = new ZeroClipboard( document.getElementById("copyButton") );

                scope.textAreaData = '';

                scope.$on("importExport",function(event,data){
                    scope.textAreaData = data;
                });

                scope.importData = function() {
                    var parsedData = JSON.parse(scope.textAreaData);
                    if (parsedData != null){
                        discService.len = parsedData.len;
                        discService.spd = parsedData.spd;
                        discService.node.masterGain.gain.value = parsedData.vol;
                        discService.synthIndex = parsedData.synthIndex;
                        discService.synthTemplates = deepCopy(parsedData.synthTemplates);
                        themeService.themeIndex = parsedData.themeIndex;
                        visualizerService.visualizerIndex = parsedData.visualizerIndex;
                    }
                    scope.importExportVisible = !scope.importExportVisible;
                }

            }
        }
    });