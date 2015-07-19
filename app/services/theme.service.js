(function () {
	'use strict';

	angular
		.module('discSynth')
		.factory('themeService', themeService);

	themeService.$inject = ['$localStorage'];
	function themeService($localStorage) {

		var service = {
			setTheme: setTheme,
			themes: [
				{
					index: 0,
					backgroundImage: "url('img/1.jpg')",
					discBorder1: '#EECBAD',
					discBorder2: 'rgba(255,255,100,0.5)',
					discTile: '#FFFF00',
					discLines: '#FFFFFF',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(0,50,50,0.6)',
					menuHighlight: '#FFFF99',
					menuSectionalBackground: 'rgba(255,255,255,0.1)',
					centerBorder: 'rgba(0,0,0,0.7)',
					centerPlay: 'rgba(255,0,0,0.4)',
					centerStop: 'rgba(0,255,0,0.4)',
					centerText: '#000000'
				},
				{
					index: 1,
					backgroundImage: "url('img/2.jpg')",
					discBorder1: 'rgba(0,0,0,0.5)',
					discBorder2: 'rgba(255,255,255,0.5)',
					discTile: '#00FF00',
					discLines: '#FFFFFF',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(255,255,255,0.2)',
					menuHighlight: '#a5FFa5',
					menuSectionalBackground: 'rgba(100,255,100,0.3)',
					centerBorder: 'rgba(0,0,0,0.7)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 2,
					backgroundImage: "url('img/3.jpg')",
					discBorder1: 'rgba(0,0,0,1)',
					discBorder2: 'rgba(0,0,0,0.5)',
					discTile: '#00A5FF',
					discLines: '#FFFFFF',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(255,255,255,0.2)',
					menuHighlight: '#00A5FF',
					menuSectionalBackground: 'rgba(100,100,255,0.3)',
					centerBorder: 'rgba(0,0,0,0.7)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 3,
					backgroundImage: "url('img/4.jpg')",
					discBorder1: 'rgba(0,0,0,1)',
					discBorder2: 'rgba(0,0,0,0)',
					discTile: '#00FF66',
					discLines: '#FFFFFF',
					discFont: '#000000',
					discPlayLine: 'rgba(0,0,0,0.5)',
					menuHighlight: '#FFFFFF',
					menuSectionalBackground: 'rgba(255,255,255,0.1)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerPlay: 'rgba(255,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 4,
					backgroundImage: "url('img/5.jpg')",
					discBorder1: 'rgba(0,0,0,0.5)',
					discBorder2: 'rgba(0,0,0,0.5)',
					discTile: '#a5FFa5',
					discLines: '#FFFFFF',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(0,0,0,0.5)',
					menuHighlight: '#a5FFa5',
					menuSectionalBackground: 'rgba(100,255,100,0.2)',
					centerBorder: 'rgba(0,0,0,0.5)',
					centerPlay: 'rgba(16,0,0,0.2)',
					centerStop: 'rgba(0,255,0,0.2)',
					centerText: '#000000'
				},
				{
					index: 5,
					backgroundImage: "url('img/6.jpg')",
					discBorder1: 'rgba(255,255,255,1)',
					discBorder2: 'rgba(0,0,0,0.5)',
					discTile: '#cccccc',
					discLines: '#000000',
					discFont: '#FFFFFF',
					discPlayLine: 'rgba(255,255,255,0.3)',
					menuHighlight: '#FFFFFF',
					menuSectionalBackground: 'rgba(255,255,255,0.1)',
					centerBorder: 'rgba(255,255,255,0.7)',
					centerPlay: 'rgba(100,100,100,0.2)',
					centerStop: 'rgba(255,255,255,0.2)',
					centerText: '#000000'
				}
			]
		};

		service.setTheme();

		return service;

		////////////////////////////////

		function setTheme() {
			service.theme = service.themes[$localStorage.themeIndex];
		}

	}
})();