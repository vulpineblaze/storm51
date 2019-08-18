if(NT === undefined) {
  var NT = {};
}

NT.Deweys = {
	
	deweys: [],
	startFrame: 1,
	startTick: 1,

	spriteScale: 0.5,
	spriteAngle: -5,

	deweyTotalCount: 0,
	deweyMaxTotal: 10,
	deweySpeedBoost: 1.05,

	collideSoftness: 0,

	lineDelay: 1100,

	threshold: 1000,

	boostTime: 300,
	relativeDepth: 10,

	refresh: function (){
		NT.Deweys.frameMult = NT.Globals.baseFrameMult;
		NT.Deweys.timedEvent;
	},


	createDeweys: function (){
		NT.Deweys.refresh();
		NT.Deweys.group = thisGame.add.group({
	        defaultKey: 'dewey',
	        maxSize: NT.Deweys.deweyMaxTotal,
	        createCallback: function (dewey) {
	            dewey.setName('dewey' + this.getLength());
	        },
	        removeCallback: function (dewey) {
	        }
	    });
	    
		// console.log("Deweys:",NT.Deweys.group);
	},

	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;
		// console.log("levelAcel" , levelAcelAdded);

		NT.Deweys.group.children.iterate(function (child) {
			if(child.active){
				child.nowTick *= (NT.Deweys.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				child.nowFrame *= (NT.Deweys.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateDeweys: function(){
		
		NT.Deweys.group.children.iterate(function (dewey) {
			// console.log("update: ", dewey.name,dewey);
			if(dewey.active){
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (dewey.nowFrame/100);
				var angle = NT.Deweys.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (dewey.uniqueHorzOffset * frameOffset);
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
				dewey.setScale(frameOffset * NT.Deweys.spriteScale);
				dewey.clearTint();
				dewey.setAngle(angle);
				dewey.setPosition(x,y);
				dewey.setDepth(NT.Deweys.relativeDepth + dewey.nowFrame);

				if(dewey.nowFrame >= 100){
					NT.Deweys.group.killAndHide(dewey);
				}else if(dewey.nowFrame >= 70){
					dewey.setTint(Phaser.Display.Color.RandomRGB().color);
				}
			}
	    });

	},

	activateDewey: function (dewey) {
	    dewey
	    .setActive(true)
	    .setVisible(true);

	    dewey.nowTick = NT.Deweys.startFrame;
		dewey.nowFrame = NT.Deweys.startTick;

		dewey.uniqueHorzOffset = NT.Globals.randomNumber(
	            				-NT.Deweys.threshold,
	            				NT.Deweys.threshold);
	},

	addDewey: function () {
	    var dewey = NT.Deweys.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!dewey) return; // None free

	    NT.Deweys.activateDewey(dewey);
	},

	checkTapped: function (pointer) {
		NT.Deweys.group.children.iterate(function (dewey) {
		    var bounds = dewey.getBounds();
			// console.log("checkin tapped:",dewey.name, bounds, pointer);

			if(pointer.downX > bounds.left
				&& pointer.downX < bounds.right
				&& pointer.downY < bounds.bottom
				&& pointer.downY > bounds.top
				){
				console.log("tapped:",dewey.name);
				NT.Deweys.beenTapped(dewey);   
			}

	    });
	},

	beenTapped: function(child){
		NT.Deweys.group.killAndHide(child);
		NT.Player.speedBoost = NT.Deweys.deweySpeedBoost;
        NT.Player.speedBoostEvent = thisGame.time.delayedCall(NT.Deweys.boostTime, 
                                            function(){NT.Player.speedBoost = 1}, 
                                            [], this); 
        NT.Sounds.dewycollide.play();
	}

};

