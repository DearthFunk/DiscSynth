(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.factory('menuService', menuService);

	menuService.$inject = [];

	function menuService() {

		var service = {
			synthTemplates: [],
			synthIndex: 0,
			themeIndex: 0,
			len: 16,
			spd: 0.5,
			vol: 0

		};

		return service;

	}
})();