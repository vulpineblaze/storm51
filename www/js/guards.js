if(NT === undefined) {
  var NT = {};
}

NT.Guards = {
	
	startFrame: 1,
	startTick: 1,

	spriteScale: 4,
	spriteAngle: -5,
	collideSoftness: 30, 

	guardMaxTotal: 10,


	lineDelay: 3550,
	rarity: 900,
	spawnFrames: {start: 1650, end: 4000},

	thresholdOuter: 1000,
	thresholdInner: 300,
	relativeDepth: 10,

	publicName: "Guard",


	refresh: function (){
		NT.Guards.frameMult = NT.Globals.baseFrameMult * NT.Player.thisSheet.frameMult;
		NT.Guards.timedEvent;
	},


	createGuards: function (){
		NT.Guards.refresh();
		if(!NT.Globals.checkRarity(NT.Guards.rarity)){
			console.log("no guards", NT.Guards.rarity);
		}
		var guardShootAnimation = thisGame.anims.create({
	        key: 'shoot',
	        frames: thisGame.anims.generateFrameNumbers('guard',{
	        			frames:[8,24,49,50,49,50,49,50]}),
	        // frames: thisGame.anims.generateFrameNumbers('guard',{frames:[0,8,16,24,32,40,49,50]}),
	        // frames: thisGame.anims.generateFrameNumbers('guard'),
	        // frames: [0,8,16,24,32,40,49,50],
	        // frames: [0,8],
	        frameRate: 10,
	        repeat: -1
	    });
	    var guardDieAnimation = thisGame.anims.create({
	        key: 'die',
	        frames: thisGame.anims.generateFrameNumbers('guard',{
	        			frames:[41,42,43,44]}),
	        frameRate: 10,
	        repeat: 0
	    });
		// console.log("guard frames", thisGame.anims.generateFrameNumbers('guard'));
		NT.Guards.group = thisGame.add.group({
	        defaultKey: 'guard',
	        maxSize: NT.Guards.guardMaxTotal,
	        createCallback: function (child) {
	            child.setName('guard' + this.getLength());
	            child.publicName = NT.Guards.publicName;
	            child
				    .setActive(false)
				    .setVisible(false);

				child.on('animationcomplete', function (animation, frame) {
		            if(animation﻿.key === 'die'){
		                // console.log("anim played die", child,animation, frame);
		                NT.Guards.group.killAndHide(child)
		            }
		        }, this);
	            
	            // guard.anims.play('shoot');
	            // console.log('Created', guard.name);
	        },
	        removeCallback: function (guard) {
	            // console.log('Removed', guard.name);
	        }
	    });

	    NT.Guards.group.createMultiple({
	        visible: false,
	        active: false,
	        key: NT.Guards.group.defaultKey,
	        repeat: NT.Guards.group.maxSize - 1
	    });
	    
		// console.log("Guards:",NT.Guards.group);
	},


	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;
		// console.log("levelAcel" , levelAcelAdded);

		NT.Guards.group.children.iterate(function (child) {
			if(child.active){
				child.nowTick *= (NT.Guards.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				child.nowFrame *= (NT.Guards.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateGuards: function(){

		NT.Guards.group.children.iterate(function (child) {
			if(child.visible){
				// console.log("update visible: ",child.active, child.x, child.name,child);
			}
			if(child.active){
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (child.nowFrame/100);
				var angle = NT.Guards.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				var elevation = -(NT.Player.player.height - child.height) * frameOffset;


				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (child.uniqueHorzOffset * frameOffset);
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset 
						+ elevation
						+ NT.Globals.vertOneThird;
				child.setScale(frameOffset * NT.Guards.spriteScale);
				child.setAngle(angle);
				child.setPosition(x,y);
				child.setDepth(NT.Guards.relativeDepth + child.nowFrame);

				if(child.nowFrame >= 100){
					NT.Guards.group.killAndHide(child);
				}
				if(child.nowFrame >= 50){
					// child.setTint(Phaser.Display.Color.RandomRGB().color);
					// console.log("bullet can hit", elevation ,NT.Player.player.height , frameOffset , NT.Bullets.elevationPercent);
				}
			}
	    });



	},

	activateGuard: function (guard) {
	    guard
	    .setActive(true)
	    .setVisible(true)
	    .clearTint()
	    .play('shoot');

	    guard.nowTick = NT.Guards.startFrame;
		guard.nowFrame = NT.Guards.startTick;

		guard.uniqueHorzOffset = NT.Globals.randomThreshold(
	            				-NT.Guards.thresholdOuter,
	            				-NT.Guards.thresholdInner,
	            				NT.Guards.thresholdInner,
	            				NT.Guards.thresholdOuter);
		// guard.setDepth(50);

		// guard.setFrame(NT.Globals.randomNumber(0,4));
		    // .setTint(Phaser.Display.Color.RandomRGB().color)


// 
	},

	addGuard: function () {
		if(NT.Player.runTicks < NT.Guards.spawnFrames.start 
				|| NT.Player.runTicks > NT.Guards.spawnFrames.end){
			return;
		}

	    var guard = NT.Guards.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!guard) return; // None free

	    NT.Guards.activateGuard(guard);
	}

};

