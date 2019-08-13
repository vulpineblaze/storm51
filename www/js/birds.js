if(NT === undefined) {
  var NT = {};
}

NT.Birds = {
	
	startFrame: 1,
	startTick: 1,

	spriteScale: 4,
	spriteAngle: -5,
	collideSoftness: 30, 

	birdMaxTotal: 100,

	lineDelay: 1500,
	rarity: 999,
	spawnFrames: {start: 0, end: 999999},

	thresholdOuter: 3000,
	thresholdInner: 1,
	thresholdVert: 2000,
	relativeDepth: 10,

	refresh: function (){
		NT.Birds.frameMult = NT.Globals.baseFrameMult * 1.02;
		NT.Birds.timedEvent;
	},


	createChildren: function (){
		NT.Birds.refresh();
		if(!NT.Globals.checkRarity(NT.Birds.rarity)){
			console.log("no birds", NT.Birds.rarity);
		}
		var birdFlapAnimation = thisGame.anims.create({
	        key: 'flap',
	        frames: thisGame.anims.generateFrameNumbers('bird'),
	        frameRate: 30,
	        repeat: -1
	    });

		// console.log("bird frames", thisGame.anims.generateFrameNumbers('bird'));
		NT.Birds.group = thisGame.add.group({
	        defaultKey: 'bird',
	        maxSize: NT.Birds.birdMaxTotal,
	        createCallback: function (child) {
	            child.setName('bird' + this.getLength());
	            child
				    .setActive(false)
				    .setVisible(false);
	        },
	        removeCallback: function (child) {
	            // console.log('Removed', bird.name);
	        }
	    });

	    NT.Birds.group.createMultiple({
	        visible: false,
	        active: false,
	        key: NT.Birds.group.defaultKey,
	        repeat: NT.Birds.group.maxSize - 1
	    });
	    
		// console.log("Birds:",NT.Birds.group);
	},


	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;
		// console.log("levelAcel" , levelAcelAdded);

		NT.Birds.group.children.iterate(function (child) {
			if(child.active){
				child.nowTick *= (NT.Birds.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				child.nowFrame *= (NT.Birds.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateChildren: function(){

		NT.Birds.group.children.iterate(function (child) {
			if(child.visible){
				// console.log("update visible: ",child.active, child.x, child.name,child);
			}
			if(child.active){
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (child.nowFrame/100);
				var angle = NT.Birds.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				// var elevation = -(NT.Player.player.height - child.height) * frameOffset;


				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (child.uniqueHorzOffset * frameOffset);
				var y = NT.Globals.vertOneThird
						+ -NT.Globals.vertOneThird * frameOffset
						+ -child.uniqueElevation * frameOffset;
				child.setScale(frameOffset * NT.Birds.spriteScale);
				child.setAngle(angle);
				child.setPosition(x,y);
				child.setDepth(NT.Birds.relativeDepth + child.nowFrame);

				if(child.nowFrame >= 100){
					NT.Birds.group.killAndHide(child);
				}
				if(child.nowFrame >= 50){
					child.setTint(Phaser.Display.Color.RandomRGB().color);
					// console.log("bullet can hit", elevation ,NT.Player.player.height , frameOffset , NT.Bullets.elevationPercent);
				}
			}
	    });



	},

	activateChild: function (child) {
	    child
	    .setActive(true)
	    .setVisible(true)
	    .clearTint()
	    .play('flap');

	    child.nowTick = NT.Birds.startFrame;
		child.nowFrame = NT.Birds.startTick;

		child.uniqueHorzOffset = NT.Globals.randomThreshold(
	            				-NT.Birds.thresholdOuter,
	            				-NT.Birds.thresholdInner,
	            				NT.Birds.thresholdInner,
	            				NT.Birds.thresholdOuter);


		child.uniqueElevation = NT.Globals.randomNumber(0,
	            				NT.Birds.thresholdVert);
		// bird.setDepth(50);

		// bird.setFrame(NT.Globals.randomNumber(0,4));
		    // .setTint(Phaser.Display.Color.RandomRGB().color)


// 
	},

	addChild: function () {
		if(NT.Player.runTicks < NT.Birds.spawnFrames.start 
				|| NT.Player.runTicks > NT.Birds.spawnFrames.end){
			return;
		}

	    var child = NT.Birds.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!child) return; // None free

	    NT.Birds.activateChild(child);
	}

};

