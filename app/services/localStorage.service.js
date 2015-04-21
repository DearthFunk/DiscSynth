angular
	.module('localStorageServiceModule', [])
	.factory('localStorageService', localStorageService);

	localStorageService.$inject = [];

	function localStorageService(){

		var service = {
			storage: JSON.parse(localStorage.getItem('hexSynthDearthFunkSaveObject')),
			getStorageInfo: getStorageInfo
		};
		if (service.storage != null) {
			if ('active' in service.storage) {
				if (!service.storage.active){
					service.storage = false;
				}
			}
			else {
				service.storage = false;
			}
		}
		else {
			service.storage = false;
		}

		return service;

		/////////////////////////////////////////////////////

		function getStorageInfo(discService, themeService, visualizerService) {
			return {
				active: true,
				vol: discService.node.masterGain.gain.value,
				spd: discService.spd,
				len: discService.len,
				synthIndex: discService.synthIndex,
				themeIndex: themeService.theme.index,
				visualizerIndex: visualizerService.visualizerIndex,
				synthTemplates: angular.copy(discService.synthTemplates)
			};
		}
	}