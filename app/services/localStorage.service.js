(function () {
	'use strict';
	angular
		.module('localStorageServiceModule', [])
		.factory('localStorageService', localStorageService);

	localStorageService.$inject = ['LOCAL_STORAGE_OBJECT_NAME'];

	function localStorageService(LOCAL_STORAGE_OBJECT_NAME) {

		var service = {
			storage: JSON.parse(localStorage.getItem(LOCAL_STORAGE_OBJECT_NAME)),
			checkStorageObject: checkStorageObject,
			getStorageInfo: getStorageInfo,
			setLocalStorage: setLocalStorage
		};

		service.checkStorageObject();

		return service;

		/////////////////////////////////////////////////////

		function setLocalStorage(menuService,themeService,visualizerService, audioService) {
			//var discSynthLocalStorage = service.getStorageInfo(menuService, themeService, visualizerService, audioService);
			//localStorage.setItem(LOCAL_STORAGE_OBJECT_NAME, JSON.stringify(discSynthLocalStorage));
		}
		function checkStorageObject() {
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
		}

		function getStorageInfo(menuService, themeService, visualizerService, audioService) {
			return {
				active: true,
				vol: menuService.vol,
				spd: menuService.spd,
				len: menuService.len,
				synthIndex: audioService.synthTemplate.index,
				themeIndex: themeService.theme.index,
				visualizerIndex: visualizerService.visualizerIndex,
				synthTemplates: audioService.synthTemplates
			};
		}
	}
})();