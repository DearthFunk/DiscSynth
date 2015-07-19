(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('discDirective', disc);

	function disc() {
		var directive = {
			restrict: 'EA',
			controller: discController,
			bindToController: true,
			replace: true,
			template: '<canvas data-ng-mousedown="mouseDownEvent($event)"></canvas>'
		};
		return directive;
	}

	discController.$inject = ['$scope', '$element', '$window', '$localStorage', 'MENU_SIZE', 'themeService', 'genColors', 'audioService'];
	function discController($scope, $element, $window, $localStorage, MENU_SIZE, themeService, genColors, audioService) {

		var rad = 0;
		var ctx = $element[0].getContext('2d');
		var midX, midY, angleSize, distanceFromCenter, hoverRing, hoverDisc, ringSelect, discSelect, mouseDownY, startFreq, centerButtonSize;

		$scope.reCalculateDiscs = reCalculateDiscs;
		$scope.calculateStateData = calculateStateData;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.mouseDownEvent = mouseDownEvent;
		$scope.windowResize = windowResize;
		$scope.draw = draw;
		$scope.$localStorage = $localStorage;

		$scope.$watch('$localStorage.discLength', $scope.reCalculateDiscs);
		angular.element($window).bind("resize",$scope.windowResize);

		$scope.windowResize();
		$scope.draw();

		////////////////////////////////////////////////////

		function reCalculateDiscs() {
			angleSize = (1 / $localStorage.discLength) * Math.PI * 2;
			for (var i = 0; i < audioService.slice.length; i++) {
				var theDisc = audioService.slice[i];
				theDisc.a1 = angleSize * i;
				theDisc.a2 = angleSize * (i + 1);
				for (var d = 0; d < 4; d++) {
					var sliceRad = (d + 3) / 6 * rad;
					theDisc.osc[d].x = midX + sliceRad * Math.cos(theDisc.a1);
					theDisc.osc[d].y = midY + sliceRad * Math.sin(theDisc.a1);
					theDisc.osc[d].rad = sliceRad;
				}
			}
		}
		function calculateStateData(e) {
			distanceFromCenter = Math.sqrt(Math.pow(e.clientX - midX, 2) + Math.pow(e.clientY - midY, 2));
			if (distanceFromCenter < rad && distanceFromCenter > rad / 2) {
				for (var layer = 0; layer < audioService.slice[0].osc.length - 1; layer++) {
					var d1 = (layer + 3) / 6 * rad;
					var d2 = (layer + 4) / 6 * rad;
					if (distanceFromCenter > d1 && distanceFromCenter < d2) {
						hoverRing = layer;
						break;
					}
				}
				var angle = Math.atan2(midY - e.clientY, midX - e.clientX) + Math.PI;
				for (var i = 0; i < audioService.slice.length - 1; i++) {
					if (angle > audioService.slice[i].a1 && angle < audioService.slice[i].a2) {
						hoverDisc = i;
						break;
					}
				}
			}
			else {
				hoverRing = -1;
				hoverDisc = -1;
			}
		}

		////////////////////////////////////////////////////

		function mouseUpEvent() {
			angular.element($window).unbind('mousemove', $scope.mouseMoveEvent);
			angular.element($window).unbind('mouseup', $scope.mouseUpEvent);
			ringSelect = -1;
			discSelect = -1;
		}
		function mouseMoveEvent(e) {
			$scope.calculateStateData(e);
			if (ringSelect > -1 && discSelect > -1) {
				var newFreq = startFreq + ((mouseDownY - e.clientY) * 2);
				audioService.slice[discSelect].osc[ringSelect].freq = newFreq < 0 ? 0 : newFreq > audioService.maxFreq ? audioService.maxFreq : newFreq;
			}
		}
		function mouseDownEvent(e) {
			angular.element($window).bind('mousemove', $scope.mouseMoveEvent);
			angular.element($window).bind('mouseup',$scope.mouseUpEvent);
			$scope.calculateStateData(e);
			if (distanceFromCenter < centerButtonSize) {
				audioService.startStop();
			}
			else if (distanceFromCenter < rad && distanceFromCenter > rad / 2) {
				var cell = audioService.slice[hoverDisc].osc[hoverRing];
				cell.active = !cell.active;
				ringSelect = hoverRing;
				discSelect = hoverDisc;
				mouseDownY = e.clientY;
				startFreq = cell.freq;
			}
		}
		function windowResize() {
			var w = $window.innerWidth - MENU_SIZE;
			var h = $window.innerHeight;
			ctx.canvas.style.width = w + 'px';
			ctx.canvas.style.height = h + 'px';
			ctx.canvas.width = w;
			ctx.canvas.height = h;
			midX = w / 2;
			midY = h / 2;
			rad = midY - 10;
			centerButtonSize = rad / 3;
			$scope.reCalculateDiscs();
		}

		/////////////////////////////////////////////////////////////////

		function draw() {
			requestAnimationFrame($scope.draw);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			for (var i = 0; i < audioService.slice.length - 1; i++) {
				var disc1 = audioService.slice[i];
				var disc2 = audioService.slice[i + 1];
				for (var layer = 0; layer < disc1.osc.length - 1; layer++) {
					if (i < $localStorage.discLength) {
						ctx.beginPath();
						ctx.lineWidth = 1;
						ctx.moveTo(disc1.osc[layer].x, disc1.osc[layer].y);
						ctx.arc(midX, midY, disc1.osc[layer].rad, disc1.a1, disc1.a2, false);
						ctx.lineTo(disc2.osc[layer + 1].x, disc2.osc[layer + 1].y);
						ctx.arc(midX, midY, disc1.osc[layer + 1].rad, disc1.a2, disc1.a1, true);
						ctx.lineTo(disc1.osc[layer].x, disc1.osc[layer].y);

						if (disc1.osc[layer].active && i === audioService.clickTrack) {
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = genColors.convert.rgba(themeService.theme.discTile, 0.7);
							ctx.fill();
						}
						if (disc1.osc[layer].active) {
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = genColors.convert.rgba(themeService.theme.discTile, 0.4);
							ctx.fill();
						}
						else if (i === audioService.clickTrack) {
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = themeService.theme.discPlayLine;
							ctx.fill();
						}
						else {
							ctx.strokeStyle = genColors.convert.rgba(themeService.theme.discLines, 0.2);
						}
						ctx.stroke();
						ctx.closePath();
						ctx.beginPath();
						ctx.font = '16px Times New Roman';
						ctx.fillStyle = themeService.theme.discFont;

						var a = (disc1.a2 - disc1.a1) * i + (angleSize / 2);
						var r = (disc1.osc[layer].rad + disc1.osc[layer + 1].rad) / 2;
						var x = midX + (r) * Math.cos(a);
						var y = midY + (r) * Math.sin(a);

						ctx.fillText(disc1.osc[layer].freq, x, y);
						ctx.closePath();
					}
				}
			}

			//MAIN DISC BORDER
			ctx.lineWidth = 2;
			ctx.strokeStyle = themeService.theme.discBorder1;
			ctx.beginPath();
			ctx.arc(midX, midY, rad + 1, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(midX, midY, rad / 2 - 2, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.closePath();

			//CENTER PLAY BUTTON
			ctx.beginPath();
			ctx.fillStyle = audioService.playing ? themeService.theme.centerPlay : themeService.theme.centerStop;
			ctx.arc(midX, midY, centerButtonSize, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(midX, midY, centerButtonSize + 5, 0, Math.PI * 2, false);
			ctx.lineWidth = 0.5;
			ctx.strokeStyle = themeService.theme.centerBorder;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.font = '60px Keys';
			ctx.fontWeight = 'bold';
			ctx.lineWidth = 50;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = themeService.theme.centerText;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			ctx.shadowBlur = 3;
			ctx.shadowColor = '#FFFFFF';
			ctx.fillText(audioService.playing ? 'STOP' : 'PLAY', midX, midY);
			ctx.closePath();
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
		}
	}
})();
