angular.module('visualizerServiceModule', [])
    .service("visualizerService", function($window, $timeout, $rootScope,themeService,eventService,discService, MENU_SIZE){


        var cnv = document.querySelectorAll('.visualizerCanvas')[0];
        var ctx = cnv.getContext("2d");
        var visualizer = this;
        var w, h,xCenter,yCenter = 0;
        var prom;

        visualizer.visualizerIndex = angular.isObject(discSynthLocalStorage) ? discSynthLocalStorage.visualizerIndex : 0;
        visualizer.visualizers = visualizers;

        visualizer.windowResize = function() {
            w = $window.innerWidth;
            h = $window.innerHeight;
            cnv.style.width = w +'px';
            cnv.style.height = h + 'px';
            xCenter = (w-MENU_SIZE)/2;
            yCenter = h/ 2;
            angular.element(cnv).attr({width:  w, height: h	});
        };

        visualizer.clearCanvas = function() {
            ctx.clearRect(0,0, w,h);
        }
        visualizer.timer = function() {
            // clear or redraw canvas and run funciton

            if(typeof visualizer[visualizer.visualizers[visualizer.visualizerIndex].functionToRun] == 'function'){
                if (visualizer.visualizers[visualizer.visualizerIndex].clearCanvas) {
                    visualizer.clearCanvas();
                }
                else {
                    var oldArray = ctx.getImageData(0,0,w,h);
                    for(var d=3;d<oldArray.data.length;d+=4){//dim it with some feedback, I'm using .9
                        oldArray.data[d] = Math.floor(oldArray.data[d]*.9);
                    }
                    ctx.putImageData(oldArray,0,0);
                }
                visualizer[visualizer.visualizers[visualizer.visualizerIndex].functionToRun]();
            }
            prom = $timeout(visualizer.timer, 30);

        };

        visualizer.windowResize();
        visualizer.timer();

/*--------------------------------------------------------------------------------------------------------------------*/
        visualizer.getFreqArray = function(depth,removal) {
            var theSmallArray = [];
            var theFreqArray =  new Uint8Array(discService.node.analyser.frequencyBinCount);
            discService.node.analyser.getByteFrequencyData(theFreqArray);
            var x = depth == undefined ? 1 : depth;
            var len = theFreqArray.length - removal;
            for (var i =0; i < len; i += x) {
                theSmallArray.push( theFreqArray[i] );
            }
            return theSmallArray;
        };
		visualizer.getTimeArray = function(depth,removal) {
            var theSmallArray = [];
			var theTimeArray  = new Uint8Array(discService.node.analyser.frequencyBinCount);
            discService.node.analyser.getByteTimeDomainData(theTimeArray);
            var x = depth == undefined ? 1 : depth;
            var len = theTimeArray.length - removal;
            for (var i =0; i < len; i += x) {
                theSmallArray.push( theTimeArray[i] );
            }
			return theSmallArray;
		};
        visualizer.getAverageDB = function() {
            var dbArray = new Uint8Array(discService.node.analyser.frequencyBinCount);
            discService.node.analyser.getByteFrequencyData(dbArray);
            var values = 0;
            for (var i = 0; i < dbArray.length; i++) {
                values += dbArray[i];
            }
            return values / dbArray.length;
        };

/*--------------------------------------------------------------------------------------------------------------------*/
        var whirlyParticles = [];
        function createParticle(firstLoad) {
            return {
                position: { x: xCenter, y: yCenter },
                size: firstLoad ? 0 : randomNumber(10,20),
                fillColor: randomRGBA(0.4),
                xMod: randomNumber(-4,4),
                yMod: randomNumber(-4,4),
                angle: 0,
                speed: randomNumber(0.1,0.2),
                orbit: randomNumber(1,8)
            }
        }
        for (var i = 0; i < 1000; i++) {
            whirlyParticles.push( createParticle(true) );
        }
        visualizer.visParticles = function() {
            var db = visualizer.getAverageDB()/ 10;
            for (var i = 0; i < 1000; i++) {
                var particle = whirlyParticles[i];
                particle.position.x += particle.xMod;
                particle.position.y += particle.yMod;
                particle.angle += particle.speed;
                if (db > 4) {
                    var orbit = particle.orbit;
                    particle.position.x += Math.cos(i + particle.angle) * orbit;
                    particle.position.y += Math.sin(i + particle.angle) * orbit;
                    if (particle.position.x < 0 || particle.position.x > w  ||
                        particle.position.y < 0 || particle.position.y > h ||
                        particle.size < 0) {
                        whirlyParticles[i] = createParticle();
                    }
                }
                particle.size -= 0.3;
                if (particle.size > 0) {
                    ctx.beginPath();
                    ctx.fillStyle = particle.fillColor;
                    ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI*2, true);
                    ctx.fill();
                }
            }
        };
/*--------------------------------------------------------------------------------------------------------------------*/

        visualizer.visScope = function() {
            var db = visualizer.getAverageDB();
            if (db > 10) {
                var timeArray = visualizer.getTimeArray(2,100);
                var barWidth = w / timeArray.length;
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = "rgba(255,255,255,0.7)";

                for (var i = 0; i < timeArray.length; i++) {
                    var percent = timeArray[i] / 256;
                    var percent2 = i < timeArray.length ? timeArray[i+1] / 256 : timeArray[i] / 256;
                    var height = h * percent;
                    var height2 = h * percent2;
                    var offset = h - height - 1;
                    var offset2 = h - height2 - 1;
                    ctx.moveTo(i*barWidth,offset);
                    ctx.lineTo(i*barWidth+barWidth,offset2);
                }
                ctx.stroke();
                ctx.closePath();
            }
        };

/*--------------------------------------------------------------------------------------------------------------------*/
        var lines = [0];
        visualizer.visTunnel = function() {
            var nextIndex = false;
            var db = visualizer.getAverageDB();
            ctx.lineWidth = 1;
            ctx.strokeStyle = hexToRGBA("#FFFFFF",db > 10 ? db/200 : 0);

            for (var index = 0; index < lines.length + 1; index++) {
                if (lines[index] != undefined) {
                    lines[index] += 1 + (db/5);
                    ctx.beginPath();

                    ctx.arc(
                        xCenter,
                        yCenter,
                        lines[index],
                        0,
                        2 * Math.PI,
                        true
                    );
                    ctx.stroke();
                }
                else if (!nextIndex && lines.length){
                    nextIndex = true;
                    if (lines[index-1] > 8 && lines.length < 300) { lines.push(1); }
                }
            }
            for (index = 0; index < lines.length; index++) {
                if (lines[index] > xCenter + 60) {lines.splice(index,1);}
            }
        };

/*--------------------------------------------------------------------------------------------------------------------*/



        visualizer.visMathMachine = function() {
            var totalLines = discService.discLength;
            var angleSize = (1 / totalLines) * Math.PI*2;
            var db = visualizer.getAverageDB();

            for (var i = 0; i < totalLines; i++) {
                var a1 = angleSize * i;
                var a2 = angleSize * (i+1);
                var playAngle = discService.clickTrack == i;
                var numConnectors = playAngle ? 25 : 10;
                for (var connector = 0; connector < numConnectors; connector++) {
                    var angleAdjust = connector/numConnectors;
                    var rad = db * 3 * ( playAngle ? 1.8 : 1);
                    var x1 = xCenter + (rad * angleAdjust) * Math.cos(a1);
                    var y1 = yCenter + (rad * angleAdjust) * Math.sin(a1);
                    var x2 = xCenter + (rad * (1 - angleAdjust)) * Math.cos(a2);
                    var y2 = yCenter + (rad * (1 - angleAdjust)) * Math.sin(a2);
                    ctx.beginPath();
                    ctx.strokeStyle = playAngle ? "#FFFFFF" : "rgba(255,255,255,0.7)";
                    ctx.moveTo(x1,y1);
                    ctx.lineTo(x2,y2);
                    ctx.stroke();
                    ctx.closePath();

                }
            }
            ctx.strokeStyle = "";
        };

/*--------------------------------------------------------------------------------------------------------------------*/
        var particles = [];

        function burst() {
            this.speed = randomNumber(3,10);
            this.x = xCenter;
            this.y = yCenter;
            this.xD = randomNumber(-1,1);
            this.yD = randomNumber(-1,1);
            this.rad = 10+Math.random()*150;
            this.color = randomHex();
            this.o = 1;
            this.drawBorder = Math.random() >= 0.8;
        }

        for(var i = 0; i < 40; i++) {
            particles.push(new burst());
        }

        visualizer.visBurst = function() {
            var db = visualizer.getAverageDB();
            db = db < 10 ? 0 : db;

            if (db > 120) {console.log(1);}
            for(var i = 0; i < particles.length; i++) {
                var p = particles[i];
                if (p.rad > 0) {
                    ctx.beginPath();
                    p.o -= 0.02;
                    if (p.o < 0){p.o = 0;}

                    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rad);
                    gradient.addColorStop(0, "rgba(255,255,255,0.7)");
                    gradient.addColorStop(0.5, hexToRGBA(p.color, p.o));
                    gradient.addColorStop(1, hexToRGBA(p.color, 0));
                    ctx.fillStyle = gradient;

                    ctx.arc(p.x, p.y, p.rad, Math.PI*2, false);

                    if (p.drawBorder) {
                        ctx.strokeStyle = "rgba(255,255,255,0.3)";
                        ctx.stroke();
                    }
                    ctx.fill();

                    p.rad -= (db > 120 ? 6 : 3) - (db/100);
                    p.x += (p.xD * p.speed);
                    p.y += (p.yD * p.speed);
                }

                if(p.rad < 0 && db > 0) { particles[i] = new burst(); }
            }
        };

    });

