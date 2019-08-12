if(NT === undefined) {
  var NT = {};
}

NT.Bullets = {
	
	lineDelay: 1200,
	collideSoftness: 5, 
	relativeDepth: 11,
	bulletMaxTotal: 200,

	firingHeightMult: 1.25,

	refresh: function (){
		NT.Bullets.startFrame = 1;
		NT.Bullets.startTick = 1;
		NT.Bullets.group = 0;

		NT.Bullets.spriteScale = 5;
		NT.Bullets.spriteScaleMin = 1;
		NT.Bullets.frameMult = NT.Globals.baseFrameMult * 1.03;

		

		NT.Bullets.timedEvent;

		NT.Bullets.angleSpinSpeed = 70;
		NT.Bullets.elevationPercent = 0.8; // relative to avatar height 
	},

	createBullets: function (){
		NT.Bullets.refresh();

		var bulletShootAnimation = thisGame.anims.create({
	        key: 'bullet_shoot',
	        frames: thisGame.anims.generateFrameNumbers('bullet'),
	        frameRate: 10,
	        repeat: -1
	    });
		NT.Bullets.group = thisGame.add.group({
	        defaultKey: 'bullet',
	        maxSize: NT.Bullets.bulletMaxTotal,
	        createCallback: function (bullet) {
	            bullet.setName('bullet' + this.getLength());
	            bullet.uniqueHorzOffset = 0;
	            // console.log('Created', bullet.name);
	        },
	        removeCallback: function (bullet) {
	            // console.log('Removed', bullet.name);
	        }
	    });
		NT.Bullets.group.createMultiple({
	        visible: false,
	        active: false,
	        key: NT.Bullets.group.defaultKey,
	        repeat: NT.Bullets.group.maxSize - 1
	    });
	    // NT.Bullets.enableBody = true;
	    // NT.Bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    
		// console.log("Bullets:",NT.Bullets.group);
	},

	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;
		// console.log("levelAcel" , levelAcelAdded);

		NT.Bullets.group.children.iterate(function (child) {
			if(child.active){
				child.nowTick *= (NT.Bullets.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				child.nowFrame *= (NT.Bullets.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateBullets: function(){

		NT.Bullets.group.children.iterate(function (bullet) {
			if(bullet.active){
				// console.log("update: ", bullet.name,bullet);

				// var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (barracade.uniqueHorzOffset * frameOffset);

				// var horzOffset = (NT.Globals.horzCenter) - bullet.targetX-300;
				// var horzOffset = (NT.Globals.horzCenter + bullet.uniqueHorzOffset) ;
				// var horzOffset = (NT.Globals.horzCenter) ;
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var guardOriginOffset = bullet.guardX;
				// var horzOffset = (NT.Globals.horzCenter);

				// var horzOffset = 0 ;
				var frameOffset = (bullet.nowFrame/100);
				var invertedFrameOffset = (100/bullet.nowFrame);
				var elevationOffset = (bullet.nowFrame - bullet.startFrame) / (100 - bullet.startFrame) ;
				var elevation = -(NT.Player.player.height - bullet.height) * elevationOffset;
				// var elevation = 0;
				// console.log(bullet.name , elevation, elevationOffset, bullet.startFrame, bullet.nowFrame);

				// var attackAdjusted = bullet.guardX - bullet.targetX * elevationOffset; 
				// var attackAdjusted = bullet.guardX - bullet.guardX * elevationOffset ; 
				var attackAdjusted = bullet.guardX  ; 
				// var attackAdjusted = 0; 
				// var randomTarget = NT.Globals.randomNumber(-NT.Globals.horzCenter,NT.Globals.horzCenter);

				var x = NT.Globals.horzCenter 
						+ (horzOffset * frameOffset) 
						+ (guardOriginOffset * frameOffset) 
						+ (bullet.targetX * elevationOffset)
						+ attackAdjusted;

				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset
						+ elevation
						+ NT.Globals.vertOneThird;

				var scale = NT.Bullets.spriteScaleMin + frameOffset * NT.Bullets.spriteScale;
				bullet.setScale(scale, scale / 3);
				bullet.setAngle(bullet.angle + NT.Globals.randomFloat(1,NT.Bullets.angleSpinSpeed));
				bullet.setPosition(x,y);
				bullet.setDepth(NT.Bullets.relativeDepth + bullet.nowFrame);

				if(bullet.nowFrame > 99){
					NT.Bullets.group.killAndHide(bullet);
				}
				var center = bullet.getCenter();
				if(center.x < 0
						|| center.x > NT.Globals.gameWidth
						|| center.y < 0
						|| center.y > NT.Globals.gameHeight
						){
					NT.Bullets.group.killAndHide(bullet);
				}
				if(bullet.nowFrame >= 70){
					bullet.setTint(Phaser.Display.Color.RandomRGB().color);
					// console.log("bullet can hit", elevation ,NT.Player.player.height , frameOffset , NT.Bullets.elevationPercent);
				}
			}
	    });

	},



	activateBullet: function (bullet, guard) {
	    bullet
	    .setActive(true)
	    .setVisible(true)
	    // .setTint(Phaser.Display.Color.RGBToString(NT.Globals.randomNumber(50,255), 255 , 255 ))
	    // .setTint(Phaser.Display.Color.RandomRGB().color)
	    .clearTint()
	    .play('bullet_shoot');

	    // console.log("bullet n guard", bullet, guard);
	    bullet.nowTick = guard.nowTick;
		bullet.nowFrame = guard.nowFrame;
		bullet.startFrame = guard.nowFrame;
		bullet.uniqueHorzOffset = guard.uniqueHorzOffset;
		// bullet.guardX = guard.x;
		bullet.guardX = guard.uniqueHorzOffset * (guard.nowFrame/100);
		// bullet.attackValue = NT.Bullets.attackValue;
		// bullet.targetX = NT.Player.relativeHorz + NT.Globals.randomNumber(
	 //            				-100,
	 //            				100);
		bullet.targetX = NT.Globals.randomNumber(
	            				-NT.Globals.horzCenter,
	            				NT.Globals.horzCenter);
		// bullet.setDepth(50);

		// bullet.setFrame(NT.Globals.randomNumber(0,4));
	    // console.log("bullet n guard", bullet.guardX ,bullet, guard);

	},

	addBullet: function (guard) {
	    var bullet = NT.Bullets.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!bullet) return; // None free

	    // console.log("guard fires",guard.x, NT.Globals.vertOneThird*2);
	    // console.log("guard doesnt fire",guard.y, NT.Globals.vertOneThird * NT.Bullets.firingHeightMult);

	    if(guard.y < NT.Globals.vertOneThird * NT.Bullets.firingHeightMult){
	    	// console.log("guard fires",guard.y, NT.Globals.vertOneThird * NT.Bullets.firingHeightMult);
	    	NT.Bullets.activateBullet(bullet, guard);
	    } 
	    if (guard.y > NT.Globals.vertOneThird * NT.Bullets.firingHeightMult){
	    	// console.log("guard dies",guard.y, NT.Globals.vertOneThird * NT.Bullets.firingHeightMult);
	    	guard.play('die');
	    }

	    
	}

};

