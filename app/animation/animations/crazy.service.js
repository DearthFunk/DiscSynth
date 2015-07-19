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