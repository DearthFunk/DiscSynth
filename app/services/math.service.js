(function () {
	'use strict';

	angular
		.module('mathServiceModule', [])
		.factory('mathService', mathService);

	function mathService() {
		var service = {
			randomNumber: randomNumber,
			roundedNumber: roundedNumber
		};
		return service;

		/////////////////////////////////////

		function randomNumber(from, to, decimals) {
			var returnVal = angular.isDefined(decimals) ?
				(Math.random() * (Number(to) - Number(from)) + Number(from)).toFixed(decimals) :
				Math.random() * (to - from) + from;
			return parseInt(returnVal, 10);
		}

		function roundedNumber(value, precision) {
			var precision = precision || 0,
				neg = value < 0,
				power = Math.pow(10, precision),
				value = Math.round(value * power),
				integral = String((neg ? Math.ceil : Math.floor)(value / power)),
				fraction = String((neg ? -value : value) % power),
				padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
			return parseFloat(precision ? integral + '.' + padding + fraction : integral);
		}
	}
})();