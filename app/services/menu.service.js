(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.factory('menuService', menuService);

	menuService.$inject = ['localStorageService'];

	function menuService(localStorageService) {

		var service = {
			len: localStorageService.storage ? localStorageService.storage.len : 16,
			spd: localStorageService.storage ? localStorageService.storage.spd : 1,
			vol: localStorageService.storage ? localStorageService.storage.vol : 0.5
		};

		return service;
	}
})();