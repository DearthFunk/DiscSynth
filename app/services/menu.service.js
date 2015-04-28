(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.factory('menu', menu);

	menu.$inject = [];

	function menu() {

		var service = {
			synthTemplates: [],
			synthIndex: 0,
			themeIndex: 0,
			len: 0,
			spd: 0,
			vol: 0

		};

		return service;

	}
})();