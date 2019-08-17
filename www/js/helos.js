if(NT === undefined) {
  var NT = {};
}

NT.Helos = {
	
	startFrame: 1,
	startTick: 1,

	spriteScale: 4,
	spriteAngle: -5,
	collideSoftness: 30, 

	heloMaxTotal: 100,

	lineDelay: 1500,
	rarity: 999,
	spawnFrames: {start: 0, end: 999999},

	thresholdOuter: 3000,
	thresholdInner: 1,
	thresholdVert: 2000,
	relativeDepth: 10,

	refresh: function (){
		NT.Helos.frameMult = NT.Globals.baseFrameMult * 1.02;
		NT.Helos.timedEvent;
	},


	createChildren: function (){
		NT.Helos.refresh();
		if(!NT.Globals.checkRarity(NT.Helos.rarity)){
			console.log("no helos", NT.Helos.rarity);
		}
		var heloFlapAnimation = thisGame.anims.create({
	        key: 'helo_flap',
	        frames: thisGame.anims.generateFrameNumbers('helo'),
	        frameRate: 30,
	        repeat: -1
	    });

		// console.log("helo frames", thisGame.anims.generateFrameNumbers('helo'));
		NT.Helos.group = thisGame.add.group({
	        defaultKey: 'helo',
	        maxSize: NT.Helos.heloMaxTotal,
	        createCallback: function (child) {
	            child.setName('helo' + this.getLength());
	            child
				    .setActive(false)
				    .setVisible(false);
	        },
	        removeCallback: function (child) {
	            // console.log('Removed', helo.name);
	        }
	    });

	    NT.Helos.group.createMultiple({
	        visible: false,
	        active: false,
	        key: NT.Helos.group.defaultKey,
	        repeat: NT.Helos.group.maxSize - 1
	    });
	    
		// console.log("Helos:",NT.Helos.group);
	},


	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;
		// console.log("levelAcel" , levelAcelAdded);

		NT.Helos.group.children.iterate(function (child) {
			if(child.active){
				child.nowTick *= (NT.Helos.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				child.nowFrame *= (NT.Helos.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateChildren: function(){

		NT.Helos.group.children.iterate(function (child) {
			if(child.visible){
				// console.log("update visible: ",child.active, child.x, child.name,child);
			}
			if(child.active){
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (child.nowFrame/100);
				var angle = NT.Helos.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				// var elevation = -(NT.Player.player.height - child.height) * frameOffset;


				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (child.uniqueHorzOffset * frameOffset);
				var y = NT.Globals.vertOneThird
						+ -NT.Globals.vertOneThird * frameOffset
						+ -child.uniqueElevation * frameOffset;
				child.setScale(frameOffset * NT.Helos.spriteScale);
				child.setAngle(angle);
				child.setPosition(x,y);
				child.setDepth(NT.Helos.relativeDepth + child.nowFrame);

				if(child.nowFrame >= 100){
					NT.Helos.group.killAndHide(child);
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
	    .play('helo_flap');

	    child.nowTick = NT.Helos.startFrame;
		child.nowFrame = NT.Helos.startTick;

		child.uniqueHorzOffset = NT.Globals.randomThreshold(
	            				-NT.Helos.thresholdOuter,
	            				-NT.Helos.thresholdInner,
	            				NT.Helos.thresholdInner,
	            				NT.Helos.thresholdOuter);


		child.uniqueElevation = NT.Globals.randomNumber(0,
	            				NT.Helos.thresholdVert);
		// helo.setDepth(50);

		// helo.setFrame(NT.Globals.randomNumber(0,4));
		    // .setTint(Phaser.Display.Color.RandomRGB().color)


// 
	},

	addChild: function () {
		if(NT.Player.runTicks < NT.Helos.spawnFrames.start 
				|| NT.Player.runTicks > NT.Helos.spawnFrames.end){
			return;
		}

	    var child = NT.Helos.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!child) return; // None free

	    NT.Helos.activateChild(child);
	}

};

