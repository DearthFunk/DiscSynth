(function () {
	'use strict';
	angular
		.module('discSynth')
		.factory('localStorageService', localStorageService);

	localStorageService.$inject = ['LOCAL_STORAGE_OBJECT_NAME', '$localStorage'];

	function localStorageService(LOCAL_STORAGE_OBJECT_NAME, $localStorage) {

		var service = {
			storage: JSON.parse(localStorage.getItem(LOCAL_STORAGE_OBJECT_NAME)),
			checkStorageObject: checkStorageObject,
			getStorageObject: getStorageObject,
			setLocalStorage: setLocalStorage
		};

		service.checkStorageObject();

		return service;

		/////////////////////////////////////////////////////


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

		function setLocalStorage(themeService,visualizerService, audioService) {
			var discSynthLocalStorage = service.getStorageObject(themeService, visualizerService, audioService);
			//localStorage.setItem(LOCAL_STORAGE_OBJECT_NAME, JSON.stringify(discSynthLocalStorage));
		//	$localStorage.testValue = discService.testValue;
		}

		function getStorageObject(themeService, visualizerService, audioService) {
			return {
				active: true,
				volume: audioService.node.masterGain.gain.value,
				tempo: audioService.tempo,
				discLength: audioService.storage.discLength,
				synthIndex: audioService.synthTemplate.index,
				themeIndex: themeService.theme.index,
				visualizerIndex: visualizerService.animation.index
				//synthTemplates: audioService.synthTemplates
			};
		}
	}
})();