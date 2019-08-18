if(NT === undefined) {
  var NT = {};
}

NT.Bullets = {
	
	lineDelay: 1200,
	collideSoftness: 5, 
	relativeDepth: 11,
	bulletMaxTotal: 200,

	firingHeightMult: 1.25,

	publicName: "Bullet",


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
	        createCallback: function (child) {
	            child.setName('bullet' + this.getLength());
	            child.uniqueHorzOffset = 0;
	            child.publicName = NT.Bullets.publicName;

	            // console.log('Created', bullet.name);
	        },
	        removeCallback: function (child) {
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

		NT.Bullets.group.children.iterate(function (child) {
			if(child.active){
				// console.log("update: ", child.name,child);

				// var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (barracade.uniqueHorzOffset * frameOffset);

				// var horzOffset = (NT.Globals.horzCenter) - child.targetX-300;
				// var horzOffset = (NT.Globals.horzCenter + child.uniqueHorzOffset) ;
				// var horzOffset = (NT.Globals.horzCenter) ;
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var guardOriginOffset = child.guardX;
				// var horzOffset = (NT.Globals.horzCenter);

				// var horzOffset = 0 ;
				var frameOffset = (child.nowFrame/100);
				var invertedFrameOffset = (100/child.nowFrame);
				var elevationOffset = (child.nowFrame - child.startFrame) / (100 - child.startFrame) ;
				var elevation = -(NT.Player.player.height - child.height) * elevationOffset;
				var guardElevation = -child.guardElevation * ((100-child.nowFrame)/100);
				// var elevation = 0;
				// console.log(child.name , elevation, elevationOffset, child.startFrame, child.nowFrame);
				// console.log(child.name , guardElevation, elevation, elevationOffset, child.startFrame, child.nowFrame);

				// var attackAdjusted = child.guardX - child.targetX * elevationOffset; 
				// var attackAdjusted = child.guardX - child.guardX * elevationOffset ; 
				var attackAdjusted = child.guardX  ; 
				// var attackAdjusted = 0; 
				// var randomTarget = NT.Globals.randomNumber(-NT.Globals.horzCenter,NT.Globals.horzCenter);

				var x = NT.Globals.horzCenter 
						+ (horzOffset * frameOffset) 
						+ (guardOriginOffset * frameOffset) 
						+ (child.targetX * elevationOffset)
						+ attackAdjusted;

				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset
						+ elevation
						+ guardElevation
						+ NT.Globals.vertOneThird;

				var scale = NT.Bullets.spriteScaleMin + frameOffset * NT.Bullets.spriteScale;
				child.setScale(scale, scale / 3);
				child.setAngle(child.angle + NT.Globals.randomFloat(1,NT.Bullets.angleSpinSpeed));
				child.setPosition(x,y);
				child.setDepth(NT.Bullets.relativeDepth + child.nowFrame);

				if(child.nowFrame > 99){
					NT.Bullets.group.killAndHide(child);
				}
				var center = child.getCenter();
				if(center.x < 0
						|| center.x > NT.Globals.gameWidth
						|| center.y < 0
						|| center.y > NT.Globals.gameHeight
						){
					NT.Bullets.group.killAndHide(child);
				}
				if(child.nowFrame >= 70){
					child.setTint(Phaser.Display.Color.RandomRGB().color);
					// console.log("child can hit", elevation ,NT.Player.player.height , frameOffset , NT.Bullets.elevationPercent);
				}
				// console.log("bullet y",child.name , guardElevation, elevation, child.y);

			}
	    });

	},



	activateBullet: function (child, guard) {
	    child
	    .setActive(true)
	    .setVisible(true)
	    // .setTint(Phaser.Display.Color.RGBToString(NT.Globals.randomNumber(50,255), 255 , 255 ))
	    // .setTint(Phaser.Display.Color.RandomRGB().color)
	    .clearTint()
	    .play('bullet_shoot');

	    // console.log("bullet n guard", bullet, guard);
	    child.nowTick = guard.nowTick;
		child.nowFrame = guard.nowFrame;
		child.startFrame = guard.nowFrame;
		child.uniqueHorzOffset = guard.uniqueHorzOffset;
		// bullet.guardX = guard.x;
		child.guardX = guard.uniqueHorzOffset * (guard.nowFrame/100);
		if(guard.elevation){
			child.guardElevation = guard.elevation;
			// console.log("guard elevation", child.guardElevation, guard);
		}else{
			child.guardElevation = 1;
		}
		// bullet.attackValue = NT.Bullets.attackValue;
		// bullet.targetX = NT.Player.relativeHorz + NT.Globals.randomNumber(
	 //            				-100,
	 //            				100);
		child.targetX = NT.Globals.randomNumber(
	            				-NT.Globals.horzCenter,
	            				NT.Globals.horzCenter);

		child.publicName = guard.publicName + "'s " + child.publicName;
		// bullet.setDepth(50);

		// bullet.setFrame(NT.Globals.randomNumber(0,4));
	    // console.log("bullet n guard", child.guardY , NT.Globals.vertOneThird,child, guard);

	},

	addBullet: function (guard) {
	    var child = NT.Bullets.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!child) return; // None free

	    // console.log("guard fires",guard.x, NT.Globals.vertOneThird*2);
	    // console.log("guard doesnt fire",guard.y, NT.Globals.vertOneThird * NT.Bullets.firingHeightMult);

	    if(guard.y < NT.Globals.vertOneThird * NT.Bullets.firingHeightMult){
	    	// console.log("guard fires",guard.y, NT.Globals.vertOneThird * NT.Bullets.firingHeightMult);
	    	NT.Bullets.activateBullet(child, guard);
	    } 
	    if (guard.y > NT.Globals.vertOneThird * NT.Bullets.firingHeightMult){
	    	// console.log("guard dies",guard.y, NT.Globals.vertOneThird * NT.Bullets.firingHeightMult);
	    	guard.play('die');
	    }

	    
	}

};

