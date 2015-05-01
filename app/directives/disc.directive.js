(function () {
	'use strict';
	angular
		.module('discModule', [])
		.directive('disc', disc);

	function disc() {
		var directive = {
			restrict: 'EA',
			controller: discController,
			bindToController: true
		};
		return directive;
	}

	discController.$inject = ['$scope', '$element', '$timeout', '$window', 'MENU_SIZE', 'themeService', 'colorService', 'menuService', 'mathService', 'audioService'];
	function discController($scope, $element, $timeout, $window, MENU_SIZE, themeService, colorService, menuService, mathService, audioService) {

		var cnv = $element[0];
		var ctx = cnv.getContext('2d');
		var ctrlKey = false;
		var rad = 0;
		var colors = [];
		var hoverRing, hoverDisc, ringSelect, discSelect, mouseDownY, startFreq, centerButtonSize = -1;
		var midX, midY, angleSize, drawPromise, clickPromise, distanceFromCenter;


		$scope.$on('randomizeDisc', randomize);
		$scope.$on('windowResizeEvent', windowResize);
		$scope.$on('discLenChange', reCalculateDiscs);
		$scope.$on('mouseMoveEvent', mouseMoveEvent);
		$scope.$on('mouseUpEvent', mouseUpEvent);
		$scope.$on('mouseDownEvent', mouseDownEvent);
		$scope.$on('keyDownEvent', ctrlKeyValue);
		$scope.$on('keyUpEvent', ctrlKeyValue);
		windowResize();
		timer();

		////////////////////////////////////////////////////

		function timer() {
			drawDisc();
			drawPromise = $timeout(timer, 10);
		}
		function windowResize() {
			var w = $window.innerWidth;
			var h = $window.innerHeight;
			cnv.style.width = w + 'px';
			cnv.style.height = h + 'px';
			angular.element(cnv).attr({width: w, height: h});
			midX = (w - MENU_SIZE) / 2;
			midY = h / 2;
			rad = (h / 2) - 10;
			centerButtonSize = rad / 3;
			reCalculateDiscs({}, menuService.len);
		}
		function reCalculateDiscs(e, discLen) {
			angleSize = (1 / discLen) * Math.PI * 2;
			colors = colorService.hexArray(themeService.theme.discTileStart, themeService.theme.discTileEnd, discLen);
			for (var i = 0; i < audioService.disc.slices.length; i++) {
				var a1 = angleSize * i;
				var a2 = angleSize * (i + 1);
				var theDisc = audioService.disc.slices[i];
				theDisc.a1 = a1;
				theDisc.a2 = a2;
				for (var d = 0; d < 4; d++) {
					theDisc.osc[d].x = midX + ((d + 3) / 6 * rad) * Math.cos(a1);
					theDisc.osc[d].y = midY + ((d + 3) / 6 * rad) * Math.sin(a1);
					theDisc.osc[d].rad = (d + 3) / 6 * rad;
				}
			}
		}
		function randomize() {
			for (var discIndex = 0; discIndex < audioService.disc.slices.length - 1; discIndex++) {
				for (var layer = 0; layer < audioService.disc.slices[discIndex].osc.length; layer++) {
					audioService.disc.slices[discIndex].osc[layer].active = Math.random() >= 0.5;
					audioService.disc.slices[discIndex].osc[layer].freq = mathService.randomNumber(100, 15000, 0);
				}
			}
		}
		function drawDisc() {ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			for (var i = 0; i < audioService.disc.slices.length - 1; i++) {
				var disc1 = audioService.disc.slices[i];
				var disc2 = audioService.disc.slices[i + 1];
				for (var layer = 0; layer < disc1.osc.length - 1; layer++) {
					if (i < menuService.len) {
						ctx.beginPath();
						ctx.lineWidth = 1;
						ctx.moveTo(disc1.osc[layer].x, disc1.osc[layer].y);
						ctx.arc(midX, midY, disc1.osc[layer].rad, disc1.a1, disc1.a2, false);
						ctx.lineTo(disc2.osc[layer + 1].x, disc2.osc[layer + 1].y);
						ctx.arc(midX, midY, disc1.osc[layer + 1].rad, disc1.a2, disc1.a1, true);
						ctx.lineTo(disc1.osc[layer].x, disc1.osc[layer].y);

						if (disc1.osc[layer].active && i == audioService.clickTrack) {
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = colorService.hexToRGBA(colors[i], 0.7);
							ctx.fill();
						}
						if (disc1.osc[layer].active) {
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = colorService.hexToRGBA(colors[i], 0.4);
							ctx.fill();
						}
						else if (i == audioService.clickTrack) {
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = themeService.theme.discPlayLine;
							ctx.fill();
						}
						else if (layer == hoverRing && hoverDisc == i) {
							ctx.lineWidth = 2;
							ctx.strokeStyle = themeService.theme.discLines;
							ctx.fillStyle = themeService.theme.discHover;
							ctx.fill();
						}
						else {
							ctx.strokeStyle = colorService.hexToRGBA(themeService.theme.discLines, 0.2);
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

		function mouseDownEvent(e, args) {
			console.log(ctrlKey);
			if (distanceFromCenter < centerButtonSize) {
				audioService.playing = !audioService.playing;
				audioService.playing ?
					audioService.node.stopper.connect(audioService.fx.moogfilter.input) :
					audioService.node.stopper.disconnect();
			}
			else if (distanceFromCenter < rad && distanceFromCenter > rad / 2) {
				if (!ctrlKey) {
					audioService.disc.slices[hoverDisc].osc[hoverRing].active = !audioService.disc.slices[hoverDisc].osc[hoverRing].active;
				}
				else {
					ringSelect = hoverRing;
					discSelect = hoverDisc;
					mouseDownY = args.clientY;
					startFreq = audioService.disc.slices[discSelect].osc[ringSelect].freq;
				}
			}
		}

		function mouseMoveEvent(e, args) {
			distanceFromCenter = Math.sqrt(Math.pow(args.clientX - (ctx.canvas.width - MENU_SIZE) / 2, 2) + Math.pow(args.clientY - (ctx.canvas.height / 2), 2));
			if (distanceFromCenter < rad && distanceFromCenter > rad / 2) {
				for (var layer = 0; layer < audioService.disc.slices[0].osc.length - 1; layer++) {
					var d1 = (layer + 3) / 6 * rad;
					var d2 = (layer + 4) / 6 * rad;
					if (distanceFromCenter > d1 && distanceFromCenter < d2) {
						hoverRing = layer;
						break;
					}
				}
				var angle = Math.atan2((ctx.canvas.height / 2) - args.clientY, (ctx.canvas.width - MENU_SIZE) / 2 - args.clientX) + Math.PI;
				for (var i = 0; i < audioService.disc.slices.length - 1; i++) {
					if (angle > audioService.disc.slices[i].a1 && angle < audioService.disc.slices[i].a2) {
						hoverDisc = i;
						break;
					}
				}
			}
			else {
				hoverRing = -1;
				hoverDisc = -1;
			}

			if (ringSelect > -1 && discSelect > -1 && ctrlKey) {
				var newFreq = startFreq + ((mouseDownY - args.clientY) * 2);
				audioService.disc.slices[discSelect].osc[ringSelect].freq = newFreq < 0 ? 0 : newFreq > 15000 ? 15000 : newFreq;
			}
		}

		function mouseUpEvent() {
			ringSelect = -1;
			discSelect = -1;
		}
		function ctrlKeyValue(e, args) {
			ctrlKey = args.ctrlKey;
		}

	}

})();

		/*

		.service("discService", function ($window, $timeout, themeService, $rootScope, SYNTHS, MENU_SIZE, mathService, colorService, localStorageService) {


			*//*-------------------------------------------------AUDIO STUFF------------------------------------------------*//*
			*//*-------------------------------------------------AUDIO STUFF------------------------------------------------*//*
			*//*-------------------------------------------------AUDIO STUFF------------------------------------------------*//*

			audioService.switchSynthTemplate = function (index) {
				//get current synth data
				var data = {
					osc1: {type: disc.node.osc1.type, detune: disc.node.osc1.detune.value},
					osc2: {type: disc.node.osc2.type, detune: disc.node.osc2.detune.value},
					osc3: {type: disc.node.osc3.type, detune: disc.node.osc2.detune.value},
					bitcrusher: {
						bypass: disc.fx.bitcrusher.bypass,
						bits: disc.fx.bitcrusher.bits,
						bufferSize: disc.fx.bitcrusher.bufferSize,
						normFreq: disc.fx.bitcrusher.normFreq
					},
					delay: {
						bypass: disc.fx.delay.bypass,
						wetLevel: disc.fx.delay.wetLevel.value,
						dryLevel: disc.fx.delay.dryLevel.value,
						feedback: disc.fx.delay.feedback.value,
						delayTime: disc.fx.delay.delayTime.value,
						cutoff: disc.fx.delay.cutoff.value
					},
					overdrive: {
						bypass: disc.fx.overdrive.bypass,
						curveAmount: disc.fx.overdrive.curveAmount,
						drive: disc.fx.overdrive.drive.value,
						outputGain: disc.fx.overdrive.outputGain.value
					},
					moogfilter: {
						bypass: disc.fx.moogfilter.bypass,
						bufferSize: disc.fx.moogfilter.bufferSize,
						cutoff: disc.fx.moogfilter.cutoff,
						resonance: disc.fx.moogfilter.resonance
					},
					tremolo: {
						bypass: disc.fx.tremolo.bypass,
						intensity: disc.fx.tremolo.intensity,
						rate: disc.fx.tremolo.rate,
						stereoPhase: disc.fx.tremolo.stereoPhase
					},
					convolver: {
						bypass: disc.fx.convolver.bypass,
						highCut: disc.fx.convolver.highCut.value,
						lowCut: disc.fx.convolver.lowCut.value,
						dryLevel: disc.fx.convolver.dryLevel.value,
						wetLevel: disc.fx.convolver.wetLevel.value
					}
				};


				//copy current synth and store, then change index
				disc.synthTemplates[disc.synthIndex] = angular.copy(data);
				disc.synthIndex = index;

				//load new synth template
				disc.loadSynth(index);
			};
			disc.loadSynth = function (index) {

				var template = disc.synthTemplates[index];

				console.log(template);
				disc.node.osc1.type = template.osc1.type;
				disc.node.osc2.type = template.osc2.type;
				disc.node.osc3.type = template.osc3.type;
				disc.node.osc1.detune.value = template.osc1.detune;
				disc.node.osc2.detune.value = template.osc2.detune;
				disc.node.osc3.detune.value = template.osc3.detune;
				disc.fx.bitcrusher.bypass = template.bitcrusher.bypass;
				disc.fx.bitcrusher.bits = template.bitcrusher.bits;
				disc.fx.bitcrusher.bufferSize = template.bitcrusher.bufferSize;
				disc.fx.bitcrusher.normFreq = template.bitcrusher.normFreq;
				disc.fx.delay.bypass = template.delay.bypass;
				disc.fx.delay.wetLevel.value = template.delay.wetLevel;
				disc.fx.delay.dryLevel.value = template.delay.dryLevel;
				disc.fx.delay.feedback.value = template.delay.feedback;
				disc.fx.delay.delayTime.value = template.delay.delayTime;
				disc.fx.delay.cutoff.value = template.delay.cutoff;
				disc.fx.overdrive.bypass = template.overdrive.bypass;
				disc.fx.overdrive.curveAmount = template.overdrive.curveAmount;
				disc.fx.overdrive.drive.value = template.overdrive.drive;
				disc.fx.overdrive.outputGain.value = template.overdrive.outputGain;
				disc.fx.moogfilter.bypass = template.moogfilter.bypass;
				disc.fx.moogfilter.bufferSize = template.moogfilter.bufferSize;
				disc.fx.moogfilter.cutoff = template.moogfilter.cutoff;
				disc.fx.moogfilter.resonance = template.moogfilter.resonance;

				disc.fx.tremolo.bypass = template.tremolo.bypass;
				disc.fx.tremolo.intensity = template.tremolo.intensity;
				disc.fx.tremolo.rate = template.tremolo.rate;
				disc.fx.tremolo.stereoPhase = template.tremolo.stereoPhase;

				disc.fx.convolver.bypass = template.convolver.bypass;
				disc.fx.convolver.highCut.value = template.convolver.highCut;
				disc.fx.convolver.lowCut.value = template.convolver.lowCut;
				disc.fx.convolver.dryLevel.value = template.convolver.dryLevel;
				disc.fx.convolver.wetLevel.value = template.convolver.wetLevel;


			};
			disc.loadSynth(disc.synthIndex);

			*//*----------------------------------------------------------------------------------------CLICK TRACK---------*//*

	*/