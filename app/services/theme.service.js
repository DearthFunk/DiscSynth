(function () {
	'use strict';

	angular.module('themeServiceModule', [])

		.factory('themeService', themeService);

	themeService.$inject = ['localStorageService'];
	function themeService(localStorageService) {

		var service = {
			themes: [
				{
					index: 0,
					backgroundImage: "url('img/5.jpg')",
					discBorder1: 'rgba(255,100,0,1)',
					discBorder2: 'rgba(255,255,100,0.5)',
					discTileStart: '#00FF00',
					discTileEnd: '#0000FF',
					discLines: '#000000',
					discHover: 'rgba(0,0,0,0.4)',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(0,0,0,0.6)',
					menuHighlight: '#00FF00',
					menuSectionalBackground: 'rgba(100,100,255,0.4)',
					centerBorder: 'rgba(0,0,0,0.7)',
					centerFill: 'rgba(255,255,255,0.3)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 1,
					backgroundImage: "url('img/1.jpg')",
					discBorder1: 'rgba(0,0,0,0.5)',
					discBorder2: 'rgba(255,255,255,0.5)',
					discTileStart: '#FF0000',
					discTileEnd: '#0000FF',
					discLines: '#FFFFFF',
					discHover: 'rgba(255,255,255,0.2)',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(255,255,255,0.2)',
					menuHighlight: '#FFFF00',
					menuSectionalBackground: 'rgba(255,255,0,0.1)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerFill: 'rgba(255,255,255,0.3)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 2,
					backgroundImage: "url('img/2.jpg')",
					discBorder1: 'rgba(255,0,0,1)',
					discBorder2: 'rgba(0,255,0,0.5)',
					discTileStart: '#FFA500',
					discTileEnd: '#FFFF00',
					discLines: '#FFFFFF',
					discHover: 'rgba(255,255,255,0.2)',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(255,255,255,0.2)',
					menuHighlight: '#FFA500',
					menuSectionalBackground: 'rgba(255,0,0,0.1)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerFill: 'rgba(255,255,255,0.3)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 3,
					backgroundImage: "url('img/3.jpg')",
					discBorder1: 'rgba(0,0,0,1)',
					discBorder2: 'rgba(0,0,0,0)',
					discTileStart: '#FF0000',
					discTileEnd: '#0000FF',
					discLines: '#FFFFFF',
					discHover: 'rgba(0,0,0,0.2)',
					discFont: '#000000',
					discPlayLine: 'rgba(0,0,0,0.5)',
					menuHighlight: '#FFFFFF',
					menuSectionalBackground: 'rgba(255,255,255,0.1)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerFill: 'rgba(255,255,255,0.3)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 4,
					backgroundImage: "url('img/4.jpg')",
					discBorder1: 'rgba(255,100,100,1)',
					discBorder2: 'rgba(255,255,100,0.5)',
					discTileStart: '#FFFF00',
					discTileEnd: '#FFFFFF',
					discLines: '#FFFFFF',
					discHover: 'rgba(0,0,0,0.2)',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(0,0,0,0.5)',
					menuHighlight: '#cdcdcd',
					menuSectionalBackground: 'rgba(255,255,0,0.4)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerFill: 'rgba(255,255,255,0.3)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 5,
					backgroundImage: "url('img/6.jpg')",
					discBorder1: 'rgba(255,255,255,1)',
					discBorder2: 'rgba(0,0,0,0.5)',
					discTileStart: '#FFFFFF',
					discTileEnd: '#FFFFFF',
					discLines: '#000000',
					discHover: 'rgba(0,0,0,0.6)',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(0,0,0,0.3)',
					menuHighlight: '#FFFFFF',
					menuSectionalBackground: 'rgba(255,255,255,0.1)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerFill: 'rgba(255,255,255,0.3)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				}
			]
		};
		service.theme = service.themes[localStorageService.storage ? localStorageService.storage.themeIndex : 0];

		return service;

	}

})();