(function () {
	'use strict';

	angular
		.module('discSynth', [
			'ngStorage',
			'animationModule',
			'menuModule'
		])
		.controller('discController', discController)
		.run(function($localStorage){
			$localStorage.$default({
				themeIndex: 0,
				synthIndex: 0,
				animationIndex: 0,
				discLength: 16,
				volume: 0.5,
				speed: 0.5
			});
		});

	discController.$inject = ['$scope', 'themeService'];

	function discController($scope, themeService) {
		$scope.themeService = themeService;
	}

})();
(function () {
	'use strict';

	angular
		.module('discSynth')
		.directive('animationDirective', animation);

	function animation() {
		var directive = {
			restrict: 'EA',
			template: '<canvas class="animation"></canvas>',
			replace: true,
			controller: animationController,
			bindToController: true
		};
		return directive;
	}

	animationController.$inject = ['$scope', '$element', '$window', '$localStorage', 'animationService', 'audioService', 'MENU_SIZE'];
	function animationController($scope, $element, $window, $localStorage, animationService, audioService, MENU_SIZE) {

		var cnv = $element[0];
		var ctx = cnv.getContext('2d');
		var state = {
			w: 0,
			h: 0,
			xCenter: 0,
			yCenter: 0
		};

		$scope.windowResize = windowResize;
		$scope.clearCanvas = clearCanvas;
		$scope.animate = animate;
		angular.element($window).bind('resize', $scope.windowResize);

		$scope.windowResize();
		$scope.animate();

		/////////////////////////////////////////////

		function windowResize() {
			state.w = $window.innerWidth - MENU_SIZE;
			state.h = $window.innerHeight;
			state.xCenter = state.w/2;
			state.yCenter = state.h/2;
			cnv.style.width = state.w +'px';
			cnv.style.height = state.h + 'px';
			angular.element(cnv).attr({width: state.w, height: state.h });
		}

		function clearCanvas() {
			ctx.clearRect(0, 0, state.w, state.h);
		}

		function animate() {
			requestAnimationFrame(animate);
			if (animationService.animation) {
				$scope.clearCanvas();
				if (animationService.animation.service) {
					animationService.animation.service.draw(ctx, state, audioService.getAverageDB(), $localStorage.discLength, audioService.clickTrack);
				}

			}
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('animationModule',[])
		.service('animationService', animationService);

	animationService.$inject = ['$localStorage', 'crazy', 'burst', 'mathMachine', 'particles', 'tunnel'];

	function animationService($localStorage, crazy, burst, mathMachine, particles, tunnel) {

		var service = {
			setAnimation: setAnimation,
			animations: [
				{index: 0, service: false},
				{index: 1, service: crazy},
				{index: 2, service: burst},
				{index: 3, service: mathMachine},
				{index: 4, service: particles},
				{index: 5, service: tunnel}
			]
		};

		service.setAnimation();

		return service;

		/////////////////////////////////

		function setAnimation() {
			service.animation = service.animations[$localStorage.animationIndex];
		}

	}
})();
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

(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('ngRightClick', ngRightClick);

	function ngRightClick($parse) {
		function returnFunction(scope, element, attrs) {
			var fn = $parse(attrs.ngRightClick);
			element.bind('contextmenu', contextMenuFunction);

			function contextMenuFunction(event) {
				function scopeApply() {
					event.preventDefault();
					fn(scope, {$event: event});
				}
				scope.$apply(scopeApply);
			}
		}
		return returnFunction;
	}

})();
(function () {
	'use strict';
	angular
		.module('menuModule', [])
		.directive('menu', menu)
		.constant('MENU_SIZE', 220)
		.constant('LENGTH_CONSTRAINTS', {MIN: 4, MAX: 32});

	menu.$inject = [];

	function menu() {
		var directive = {
			restrict: 'C',
			templateUrl: 'CACHE/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope', '$timeout', '$localStorage', 'themeService', 'animationService', 'MENU_SIZE', 'audioService', 'SYNTHS', 'LENGTH_CONSTRAINTS'];

	function menuController($scope, $timeout, $localStorage, themeService, animationService, MENU_SIZE, audioService, SYNTHS, LENGTH_CONSTRAINTS) {

		$scope.themeService = themeService;
		$scope.audioService = audioService;
		$scope.animationService = animationService;
		$scope.menuSize = MENU_SIZE;
		$scope.LENGTH_CONSTRAINTS = LENGTH_CONSTRAINTS;
		$scope.$localStorage = $localStorage;

		$scope.changeTheme = changeTheme;
		$scope.changeSynth = changeSynth;
		$scope.changeAnimaton = changeAnimaton;

		$scope.editingVol = false;
		$scope.editingSpd = false;
		$scope.editingLen = false;
		$scope.showHelpWindow = false;
		$scope.showImportExportWindow = false;

		$scope.resetSynth = resetSynth;

		////////////////////////////////////////////////

		function changeTheme(index) {
			$localStorage.themeIndex = index;
			themeService.setTheme();
		}

		function changeAnimaton(index) {
			$localStorage.animationIndex = index;
			animationService.setAnimation();
		}

		function changeSynth(index) {
			$localStorage.synthIndex = index;
			audioService.setSynthTemplate();
		}

		function resetSynth(index) {
			audioService.synthTemplates[index] = angular.copy(SYNTHS[index]);
			if (index === $localStorage.synthIndex) {
				audioService.synthTemplate = audioService.synthTemplates[index];
			}
			$scope.resetIndex = index;
			$timeout(function () {
				$scope.resetIndex = -1;
			}, 400)
		}

	}
})();
(function () {
	'use strict';
	angular
		.module('discSynth')
		.factory('audioService', audioService)
		.constant('SYNTHS', [
			{
				index: 0,
				osc1: {type: 'sine', detune: -400},
				osc2: {type: 'square', detune: 0},
				osc3: {type: 'sawtooth', detune: 1675},
				bitcrusher: {bypass: false, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: true,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.5,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: true, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 5910.5, cutoff: 0.552, resonance: 3.8},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 100},
				convolver: {bypass: true, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 1,
				osc1: {type: 'square', detune: -925},
				osc2: {type: 'square', detune: 0},
				osc3: {type: 'sawtooth', detune: -925},
				bitcrusher: {bypass: false, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.5,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: true, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 5910.4, cutoff: 0.552, resonance: 3.8},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 30},
				convolver: {bypass: false, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 2,
				osc1: {type: 'square', detune: -1000},
				osc2: {type: 'sine', detune: 200},
				osc3: {type: 'sine', detune: 1000},
				bitcrusher: {bypass: true, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 0.7,
					dryLevel: 1,
					feedback: 0.68,
					delayTime: 0.8,
					cutoff: 20000
				},
				overdrive: {bypass: false, curveAmount: 0.95, drive: 0.95, outputGain: 1},
				moogfilter: {bypass: true, bufferSize: 5910.4, cutoff: 0.552, resonance: 3.8},
				tremolo: {bypass: true, intensity: 0.831, rate: 0.594, stereoPhase: 0},
				convolver: {bypass: true, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 3,
				osc1: {type: 'square', detune: 0},
				osc2: {type: 'square', detune: 0},
				osc3: {type: 'sawtooth', detune: 0},
				bitcrusher: {bypass: true, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: true,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.4,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: false, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: true, bufferSize: 4096, cutoff: 0.065, resonance: 3.5},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 180},
				convolver: {bypass: false, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 4,
				osc1: {type: 'sine', detune: 0},
				osc2: {type: 'sine', detune: 600},
				osc3: {type: 'sine', detune: 0},
				bitcrusher: {bypass: true, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 1,
					dryLevel: 0,
					feedback: 0.7,
					delayTime: 0.5,
					cutoff: 3752.875
				},
				overdrive: {bypass: true, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 1777.6, cutoff: 0.215, resonance: 0.525},
				tremolo: {bypass: true, intensity: 0.875, rate: 1, stereoPhase: 0},
				convolver: {bypass: false, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			},
			{
				index: 5,
				osc1: {type: 'square', detune: -1175},
				osc2: {type: 'sawtooth', detune: 475},
				osc3: {type: 'triangle', detune: -475},
				bitcrusher: {bypass: false, bits: 4, bufferSize: 4096, normFreq: 0},
				delay: {
					bypass: false,
					wetLevel: 0.5,
					dryLevel: 1,
					feedback: 0.4,
					delayTime: 0.1,
					cutoff: 20000
				},
				overdrive: {bypass: false, curveAmount: 0.725, drive: 1, outputGain: 1},
				moogfilter: {bypass: false, bufferSize: 12260.8, cutoff: 0.252, resonance: 0.55},
				tremolo: {bypass: true, intensity: 0.3, rate: 5, stereoPhase: 0},
				convolver: {bypass: true, highCut: 22050, lowCut: 20, dryLevel: 1, wetLevel: 1}
			}
		]);

	audioService.$inject =['$localStorage', 'genColors', 'SYNTHS', 'LENGTH_CONSTRAINTS', '$timeout'];

	function audioService($localStorage, genColors, SYNTHS, LENGTH_CONSTRAINTS, $timeout) {
		var audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() : null;
		var audioBufferSize = 1024;
		var tuna = new Tuna(audioCtx);
		var nextNoteTime = null;
		var clickPromise = null;
		var service = {
			playing: false,
			synthTemplates: angular.copy(SYNTHS), //localStorageService.storage ? localStorageService.storage.synthTemplates : angular.copy(SYNTHS),
			node : {},
			fx: {},
			clickTrack: 0,
			slice: [],
			maxFreq: 1500,
			randomize: randomize,
			startStop: startStop,
			playNotes: playNotes,
			clickTrackPlayer: clickTrackPlayer,
			getAverageDB: getAverageDB,
			setSynthTemplate: setSynthTemplate,
			updateSynthTemplate: updateSynthTemplate,
			setupAudioNodesAndDiscSlices: setupAudioNodesAndDiscSlices
		};

		service.setupAudioNodesAndDiscSlices();
		service.synthTemplate = service.synthTemplates[$localStorage.synthIndex];

		return service;

		/////////////////////////////////////

		function updateSynthTemplate() {
			var template = service.synthTemplate;
			var fx = service.fx;
			var node = service.node;
			template.osc1.type = node.osc1.type;
			template.osc1.detune = node.osc1.detune.value;
			template.osc2.type = node.osc2.type;
			template.osc2.detune = node.osc2.detune.value;
			template.osc3.type = node.osc3.type;
			template.osc3.detune = node.osc3.detune.value;
			template.bitcrusher.bypass = fx.bitcrusher.bypass;
			template.bitcrusher.bits = fx.bitcrusher.bits;
			template.bitcrusher.bufferSize = fx.bitcrusher.bufferSize;
			template.bitcrusher.normFreq = fx.bitcrusher.normFreq;
			template.delay.bypass = fx.delay.bypass;
			template.delay.wetLevel = fx.delay.wetLevel.value;
			template.delay.dryLevel = fx.delay.dryLevel.value;
			template.delay.feedback = fx.delay.feedback.value;
			template.delay.delayTime = fx.delay.delayTime.value;
			template.delay.cutoff = fx.delay.cutoff.value;
			template.overdrive.bypass = fx.overdrive.bypass;
			template.overdrive.curveAmount = fx.overdrive.curveAmount;
			template.overdrive.drive = fx.overdrive.drive.value;
			template.overdrive.outputGain = fx.overdrive.outputGain.value;
			template.moogfilter.bypass = fx.moogfilter.bypass;
			template.moogfilter.bufferSize = fx.moogfilter.bufferSize;
			template.moogfilter.cutoff = fx.moogfilter.cutoff;
			template.moogfilter.resonance = fx.moogfilter.resonance;
			template.tremolo.bypass = fx.tremolo.bypass;
			template.tremolo.intensity = fx.tremolo.intensity;
			template.tremolo.rate = fx.tremolo.rate;
			template.tremolo.stereoPhase = fx.tremolo.stereoPhase;
			template.convolver.bypass = fx.convolver.bypass;
			template.convolver.highCut = fx.convolver.highCut.value;
			template.convolver.lowCut = fx.convolver.lowCut.value;
			template.convolver.dryLevel = fx.convolver.dryLevel.value;
			template.convolver.wetLevel = fx.convolver.wetLevel.value;
		}

		function setSynthTemplate() {
			service.updateSynthTemplate();
			service.synthTemplate = service.synthTemplates[$localStorage.synthIndex];
			var template = service.synthTemplate;
			var fx = service.fx;
			var node = service.node;
			node.osc1.type =template.osc1.type;
			node.osc1.detune.value = template.osc1.detune;
			node.osc2.type = template.osc2.type;
			node.osc2.detune.value = template.osc2.detune;
			node.osc3.type = template.osc3.type;
			node.osc3.detune.value = template.osc3.detune;
			fx.bitcrusher.bypass = template.bitcrusher.bypass;
			fx.bitcrusher.bits = template.bitcrusher.bits;
			fx.bitcrusher.bufferSize = template.bitcrusher.bufferSize;
			fx.bitcrusher.normFreq = template.bitcrusher.normFreq;
			fx.delay.bypass = template.delay.bypass;
			fx.delay.wetLevel = template.delay.wetLevel;
			fx.delay.dryLevel = template.delay.dryLevel;
			fx.delay.feedback = template.delay.feedback;
			fx.delay.delayTime = template.delay.delayTime;
			fx.delay.cutoff = template.delay.cutoff;
			fx.overdrive.bypass = template.overdrive.bypass;
			fx.overdrive.curveAmount = template.overdrive.curveAmount;
			fx.overdrive.drive = template.overdrive.drive;
			fx.overdrive.outputGain = template.overdrive.outputGain;
			fx.moogfilter.bypass = template.moogfilter.bypass;
			fx.moogfilter.bufferSize = template.moogfilter.bufferSize;
			fx.moogfilter.cutoff = template.moogfilter.cutoff;
			fx.moogfilter.resonance = template.moogfilter.resonance;
			fx.tremolo.bypass = template.tremolo.bypass;
			fx.tremolo.intensity = template.tremolo.intensity;
			fx.tremolo.rate = template.tremolo.rate;
			fx.tremolo.stereoPhase = template.tremolo.stereoPhase;
			fx.convolver.bypass = template.convolver.bypass;
			fx.convolver.highCut = template.convolver.highCut;
			fx.convolver.lowCut = template.convolver.lowCut;
			fx.convolver.dryLevel = template.convolver.dryLevel;
			fx.convolver.wetLevel = template.convolver.wetLevel;
		}

		function randomize() {
			for (var discIndex = 0; discIndex < service.slice.length - 1; discIndex++) {
				for (var layer = 0; layer < service.slice[discIndex].osc.length; layer++) {
					var cell = service.slice[discIndex].osc[layer];
					cell.active = genColors.get.randomNumber(1,3,0) === 1;
					if (cell.active) {
						cell.freq = genColors.get.randomNumber(20, service.maxFreq, 0);
					}
				}
			}
		}

		function getAverageDB() {
			var dbArray = new Uint8Array(service.node.analyser.frequencyBinCount);
			service.node.analyser.getByteFrequencyData(dbArray);
			var values = 0;
			for (var i = 0; i < dbArray.length; i++) {
				values += dbArray[i];
			}
			return values / dbArray.length;
		}

		function clickTrackPlayer() {
			while (nextNoteTime < audioCtx.currentTime + 0.1 ) {
				var speed = parseInt($localStorage.speed);
				nextNoteTime += 1.1 - speed;

				if (service.playing) {
					service.clickTrack++;
				}
				if (service.clickTrack >= service.discLength) {
					service.clickTrack = 0;
				}

				if (service.playing) {
					service.playNotes();
				}
			}
			clickPromise = $timeout(service.clickTrackPlayer, 25);
		}

		function startStop() {
			service.playing = !service.playing;
			service.node.stopperGain.gain.value = service.playing ? 1 : 0;
		}

		function playNotes() {
			var osc1 = service.slice[service.clickTrack].osc[0];
			var osc2 = service.slice[service.clickTrack].osc[1];
			var osc3 = service.slice[service.clickTrack].osc[2];
			service.node.osc1.frequency.value = !service.playing ? 0 : osc1.active ? osc1.freq : 0;
			service.node.osc2.frequency.value = !service.playing ? 0 : osc2.active ? osc2.freq : 0;
			service.node.osc3.frequency.value = !service.playing ? 0 : osc3.active ? osc3.freq : 0;
		}

		function setupAudioNodesAndDiscSlices() {
			for (var i = 0; i <= LENGTH_CONSTRAINTS.MAX; i++) {
				service.slice.push({
					a1: 0,
					a2: 0,
					c: '',
					osc: [
						{x: 0, y: 0, rad: 0, active: false, freq: 200},
						{x: 0, y: 0, rad: 0, active: false, freq: 600},
						{x: 0, y: 0, rad: 0, active: false, freq: 1400},
						{x: 0, y: 0, rad: 0, active: false, freq: -1}
					]
				});
			}

			service.node.osc1 = audioCtx.createOscillator();
			service.node.osc2 = audioCtx.createOscillator();
			service.node.osc3 = audioCtx.createOscillator();
			service.node.masterGain = audioCtx.createGain();
			service.node.stopperGain = audioCtx.createGain();
			service.node.masterGain.gain.value = $localStorage.volume;
			service.node.stopperGain.gain.value = 1;

			service.node.javascript = audioCtx.createScriptProcessor(audioBufferSize, 0, 1);
			service.node.analyser = audioCtx.createAnalyser();

			service.fx.moogfilter = new tuna.MoogFilter();
			service.fx.tremolo = new tuna.Tremolo();
			service.fx.convolver = new tuna.Convolver();
			service.fx.delay = new tuna.Delay();
			service.fx.overdrive = new tuna.Overdrive();
			service.fx.overdrive.algorithmIndex = 5;
			service.fx.bitcrusher = new tuna.Bitcrusher();

			service.node.osc1.connect(service.fx.moogfilter.input);
			service.node.osc2.connect(service.fx.moogfilter.input);
			service.node.osc3.connect(service.fx.moogfilter.input);
			service.fx.moogfilter.connect(service.fx.overdrive.input);
			service.fx.overdrive.connect(service.fx.bitcrusher.input);
			service.fx.bitcrusher.connect(service.fx.tremolo.input);
			service.fx.tremolo.connect(service.fx.convolver.input);
			service.fx.convolver.connect(service.fx.delay.input);
			service.fx.delay.connect(service.node.masterGain);

			service.node.masterGain.connect(service.node.stopperGain);
			service.node.stopperGain.connect(service.node.analyser);
			service.node.stopperGain.connect(audioCtx.destination);

			service.node.analyser.smoothingTimeConstant = 0.3;
			service.node.analyser.fftSize = audioBufferSize / 2;
			service.node.analyser.connect(service.node.javascript);
			service.node.javascript.connect(audioCtx.destination);
			service.node.osc1.frequency.value = 0;
			service.node.osc2.frequency.value = 0;
			service.node.osc3.frequency.value = 0;

			service.node.osc1.start();
			service.node.osc2.start();
			service.node.osc3.start();

			nextNoteTime = audioCtx.currentTime;
			service.clickTrackPlayer();
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('discSynth')
		.factory('genColors', genColors)
		.constant('COLOR_TYPE', {
			HEX: 0,
			RGB: 1,
			RGBA: 2,
			HSL: 3,
			HSLA: 4
		})
		.constant('RETURN_TYPE', {
			STRING: 0,
			ARRAY: 1,
			OBJECT: 2
		});

	genColors.$inject = ['COLOR_TYPE', 'RETURN_TYPE'];

	function genColors(COLOR_TYPE, RETURN_TYPE) {

		var factory = {
			get: {
				colorType: getColorType,
				values: getValues,
				randomNumber: getRandomNumber,
				roundedNumber: getRoundedNumber
			},
			random: {
				hex: randomHex,
				rgb: randomRgb,
				rgba: randomRgba,
				hsl: randomHsl,
				hsla: randomHsla
			},
			randomBetween: {
				hex: randomBetweenHex,
				rgb: randomBetweenRgb,
				rgba: randomBetweenRgba,
				hsl: randomBetweenHsl,
				hsla: randomBetweenHsla
			},
			convert: {
				numberToHex: convertNumberToHex,
				hexToNumber: convertHexToNumber,
				hex: convertHex,
				rgb: convertRgb,
				rgba: convertRgba,
				hsl: convertHsl,
				hsla: convertHsla
			},
			between: {
				hex: betweenHex,
				rgb: betweenRgb,
				rgba: betweenRgba,
				hsl: betweenHsl,
				hsla: betweenHsla
			},
			array: {
				hex: arrayHex,
				rgb: arrayRgb,
				rgba: arrayRgba,
				hsl: arrayHsl,
				hsla: arrayHsla
			}
		};

		return factory;

		////////////////////////////////////////////////////////

		function getColorType(color) {
			var c = color.slice(0, 4).toLowerCase();
			return (color[0] === '#' ? COLOR_TYPE.HEX :
				c === 'rgb(' ? COLOR_TYPE.RGB :
					c === 'rgba' ? COLOR_TYPE.RGBA :
						c === 'hsl(' ? COLOR_TYPE.HSL :
							c === 'hsla' ? COLOR_TYPE.HSLA :
								false
			)
		}

		function getValues(color, returnType, hslPercentage) {
			color = color.toUpperCase();
			var obj = {};
			var returnVal, vals, keys;
			var colorType = factory.get.colorType(color);
			if (colorType === COLOR_TYPE.HEX) {
				var arr = color.slice(1).split('').slice(0, 3);
				vals = color.length < 7 ?
					[arr[0] + arr[0], arr[1] + arr[1], arr[2] + arr[2]] :
					color.slice(1).match(/.{1,2}/g);
				keys = ['r', 'g', 'b'];
			}
			else {
				vals = color.replace(/([(])/g, ',').replace(/([)])/g, '').split(',');
				keys = vals[0].toLowerCase().split('');
				vals.splice(0, 1);
			}
			for (var i = 0; i < keys.length; i++) {
				if (colorType === COLOR_TYPE.HEX) {
					obj[keys[i]] = vals[i];
				}
				else if (vals[i].indexOf('%') > -1) {
					if (hslPercentage) {
						vals[i] = Number(vals[i].replace('%', '')) / 100;
					}
					obj[keys[i]] = vals[i];
				}
				else {
					obj[keys[i]] = Number(vals[i]);
					vals[i] = Number(vals[i]);
				}
			}
			switch (returnType) {
				case RETURN_TYPE.STRING:
					returnVal = color;
					break;
				case RETURN_TYPE.ARRAY:
					returnVal = vals;
					break;
				case RETURN_TYPE.OBJECT:
					returnVal = angular.copy(obj);
					break;
				default:
					returnVal = color;
			}
			return returnVal
		}

		function getRandomNumber(from, to, decimals) {
			return angular.isDefined(decimals) ?
				Number((Math.random() * (Number(to) - Number(from)) + Number(from)).toFixed(decimals)) :
				Number(Math.random() * (to - from) + from)
		}

		function getRoundedNumber(value, decimals) {
			var precision = decimals || 0;
			var neg = value < 0;
			var power = Math.pow(10, precision);
			var newvalue = Math.round(value * power);
			var integral = String((neg ? Math.ceil : Math.floor)(newvalue / power));
			var fraction = String((neg ? -newvalue : newvalue) % power);
			var padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
			return parseFloat(precision ? integral + '.' + padding + fraction : integral);
		}

		function randomHex(type, greyScale) {
			var returnVal;
			if (greyScale) {
				var hex =
					factory.get.randomNumber(0, 15, 0).toString(16).toUpperCase() +
					factory.get.randomNumber(0, 15, 0).toString(16).toUpperCase();
				returnVal = '#' + hex + hex + hex;
			}
			else {
				returnVal = '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6).toUpperCase();
			}
			return factory.get.values(returnVal, type);
		}

		function randomRgb(type, greyScale) {
			var r = factory.get.randomNumber(0, 255, 0);
			var g = greyScale ? r : factory.get.randomNumber(0, 255, 0);
			var b = greyScale ? r : factory.get.randomNumber(0, 255, 0);
			return factory.get.values('rgb(' + r + ',' + b + ',' + g + ')', type);
		}

		function randomHsl(type, greyScale) {
			var h = factory.get.randomNumber(0, 240, 0);
			var s = greyScale ? '0%' : factory.get.randomNumber(0, 100, 0) + '%';
			var l = factory.get.randomNumber(0, 100, 0) + '%';
			return factory.get.values('HSL(' + h + ',' + s + ',' + l + ')', type);
		}

		function randomRgba(type, greyScale, opacity) {
			var r = factory.get.randomNumber(0, 255, 0);
			var g = greyScale ? r : factory.get.randomNumber(0, 255, 0);
			var b = greyScale ? r : factory.get.randomNumber(0, 255, 0);
			var a = angular.isUndefined(opacity) ? factory.get.randomNumber(0, 1, 4) : opacity;
			return factory.get.values('RGBA(' + r + ',' + g + ',' + b + ',' + a + ')', type);
		}

		function randomHsla(type, greyScale, opacity) {
			var h = factory.get.randomNumber(0, 240, 0);
			var s = greyScale ? '0%' : factory.get.randomNumber(0, 100, 0) + '%';
			var l = factory.get.randomNumber(0, 100, 0) + '%';
			var a = angular.isUndefined(opacity) ? factory.get.randomNumber(0, 1, 4) : opacity;
			return factory.get.values('HSLA(' + h + ',' + s + ',' + l + ',' + a + ')', type);
		}

		function convertNumberToHex(x) {
			return x >= 0 && x <= 255 ? ('0' + parseInt(x).toString(16)).slice(-2).toUpperCase() : '00'
		}

		function convertHexToNumber(x) {
			var tmp = x.replace(/[^a-f,0-9]/ig, '');
			return tmp === '' ? 0 : parseInt(tmp, 16);
		}

		function convertHex(color) {
			color = color.toUpperCase();
			var returnVal;
			var colorType = factory.get.colorType(color);
			var vals = factory.get.values(color, RETURN_TYPE.ARRAY, true);
			if (colorType === COLOR_TYPE.HEX) {
				if (color.length === 7) {
					returnVal = color;
				}
				else if (color.length === 4) {
					var tmp = color.split('');
					returnVal = '#' + tmp[1] + tmp[1] + tmp[2] + tmp[2] + tmp[3] + tmp[3];
				}
				else {
					returnVal = color;
				}
			}
			else if (colorType === COLOR_TYPE.RGB || colorType === COLOR_TYPE.RGBA) {
				returnVal = '#' + factory.convert.numberToHex(vals[0]) + factory.convert.numberToHex(vals[1]) + factory.convert.numberToHex(vals[2]);
			}
			else if (colorType === COLOR_TYPE.HSL || colorType === COLOR_TYPE.HSLA) {
				var m1, m2, hue;
				if (vals[1] === 0) {
					vals[0] = vals[1] = vals[2] = (vals[2] * 255);
				}
				else {
					m2 = vals[2] <= 0.5 ? vals[2] * (vals[1] + 1) : vals[2] + vals[1] - vals[2] * vals[1];
					m1 = vals[2] * 2 - m2;
					hue = vals[0] / 360;
				}
				returnVal = '#' +
				factory.get.hue(m1, m2, hue + 1 / 3, true) +
				factory.get.hue(m1, m2, hue, true) +
				factory.get.hue(m1, m2, hue - 1 / 3, true);
			}
			else {
				returnVal = color;
			}
			return returnVal
		}

		function convertRgb(color) {
			color = color.toUpperCase();
			var returnVal;
			var colorType = factory.get.colorType(color);
			var vals = factory.get.values(color, RETURN_TYPE.ARRAY, true);

			if (colorType === COLOR_TYPE.HEX) {
				returnVal = 'RGB(' +
				factory.convert.hexToNumber(vals[0]) + ',' +
				factory.convert.hexToNumber(vals[1]) + ',' +
				factory.convert.hexToNumber(vals[2]) + ')';
			}
			else if (colorType === COLOR_TYPE.RGB) {
				returnVal = color;
			}
			else if (colorType === COLOR_TYPE.RGBA) {
				returnVal = 'RGB(' + vals[0] + ',' + vals[1] + ',' + vals[2] + ')';
			}
			else if (colorType === COLOR_TYPE.HSL || colorType === COLOR_TYPE.HSLA) {
				var m1, m2, hue;
				if (vals[1] === 0) {
					vals[0] = vals[1] = vals[2] = (vals[2] * 255);
				}
				else {
					m2 = vals[2] <= 0.5 ? vals[2] * (vals[1] + 1) : vals[2] + vals[1] - vals[2] * vals[1];
					m1 = vals[2] * 2 - m2;
					hue = vals[0] / 360;
				}
				returnVal = 'RGB(' +
				factory.get.hue(m1, m2, hue + 1 / 3) + ',' +
				factory.get.hue(m1, m2, hue) + ',' +
				factory.get.hue(m1, m2, hue - 1 / 3) + ')';
			}
			return returnVal
		}

		function convertRgba(color, opacity) {
			color = color.toUpperCase();
			var returnVal;
			var colorType = factory.get.colorType(color);
			var vals = factory.get.values(color, RETURN_TYPE.ARRAY, true);
			var o = colorType === COLOR_TYPE.RGBA || colorType === COLOR_TYPE.HSLA ? vals[3] : opacity < 0 ? 0 : opacity > 1 || angular.isUndefined(opacity) ? 1 : opacity;
			if (colorType === COLOR_TYPE.HEX) {
				returnVal = 'RGBA(' +
				factory.convert.hexToNumber(vals[0]) + ',' +
				factory.convert.hexToNumber(vals[1]) + ',' +
				factory.convert.hexToNumber(vals[2]) + ',' +
				o + ')';
			}
			else if (colorType === COLOR_TYPE.RGB) {
				returnVal = 'RGBA(' + vals[0] + ',' + vals[1] + ',' + vals[2] + ',' + o + ')';
			}
			else if (colorType === COLOR_TYPE.RGBA) {
				returnVal = color;
			}
			else if (colorType === COLOR_TYPE.HSL || colorType === COLOR_TYPE.HSLA) {
				var m1, m2, hue;
				if (vals[1] === 0) {
					vals[0] = vals[1] = vals[2] = (vals[2] * 255);
				}
				else {
					m2 = vals[2] <= 0.5 ? vals[2] * (vals[1] + 1) : vals[2] + vals[1] - vals[2] * vals[1];
					m1 = vals[2] * 2 - m2;
					hue = vals[0] / 360;
				}
				returnVal = 'RGBA(' +
				factory.get.hue(m1, m2, hue + 1 / 3) + ',' +
				factory.get.hue(m1, m2, hue) + ',' +
				factory.get.hue(m1, m2, hue - 1 / 3) + ',' + o + ')';
			}
			return returnVal
		}

		function convertHsl(color) {
			var returnVal;
			var colorType = factory.get.colorType(color);
			var vals = factory.get.values(color, RETURN_TYPE.ARRAY, true);
			if ([COLOR_TYPE.HEX, COLOR_TYPE.RGB, COLOR_TYPE.RGBA].indexOf(colorType) !== -1) {
				var hexVals = factory.get.values(factory.convert.rgb(color), RETURN_TYPE.ARRAY);
				var r = (colorType === COLOR_TYPE.HEX ? hexVals[0] : vals[0]) / 255;
				var g = (colorType === COLOR_TYPE.HEX ? hexVals[1] : vals[1]) / 255;
				var b = (colorType === COLOR_TYPE.HEX ? hexVals[2] : vals[2]) / 255;
				var max = Math.max(r, g, b), min = Math.min(r, g, b);
				var h, s, l = (max + min) / 2;
				if (max === min) {
					h = s = 0; // achromatic
				} else {
					var d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch (max) {
						case r:
							h = (g - b) / d + (g < b ? 6 : 0);
							break;
						case g:
							h = (b - r) / d + 2;
							break;
						case b:
							h = (r - g) / d + 4;
							break;
					}
					h /= 6;
				}
				returnVal = 'HSL(' + Math.floor(h * 360) + ',' + Math.floor(s * 100) + '%,' + Math.floor(l * 100) + '%)';
			}
			else if (colorType === COLOR_TYPE.HSL) {
				returnVal = color.toUpperCase();
			}
			else if (colorType === COLOR_TYPE.HSLA) {
				returnVal = 'HSL(' + vals[0] + ',' + (vals[1] * 100) + '%,' + (vals[2] * 100) + '%)';
			}
			return returnVal
		}

		function convertHsla(color, opacity) {
			var returnVal;
			var colorType = factory.get.colorType(color);
			var vals = factory.get.values(color, RETURN_TYPE.ARRAY, true);
			var o = colorType === COLOR_TYPE.RGBA || colorType === COLOR_TYPE.HSLA ? vals[3] : opacity < 0 ? 0 : opacity > 1 || angular.isUndefined(opacity) ? 1 : opacity;
			if (colorType === COLOR_TYPE.HEX || colorType === COLOR_TYPE.RGB || colorType === COLOR_TYPE.RGBA) {
				var hexVals = factory.get.values(factory.convert.rgb(color), RETURN_TYPE.ARRAY);
				var r = (colorType === COLOR_TYPE.HEX ? hexVals[0] : vals[0]) / 255;
				var g = (colorType === COLOR_TYPE.HEX ? hexVals[1] : vals[1]) / 255;
				var b = (colorType === COLOR_TYPE.HEX ? hexVals[2] : vals[2]) / 255;
				var max = Math.max(r, g, b), min = Math.min(r, g, b);
				var h, s, l = (max + min) / 2;
				if (max === min) {
					h = s = 0;
				}// achromatic
				else {
					var d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch (max) {
						case r:
							h = (g - b) / d + (g < b ? 6 : 0);
							break;
						case g:
							h = (b - r) / d + 2;
							break;
						case b:
							h = (r - g) / d + 4;
							break;
					}
					h /= 6;
				}
				returnVal = 'HSLA(' + Math.floor(h * 360) + ',' + Math.floor(s * 100) + '%,' + Math.floor(l * 100) + '%,' + o + ')';
			}
			else if (colorType === COLOR_TYPE.HSL) {
				returnVal = 'HSLA(' + vals[0] + ',' + (vals[1] * 100) + '%,' + (vals[2] * 100) + '%,' + o + ')';
			}
			else if (colorType === COLOR_TYPE.HSLA) {
				returnVal = color.toUpperCase()
			}
			return returnVal
		}

		function betweenHex(c1, c2) {
			return factory.array.hex(c1, c2, 3)[1]
		}

		function betweenRgb(c1, c2) {
			return factory.array.rgb(c1, c2, 3)[1]
		}

		function betweenHsl(c1, c2) {
			return factory.array.hsl(c1, c2, 3)[1]
		}

		function betweenRgba(c1, c2, o1, o2) {
			return factory.array.rgba(c1, c2, 3, o1, o2)[1]
		}

		function betweenHsla(c1, c2, o1, o2) {
			return factory.array.hsla(c1, c2, 3, o1, o2)[1]
		}

		function arrayHex(c1, c2, len) {
			var steps = [];
			var returnVal = [];
			if (len < 3) {
				returnVal = [factory.convert.hex(c1), factory.convert.hex(c2)]
			}
			else {
				var c1Vals = factory.get.values(factory.convert.rgb(c1), RETURN_TYPE.ARRAY);
				var c2Vals = factory.get.values(factory.convert.rgb(c2), RETURN_TYPE.ARRAY);
				for (var i = 0; i < c1Vals.length; i++) {
					steps.push(c1Vals[i] === c2Vals[i] ? 0 : (c1Vals[i] - c2Vals[i]) / (len - 1) * -1);
				}
				for (i = 0; i < len; i++) {
					returnVal.push('#' +
						factory.convert.numberToHex(Math.floor(steps[0] * i + c1Vals[0])) +
						factory.convert.numberToHex(Math.floor(steps[1] * i + c1Vals[1])) +
						factory.convert.numberToHex(Math.floor(steps[2] * i + c1Vals[2]))
					)
				}
			}
			return returnVal
		}

		function arrayRgb(c1, c2, len) {
			var steps = [];
			var returnVal = [];
			if (len < 3) {
				returnVal = [factory.convert.rgb(c1), factory.convert.rgb(c2)]
			}
			else {
				var c1Vals = factory.get.values(factory.convert.rgb(c1), RETURN_TYPE.ARRAY);
				var c2Vals = factory.get.values(factory.convert.rgb(c2), RETURN_TYPE.ARRAY);
				for (var i = 0; i < c1Vals.length; i++) {
					steps.push(c1Vals[i] === c2Vals[i] ? 0 : (c1Vals[i] - c2Vals[i]) / (len - 1) * -1);
				}
				for (i = 0; i < len; i++) {
					returnVal.push('RGB(' +
						Math.floor(steps[0] * i + c1Vals[0]) + ',' +
						Math.floor(steps[1] * i + c1Vals[1]) + ',' +
						Math.floor(steps[2] * i + c1Vals[2]) + ')'
					)
				}
			}
			return returnVal
		}

		function arrayRgba(c1, c2, len, op1, op2) {
			var steps = [];
			var returnVal = [];
			if (len < 3) {
				returnVal = [factory.convert.rgba(c1, op1), factory.convert.hex(c2, op2)]
			}
			else {
				var c1Vals = factory.get.values(factory.convert.rgba(c1, op1), RETURN_TYPE.ARRAY);
				var c2Vals = factory.get.values(factory.convert.rgba(c2, op2), RETURN_TYPE.ARRAY);

				for (var i = 0; i < c1Vals.length; i++) {
					steps.push(c1Vals[i] === c2Vals[i] ? 0 : (c1Vals[i] - c2Vals[i]) / (len - 1) * -1);
				}
				for (i = 0; i < len; i++) {
					returnVal.push('RGBA(' +
						Math.floor(steps[0] * i + c1Vals[0]) + ',' +
						Math.floor(steps[1] * i + c1Vals[1]) + ',' +
						Math.floor(steps[2] * i + c1Vals[2]) + ',' +
						factory.get.roundedNumber(Number(steps[3] * i + c1Vals[3]), 2) + ')'
					)
				}
			}
			return returnVal
		}

		function arrayHsl(c1, c2, len) {
			var returnVal = [];
			if (len < 3) {
				returnVal = [factory.convert.hsl(c1), factory.convert.hsl(c2)]
			}
			else {
				returnVal = factory.array.rgb(c1, c2, len);
				for (var i = 0; i < returnVal.length; i++) {
					returnVal[i] = factory.convert.hsl(returnVal[i]);
				}
			}
			return returnVal
		}

		function arrayHsla(c1, c2, len, o1, o2) {
			var returnVal = [];
			if (len < 3) {
				returnVal = [factory.convert.hsla(c1), factory.convert.hsla(c2)]
			}
			else {
				returnVal = factory.array.rgba(c1, c2, len, o1, o2);
				for (var i = 0; i < returnVal.length; i++) {
					returnVal[i] = factory.convert.hsla(returnVal[i]);
				}
			}
			return returnVal
		}

		function randomBetweenHex(c1, c2) {
			var c1Vals = factory.get.values(factory.convert.rgb(c1), RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgb(c2), RETURN_TYPE.ARRAY);
			var clrs = [];
			for (var i = 0; i < c1Vals.length; i++) {
				var val = factory.get.randomNumber(c1Vals[i], c2Vals[i], 0);
				clrs.push(factory.convert.numberToHex(val));
			}
			return '#' + clrs[0] + clrs[1] + clrs[2];
		}

		function randomBetweenRgb(c1, c2) {
			var c1Vals = factory.get.values(factory.convert.rgb(c1), RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgb(c2), RETURN_TYPE.ARRAY);
			var clrs = [];
			for (var i = 0; i < c1Vals.length; i++) {
				clrs.push(factory.get.randomNumber(c1Vals[i], c2Vals[i], 0));
			}
			return 'RGB(' + clrs[0] + ',' + clrs[1] + ',' + clrs[2] + ')';
		}

		function randomBetweenRgba(c1, c2, o1, o2) {
			var c1Vals = factory.get.values(factory.convert.rgba(c1, o1), RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgba(c2, o2), RETURN_TYPE.ARRAY);
			var clrs = [];
			for (var i = 0; i < c1Vals.length; i++) {
				clrs.push(factory.get.randomNumber(c1Vals[i], c2Vals[i], i === 3 ? 2 : 0));
			}
			return 'RGBA(' + clrs[0] + ',' + clrs[1] + ',' + clrs[2] + ',' + clrs[3] + ')';
		}

		function randomBetweenHsl(c1, c2) {
			var c1Vals = factory.get.values(factory.convert.rgb(c1), RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgb(c2), RETURN_TYPE.ARRAY);
			var clrs = [];
			for (var i = 0; i < c1Vals.length; i++) {
				clrs.push(factory.get.randomNumber(c1Vals[i], c2Vals[i], 0));
			}
			var rgbClr = 'RGB(' + clrs[0] + ',' + clrs[1] + ',' + clrs[2] + ')';
			return factory.convert.hsl(rgbClr);
		}

		function randomBetweenHsla(c1, c2, o1, o2) {
			var c1Vals = factory.get.values(factory.convert.rgba(c1, o1), RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgba(c2, o2), RETURN_TYPE.ARRAY);
			var clrs = [];
			for (var i = 0; i < c1Vals.length; i++) {
				clrs.push(factory.get.randomNumber(c1Vals[i], c2Vals[i], i === 3 ? 2 : 0));
			}
			var rgbaClr = 'RGBA(' + clrs[0] + ',' + clrs[1] + ',' + clrs[2] + ',' + clrs[3] + ')';
			return factory.convert.hsla(rgbaClr);
		}
	}
})();
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
(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('burst', burstFactory);

	burstFactory.$inject = ['genColors'];

	function burstFactory(genColors) {

		var particles = [];
		var maxParticles = 40;

		var service = {
			draw: draw,
			newBurst: newBurst
		};
		return service;

		///////////////////////////////////////////////

		function newBurst(state) {
			return {
				speed: genColors.get.randomNumber(3, 10),
				x: state.w / 2,
				y: state.h / 2,
				xD: genColors.get.randomNumber(-1, 1),
				yD: genColors.get.randomNumber(-1, 1),
				rad: genColors.get.randomNumber(10, 150, 0),
				color: genColors.random.hex(),
				o: 1,
				drawBorder: Math.random() >= 0.8
			}
		}

		function draw(ctx, state, averageDb) {
			averageDb = averageDb < 10 ? 0 : averageDb;
			for (var i = 0; i < maxParticles; i++) {
				if (angular.isUndefined(particles[i]) && averageDb > 0) {
					particles.push(service.newBurst(state));
				}
				var p = particles[i];
				if (p && p.rad > 0) {
					ctx.beginPath();
					p.o -= 0.02;
					if (p.o < 0) {
						p.o = 0;
					}

					var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rad);
					gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
					gradient.addColorStop(0.5, genColors.convert.rgba(p.color, p.o));
					gradient.addColorStop(1, genColors.convert.rgba(p.color, 0));
					ctx.fillStyle = gradient;

					ctx.arc(p.x, p.y, p.rad, Math.PI * 2, false);

					if (p.drawBorder) {
						ctx.strokeStyle = 'rgba(255,255,255,0.3)';
						ctx.stroke();
					}
					ctx.fill();

					p.rad -= (averageDb > 120 ? 6 : 3) - (averageDb / 100);
					p.x += (p.xD * p.speed);
					p.y += (p.yD * p.speed);
				}

				if (p && p.rad < 0 && averageDb > 0) {
					particles[i] = service.newBurst(state);
				}
			}
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('crazy', crazy);

	crazy.$inject = ['genColors'];

	function crazy(genColors) {

		var service = {
			draw: draw
		};

		var rows = 10;
		var columns = 10;
		var flux = 90;
		var spd = 1;
		var points = [];
		var xArray = [];
		var yArray = [];
		var c1 = '#A5A5FF';
		var c2 = '#FFA5AF';

		return service;

		////////////////////////////////////////////////

		function newPoint() {
			var x = genColors.get.randomNumber(-flux, flux);
			var y = genColors.get.randomNumber(-flux, flux);
			return {
				x: x,
				y: y,
				xO: x,
				yO: y,
				xD: genColors.get.randomNumber(spd/2, spd) * (Math.random() > 0.5 ? 1 : -1) ,
				yD: genColors.get.randomNumber(spd/2, spd) * (Math.random() > 0.5 ? 1 : -1) ,
				c: genColors.randomBetween.rgba(c1, c2, 0.1, 0.2),
				hovering: false
			}
		}

		function draw(ctx, state, averageDb) {
			var c1 = false;
			var c2 = false;
			for (var y = 0; y < rows; y++) {
				if (angular.isUndefined(points[y])) {points.push([]);}
				for (var x = 0; x < columns; x++) {
					if (angular.isUndefined(points[y][x])) {
						points[y].push(newPoint());
					}
					var p = points[y][x];
					var absXD = Math.abs(p.xD);
					var absYD = Math.abs(p.yD);

					// actual adjust of point position
					var dbRate = averageDb / 20;
					var dbAdjust = dbRate > 1 ? dbRate : 1;
					p.x += p.xD * dbAdjust;
					p.y += p.yD * dbAdjust;

					// toggle direction and fast decrease when oversized
					if (p.x > p.xO + flux) {p.xD = absXD * -1;  }
					if (p.x < p.xO - flux) {p.xD = absXD;       }
					if (p.y > p.yO + flux) {p.yD = absYD * -1;  }
					if (p.y < p.yO - flux) {p.yD = absYD;       }
				}
			}

			for (y = 0; y < rows-1; y++) {
				for (x = 0; x < columns-1; x++) {
					var p1 = points[y  ][x  ];
					var p2 = points[y  ][x+1];
					var p3 = points[y+1][x+1];
					var p4 = points[y+1][x  ];
					var xA = state.w / (columns-1);
					var yA = state.h / (rows-1);
					xArray = [
						xA * x + p1.x,
						xA * (x + 1) + p2.x,
						xA * (x + 1) + p3.x,
						xA * x + p4.x
					];
					yArray = [
						yA * y + p1.y,
						yA * y + p2.y,
						yA * (y + 1) + p3.y,
						yA * (y + 1) + p4.y
					];

					ctx.beginPath();
					ctx.strokeStyle = 'rgba(0,0,0,0.5)';
					ctx.fillStyle = p1.c;

					ctx.moveTo(xArray[0], yArray[0]);
					ctx.lineTo(xArray[1], yArray[1]);
					ctx.lineTo(xArray[2], yArray[2]);
					ctx.lineTo(xArray[3], yArray[3]);
					ctx.lineTo(xArray[0], yArray[0]);

					ctx.stroke();
					ctx.fill();
					ctx.closePath();
				}
			}
		}

	}
})();
(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('mathMachine', mathMachineFactory);

	mathMachineFactory.$inject = [];

	function mathMachineFactory() {

		var service = {
			draw: draw
		};
		return service;

		///////////////////////////////

		function draw(ctx, state, averageDb, discLength, click) {
			var angleSize = (1 / discLength) * Math.PI * 2;
			for (var i = 0; i < discLength; i++) {
				var a1 = angleSize * i;
				var a2 = angleSize * (i + 1);
				var playAngle = click == i;
				var numConnectors = playAngle ? 25 : 10;
				for (var connector = 0; connector < numConnectors; connector++) {
					var angleAdjust = connector / numConnectors;
					var rad = averageDb * 3 * ( playAngle ? 2.4 : 2);
					var x1 = state.xCenter + (rad * angleAdjust) * Math.cos(a1);
					var y1 = state.yCenter + (rad * angleAdjust) * Math.sin(a1);
					var x2 = state.xCenter + (rad * (1 - angleAdjust)) * Math.cos(a2);
					var y2 = state.yCenter + (rad * (1 - angleAdjust)) * Math.sin(a2);
					ctx.beginPath();
					ctx.strokeStyle = playAngle ? '#FFFFFF' : 'rgba(255,255,255,0.7)';
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
					ctx.closePath();
				}
			}
			ctx.strokeStyle = '';
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('particles', particlesFactory);

	particlesFactory.$inject = ['genColors'];

	function particlesFactory(genColors) {

		var particles = [];
		var maxParticles = 1000;

		var service = {
			draw: draw,
			newParticle: newParticle
		};

		return service;

		/////////////////////////////////////

		function newParticle(state) {
			return {
				position: {x: state.xCenter, y: state.yCenter},
				size: genColors.get.randomNumber(10, 20),
				fillColor: genColors.random.rgba(0.4),
				xMod: genColors.get.randomNumber(-4, 4),
				yMod: genColors.get.randomNumber(-4, 4),
				angle: 0,
				speed: genColors.get.randomNumber(0.1, 0.2),
				orbit: genColors.get.randomNumber(1, 8)
			}
		}

		function draw(ctx, state, averageDb) {
			var db = averageDb / 10;
			for (var i = 0; i < maxParticles; i++) {
				if (angular.isUndefined(particles[i])) {
					particles.push(service.newParticle(state));
				}
				var particle = particles[i];
				particle.position.x += particle.xMod;
				particle.position.y += particle.yMod;
				particle.angle += particle.speed;
				if (db > 4) {
					var orbit = particle.orbit;
					particle.position.x += Math.cos(i + particle.angle) * orbit;
					particle.position.y += Math.sin(i + particle.angle) * orbit;
					if (particle.position.x < 0 || particle.position.x > state.w ||
						particle.position.y < 0 || particle.position.y > state.h ||
						particle.size < 0) {
						particles[i] = service.newParticle(state);
					}
				}
				particle.size -= 0.3;
				if (particle.size > 0) {
					ctx.beginPath();
					ctx.fillStyle = particle.fillColor;
					ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2, true);
					ctx.fill();
				}
			}
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('tunnel', tunnelFactory);

	tunnelFactory.$inject = ['genColors'];

	function tunnelFactory(genColors) {
		var rads = [0];

		var service = {
			draw: draw
		};

		return service;

		///////////////////////////////////////

		function draw(ctx, state, averageDb) {
			var nextIndex = false;
			ctx.lineWidth = 1;
			ctx.strokeStyle = genColors.convert.rgba("#FFFFFF", averageDb > 10 ? averageDb / 200 : 0);

			for (var index = 0; index < rads.length + 1; index++) {
				if (angular.isDefined(rads[index])) {
					rads[index] += 1 + (averageDb / 5);
					ctx.beginPath();
					ctx.arc(
						state.xCenter,
						state.yCenter,
						rads[index],
						0,
						2 * Math.PI,
						true
						);
					ctx.stroke();
				}
				else if (!nextIndex && rads.length) {
					nextIndex = true;
					if (rads[index - 1] > 8 && rads.length < 300) {
						rads.push(1);
					}
				}
			}
			for (index = 0; index < rads.length; index++) {
				if (rads[index] > state.xCenter + 60) {
					rads.splice(index, 1);
				}
			}
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('dropDown', dropDown);

	dropDown.$inject = [];
	function dropDown() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'CACHE/elements/dropDown/dropDown.html',
			transclude: true,
			controller: dropDownController,
			scope: {
				list: '=list',
				selected: '=selected'
			},
			bindToController: true
		};

		return directive;
	}

	dropDownController.$inject = ['$scope'];
	function dropDownController($scope) {

		var adjust = 4;
		$scope.expanded = false;
		$scope.offset = 0;
		$scope.maxListLength = 10;

		$scope.toggleExpanded = toggleExpanded;
		$scope.scroll = scroll;
		$scope.selectValue = selectValue;
		$scope.getIndex = getIndex;

		////////////////////////////////////////

		function getIndex() {
			var index = 0;
			for (var i = 0; i < $scope.list.length; i++) {
				if ($scope.list[i].txt == $scope.selected) {
					index = i;
					break;
				}
			}
			return index
		}

		function toggleExpanded() {
			$scope.expanded = !$scope.expanded;
			var index = $scope.getIndex();
			$scope.offset = index + $scope.maxListLength > $scope.list.length ?
			$scope.list.length - $scope.maxListLength :
				index;
		}

		function scroll(directionUP) {
			directionUP ?
				$scope.offset + $scope.maxListLength + adjust < $scope.list.length ?
					$scope.offset += adjust :
					$scope.offset = $scope.list.length - $scope.maxListLength
				:
				$scope.offset - adjust < 0 ?
					$scope.offset = 0 :
					$scope.offset -= adjust;
		}

		function selectValue(index) {
			$scope.expanded = false;
			$scope.selected = $scope.list[index].type;
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('knob', knob);

	knob.$inject = [];

	function knob() {
		var directive = {
			restrict: 'EA',
			scope: {
				size: '=size',
				label: '=?label',
				color: '=color',
				minValue: '=?minValue',
				maxValue: '=?maxValue',
				knobValue: '=knobValue'
			},
			template: '<canvas class="knob" data-ng-dblclick="setKnobValue(true)" data-ng-mousedown="mouseDownEvent($event)"></canvas>',
			replace: true,
			controller: knobController,
			bindToController: true
		};
		return directive;
	}

	knobController.$inject = ['$scope', '$element', '$window'];

	function knobController($scope, $element, $window) {

		if (angular.isUndefined($scope.size)) {
			$scope.size = 40;
		}

		var min = angular.isUndefined($scope.minValue) ? 0 : $scope.minValue;
		var max = angular.isUndefined($scope.maxValue) ? 1 : $scope.maxValue;
		var range = max - min;

		var startY, startRotation, rotationValue;
		var panAngleLimit = 160;
		var decimalPercision = 1000;
		var cnvs = $element[0];
		var ctx = cnvs.getContext('2d');
		var originalRotationValue = ($scope.knobValue - min) / range;
		var resetValue = Math.round($scope.knobValue * decimalPercision) / decimalPercision;

		cnvs.style.width = $scope.size + 'px';
		cnvs.style.height = $scope.size + 'px';
		angular.element(cnvs).attr({width: $scope.size + 'px', height: $scope.size + 'px'});

		$scope.eraseAndDrawCanvas = eraseAndDrawCanvas;
		$scope.mouseDownEvent = mouseDownEvent;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.setKnobValue = setKnobValue;
		$scope.externalUpdateKnobValue = externalUpdateKnobValue;

		$scope.setKnobValue(true);

		$scope.$watch('color', $scope.eraseAndDrawCanvas);
		$scope.$watch('knobValue', $scope.externalUpdateKnobValue);

		////////////////////////////////////////////////////////////////

		function eraseAndDrawCanvas() {
			ctx.clearRect(0, 0, $scope.size, $scope.size);
			var half = $scope.size / 2;
			if ($scope.label) {
				ctx.beginPath();
				ctx.textAlign = 'center';
				ctx.fillStyle = '#FFFFFF';
				ctx.font = '13px Calibri';
				ctx.fillText($scope.label, half, half + 4);
				ctx.closePath();
			}
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1;
			ctx.arc(half, half, half - 3, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.strokeStyle = $scope.color;
			ctx.lineWidth = 7;
			ctx.lineCap = 'butt';
			ctx.arc(half, half, half - 10, 0, Math.PI * 2 * (rotationValue), false);
			ctx.stroke();
			ctx.closePath();
		}

		function setKnobValue(reset){
			if (reset) {
				$scope.knobValue = resetValue;
				rotationValue = originalRotationValue;
			}
			else {
				$scope.knobValue = Math.round((range * rotationValue + min) * decimalPercision) / decimalPercision;
			}
			$scope.eraseAndDrawCanvas();
		}

		function externalUpdateKnobValue() {
			rotationValue = ($scope.knobValue - min) / range;
			$scope.eraseAndDrawCanvas();
		}

		///////////////////////////////////////////////

		function mouseDownEvent(e) {
			angular.element($window).bind('mouseup', $scope.mouseUpEvent);
			angular.element($window).bind('mousemove', $scope.mouseMoveEvent);
			startY = e.clientY;
			startRotation = rotationValue * panAngleLimit;
		}
		function mouseUpEvent() {
			angular.element($window).unbind('mouseup', $scope.mouseUpEvent);
			angular.element($window).unbind('mousemove', $scope.mouseMoveEvent);
			$scope.setKnobValue();
		}
		function mouseMoveEvent(e) {
			var mouseRotation = startRotation + startY - e.clientY;
			if (mouseRotation < 0) { mouseRotation = 0; }
			if (mouseRotation > panAngleLimit) { mouseRotation = panAngleLimit;	}
			rotationValue = mouseRotation / panAngleLimit;
			$scope.setKnobValue();
			$scope.$apply();
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('slider', slider);

	slider.$inject = [];
	function slider() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'CACHE/elements/slider/slider.html',
			bindToController: true,
			controller: sliderController,
			scope: {
				currentlyMoving: "=currentlyMoving",
				sliderValue: "=sliderValue",
				callBack: "=callBack",
				minValue: "=minValue",
				maxValue: "=maxValue",
				fixedValue: "=fixedValue"
			}
		};
		return directive;
	}

	sliderController.$inject = ['$scope', '$element', '$window', 'themeService'];
	function sliderController($scope, $element, $window, themeService) {

		var lastValue = -1;
		var runCallBack = angular.isDefined($scope.callBack);
		var toFixedValue = angular.isDefined($scope.fixedValue);
		var minValue = angular.isDefined($scope.minValue) ? $scope.minValue : 0;
		var maxValue = angular.isDefined($scope.maxValue) ? $scope.maxValue : 1;
		if (minValue === maxValue) {
			minValue = 0;
			maxValue = 1;
		}
		var minIsBigger = minValue > maxValue;
		if (minIsBigger) {
			var x = maxValue;
			maxValue = minValue;
			minValue = x;
		}
		if ($scope.sliderValue < minValue) {$scope.sliderValue = minValue}
		if ($scope.sliderValue > maxValue) {$scope.sliderValue = maxValue}
		var originalSliderValue = $scope.sliderValue;

		$scope.thumbWidth = 8;
		$scope.themeService = themeService;
		$scope.getWidth = getWidth;
		$scope.getLeftAdjust = getLeftAdjust;
		$scope.getOriginalLeftPos = getOriginalLeftPos;
		$scope.mouseDown = mouseDown;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.setSliderValueAndRunCallBack = setSliderValueAndRunCallBack;

		$scope.leftPos = $scope.getOriginalLeftPos();

		/////////////////////////////////////////////

		function getLeftAdjust() {
			return $element[0].getBoundingClientRect().left + ($scope.thumbWidth/2)
		}

		function getWidth() {
			return $element[0].getBoundingClientRect().width - $scope.thumbWidth;
		}

		function getOriginalLeftPos() {
			return (originalSliderValue-minValue) / (maxValue-minValue) * $scope.getWidth();
		}

		function mouseUpEvent() {
			angular.element($window).unbind('mouseup', mouseUpEvent);
			angular.element($window).unbind('mousemove', mouseMoveEvent);
			$scope.currentlyMoving = false;
			$scope.$apply();
		}
		function mouseDown(event) {
			$scope.currentlyMoving = true;
			$scope.leftPos = event.clientX - $scope.getLeftAdjust();
			$scope.setSliderValueAndRunCallBack();
			angular.element($window).bind('mouseup', mouseUpEvent);
			angular.element($window).bind('mousemove', mouseMoveEvent);

		}

		function setSliderValueAndRunCallBack(reset) {
			if (reset) {
				$scope.sliderValue = toFixedValue ? originalSliderValue.toFixed($scope.fixedValue) : originalSliderValue;
				$scope.leftPos = $scope.getOriginalLeftPos();
			}
			else {
				var newSlider = minIsBigger ?
				($scope.leftPos / $scope.getWidth()) * (minValue -  maxValue) + maxValue :
				($scope.leftPos / $scope.getWidth()) * (maxValue -  minValue) + minValue;
				$scope.sliderValue = toFixedValue ? newSlider.toFixed($scope.fixedValue) : newSlider;
			}
			if (runCallBack) {
				$scope.callBack($scope.sliderValue);
			}
		}

		function mouseMoveEvent(event) {
			var width = $scope.getWidth();
			var leftPos = event.clientX - $scope.getLeftAdjust();
			$scope.leftPos = leftPos < 0 ? 0 : leftPos > width ? width : leftPos;
			if ($scope.leftPos !== lastValue) {
				lastValue = $scope.leftPos;
				$scope.setSliderValueAndRunCallBack();
			}
			$scope.$apply();
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('helpWindow', helpWindow);

	function helpWindow() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'CACHE/menu/helpWindow/helpWindow.html',
			replace: true,
			controller: helpWindowController,
			bindToController: true
		};
		return directive;
	}

	helpWindowController.$inject = ['$scope'];
	function helpWindowController($scope) {


	}
})();
(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('importExportWindow', importExportWindow);

	function importExportWindow() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'CACHE/menu/importExportWindow/importExportWindow.html',
			replace: true,
			controller: importExportController,
			bindToController: true,
			scope: {
				panelOpen: '=panelOpen'
			}
		};
		return directive;
	}

	importExportController.$inject = ['$scope', 'animationService', 'themeService', 'audioService', '$localStorage'];
	function importExportController($scope, animationService, themeService, audioService, $localStorage) {

		$scope.textAreaData = '';
		$scope.importData = importData;
		$scope.getTextAreaData = getTextAreaData;

		$scope.$watch('panelOpen', $scope.getTextAreaData);

		////////////////////////////////////////////

		function getTextAreaData() {
			$scope.textAreaData = JSON.stringify({
				themeIndex: $localStorage.themeIndex,
				synthIndex: $localStorage.synthIndex,
				animationIndex: $localStorage.animationIndex,
				discLength: $localStorage.discLength,
				volume: $localStorage.volume,
				speed: $localStorage.speed,
				synthTemplates: audioService.synthTemplates
			});
		}

		function importData() {
			var parsedData = JSON.parse($scope.textAreaData);
			if (angular.isDefined(parsedData)) {
				$localStorage.themeIndex = parsedData.themeIndex;
				$localStorage.synthIndex = parsedData.synthIndex;
				$localStorage.animationIndex = parsedData.animationIndex;
				$localStorage.discLength = parsedData.discLength;
				$localStorage.volume = parsedData.volume;
				$localStorage.speed = parsedData.speed;
				audioService.synthTemplates = parsedData.synthTemplates;

				audioService.setSynthTemplate();
				animationService.setAnimation();
				themeService.setTheme();
			}
		}
	}
})();
(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('synthControls', synthControls);

	synthControls.$inject = [];

	function synthControls() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'CACHE/menu/synthControls/synthControls.html',
			replace: true,
			controller: synthControlsController,
			bindToController: true,
			scope: {
				node: '=node',
				fx: '=fx'
			}
		};
		return directive
	}

	synthControlsController.$inject = ['$scope', '$window', 'themeService', 'audioService'];

	function synthControlsController($scope, $window, themeService, audioService) {

		angular.element($window).bind('keydown', keyDownEvent);

		$scope.audioService = audioService;
		$scope.themeService = themeService;
		$scope.oscWaveTypes = [
			{txt: 'Sine', type: 'sine'},
			{txt: 'Square', type: 'square'},
			{txt: 'SawTooth', type: 'sawtooth'},
			{txt: 'Triangle', type: 'triangle'}
		];

		/////////////////////////////////////////////

		function keyDownEvent(e) {
			switch (e.keyCode) {
				case 32 : audioService.startStop(); break;
				case 49 : $scope.fx.moogfilter.bypass = !$scope.fx.moogfilter.bypass;	break;
				case 50 : $scope.fx.overdrive.bypass = !$scope.fx.overdrive.bypass;	    break;
				case 51 : $scope.fx.bitcrusher.bypass = !$scope.fx.bitcrusher.bypass;   break;
				case 52 : $scope.fx.tremolo.bypass = !$scope.fx.tremolo.bypass;		    break;
				case 53 : $scope.fx.convolver.bypass = !$scope.fx.convolver.bypass; 	break;
				case 54 : $scope.fx.delay.bypass = !$scope.fx.delay.bypass;			    break;
			}
			$scope.$digest();
		}
	}
})();