(function () {
	'use strict';
	angular
		.module('localStorageServiceModule', [])
		.factory('localStorageService', localStorageService);

	localStorageService.$inject = [];

	function localStorageService() {

		var service = {
			storage: JSON.parse(localStorage.getItem('discSynthLocalStorage')),
			getStorageInfo: getStorageInfo
		};
		if (service.storage != null) {
			if ('active' in service.storage) {
				if (!service.storage.active) {
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

		function getStorageInfo(menuService, themeService, visualizerService) {
			return {
				active: true,
				vol: menuService.vol,
				spd: menuService.spd,
				len: menuService.len,
				synthIndex: menuService.synthIndex,
				themeIndex: themeService.theme.index,
				visualizerIndex: visualizerService.visualizerIndex,
				synthTemplates: angular.copy(menuService.synthTemplates)
			};
		}
	}
})();