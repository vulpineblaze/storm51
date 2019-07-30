if(NT === undefined) {
  var NT = {};
}

NT.Bullets = {
	
	lineDelay: 800,
	collideSoftness: 5, 

	refresh: function (){
		NT.Bullets.startFrame = 1;
		NT.Bullets.startTick = 1;
		NT.Bullets.group = 0;

		NT.Bullets.spriteScale = 10;
		NT.Bullets.frameMult = 1.05;

		NT.Bullets.bulletTotalCount = 0;
		NT.Bullets.bulletMaxTotal = 200;

		NT.Bullets.timedEvent;

		NT.Bullets.angleSpinSpeed = 50;
	},


	updateBullets: function(){

		NT.Bullets.group.children.iterate(function (bullet) {
			if(bullet.active){
				// console.log("update: ", bullet.name,bullet);
				bullet.nowTick *= NT.Bullets.frameMult * NT.Player.speedBoost;
				bullet.nowFrame *= NT.Bullets.frameMult * NT.Player.speedBoost;

				var horzOffset = (NT.Globals.horzCenter) - bullet.targetX;
				var frameOffset = (bullet.nowFrame/100);

				var attackAdjusted = bullet.guardX; 

				var x = NT.Globals.horzCenter 
						+ (horzOffset * frameOffset) 
						+ attackAdjusted;
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
				var scale = frameOffset * NT.Bullets.spriteScale;
				bullet.setScale(scale, scale / 5);
				bullet.setAngle(bullet.angle + NT.Globals.randomFloat(1,NT.Bullets.angleSpinSpeed));
				bullet.setPosition(x,y);

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
			}
	    });

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
	        active: false,
	        key: NT.Bullets.group.defaultKey,
	        repeat: NT.Bullets.group.maxSize - 1
	    });
	    // NT.Bullets.enableBody = true;
	    // NT.Bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    
		console.log("Bullets:",NT.Bullets.group);
	},

	activateBullet: function (bullet, guard) {
	    bullet
	    .setActive(true)
	    .setVisible(true)
	    // .setTint(Phaser.Display.Color.RGBToString(NT.Globals.randomNumber(50,255), 255 , 255 ))
	    .setTint(Phaser.Display.Color.RandomRGB().color)
	    .play('bullet_shoot');

	    // console.log("bullet n guard", bullet, guard);
	    bullet.nowTick = guard.nowTick;
		bullet.nowFrame = guard.nowFrame;
		bullet.uniqueHorzOffset = guard.uniqueHorzOffset;
		// bullet.guardX = guard.x;
		bullet.guardX = guard.uniqueHorzOffset * (guard.nowFrame/100);
		// bullet.attackValue = NT.Bullets.attackValue;
		bullet.targetX = NT.Player.relativeHorz + NT.Globals.randomNumber(
	            				-100,
	            				100);
		// bullet.setDepth(50);

		// bullet.setFrame(NT.Globals.randomNumber(0,4));
	    // console.log("bullet n guard", bullet.guardX ,bullet, guard);

	},

	addBullet: function (guard) {
	    var bullet = NT.Bullets.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!bullet) return; // None free

	    NT.Bullets.activateBullet(bullet, guard);
	}

};
