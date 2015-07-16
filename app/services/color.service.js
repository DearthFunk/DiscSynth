(function () {
	'use strict';
	angular
		.module('discSynth')
		.factory('colorService', colorService);

	function colorService() {
		var service = {
			randomRGBA: randomRGBA,
			randomHex: randomHex,
			hexToRGBA: hexToRGBA
		};
		return service;

		/////////////////////////////////////

		function randomRGBA(o) {
			return 'rgba(' +
				Math.floor(Math.random() * 255 + 1) + ',' +
				Math.floor(Math.random() * 255 + 1) + ',' +
				Math.floor(Math.random() * 255 + 1) + ',' +
				o + ')';
		}

		function randomHex() {
			return "#000000".replace(/0/g, function () {
				return (~~(Math.random() * 16)).toString(16);
			});
		}

		function hexToRGBA(hex, opacity) {
			var newHex = hex.replace('#', '');
			var r = parseInt(newHex.substring(0, 2), 16);
			var g = parseInt(newHex.substring(2, 4), 16);
			var b = parseInt(newHex.substring(4, 6), 16);
			var o = angular.isDefined(opacity) ? opacity : 1;
			return 'rgba(' + r + ',' + g + ',' + b + ',' + o + ')';
		}
	}
})();