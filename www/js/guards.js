if(NT === undefined) {
  var NT = {};
}

NT.Guards = {
	
	startFrame: 1,
	startTick: 1,

	spriteScale: 4,
	spriteAngle: -5,

	guardMaxTotal: 10,

	lineDelay: 1000,

	thresholdOuter: 3000,
	thresholdInner: 300,
	relativeDepth: 10,

	refresh: function (){
		NT.Guards.frameMult = NT.Globals.baseFrameMult;
		NT.Guards.timedEvent;
	},


	createGuards: function (){
		NT.Guards.refresh();

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
		// console.log("guard frames", thisGame.anims.generateFrameNumbers('guard'));
		NT.Guards.group = thisGame.add.group({
	        defaultKey: 'guard',
	        maxSize: NT.Guards.guardMaxTotal,
	        createCallback: function (guard) {
	            guard.setName('guard' + this.getLength());
	            guard.uniqueHorzOffset = NT.Globals.randomThreshold(
	            				-NT.Guards.thresholdOuter,
	            				-NT.Guards.thresholdInner,
	            				NT.Guards.thresholdInner,
	            				NT.Guards.thresholdOuter);
	            // guard.anims.play('shoot');
	            // console.log('Created', guard.name);
	        },
	        removeCallback: function (guard) {
	            // console.log('Removed', guard.name);
	        }
	    });

	    NT.Guards.group.createMultiple({
	        active: false,
	        key: NT.Guards.group.defaultKey,
	        repeat: NT.Guards.group.maxSize - 1
	    });
		// NT.Guards.group.playAnimation('shoot');
	    // NT.Guards.enableBody = true;
	    // NT.Guards.physicsBodyType = Phaser.Physics.ARCADE;
	    
		console.log("Guards:",NT.Guards.group);
	},


	updateTicks: function(){
		NT.Guards.group.children.iterate(function (guard) {
			if(guard.active){
				guard.nowTick *= NT.Guards.frameMult * NT.Player.speedBoost;
				guard.nowFrame *= NT.Guards.frameMult * NT.Player.speedBoost;
			}
		});
	},
	
	updateGuards: function(){

		NT.Guards.group.children.iterate(function (guard) {
			if(guard.visible){
				// console.log("update: ",guard.visible, guard.name,guard);
			}
			if(guard.active){
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (guard.nowFrame/100);
				var angle = NT.Guards.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (guard.uniqueHorzOffset * frameOffset);
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
				guard.setScale(frameOffset * NT.Guards.spriteScale);
				guard.setAngle(angle);
				guard.setPosition(x,y);
				guard.setDepth(NT.Guards.relativeDepth + guard.nowFrame);

				if(guard.nowFrame >= 100){
					NT.Guards.group.killAndHide(guard);
				}
			}
	    });

	},

	activateGuard: function (guard) {
	    guard
	    .setActive(true)
	    .setVisible(true)
	    .play('shoot');

	    guard.nowTick = NT.Guards.startFrame;
		guard.nowFrame = NT.Guards.startTick;
		// guard.setDepth(50);

		// guard.setFrame(NT.Globals.randomNumber(0,4));
		    // .setTint(Phaser.Display.Color.RandomRGB().color)


// 
	},

	addGuard: function () {
	    var guard = NT.Guards.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!guard) return; // None free

	    NT.Guards.activateGuard(guard);
	}

};

