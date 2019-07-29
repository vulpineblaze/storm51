if(NT === undefined) {
  var NT = {};
}

NT.Bullets = {
	
	refresh: function (){
		NT.Bullets.startFrame = 1;
		NT.Bullets.startTick = 1;
		NT.Bullets.group = 0;

		NT.Bullets.spriteScale = 10;
		NT.Bullets.spriteAngle = -45;

		NT.Bullets.frameMult = 1.08;

		NT.Bullets.bulletTotalCount = 0;
		NT.Bullets.bulletMaxTotal = 200;

		NT.Bullets.lineDelay = 100;
		NT.Bullets.timedEvent = "";

		NT.Bullets.attackInc = 0.04;
		NT.Bullets.attackValue = 0;
	},


	updateBullets: function(){

		NT.Bullets.group.children.iterate(function (bullet) {
			// console.log("update: ", bullet.name,bullet);
			bullet.nowTick *= NT.Bullets.frameMult * NT.Player.speedBoost;
			bullet.nowFrame *= NT.Bullets.frameMult * NT.Player.speedBoost;
			bullet.attackValue += NT.Bullets.attackInc;

			var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
			var frameOffset = (bullet.nowFrame/100);
			// var angle = NT.Bullets.spriteAngle *  (horzOffset/NT.Globals.gameHeight);
			var closeOnPlayer = (NT.Player.relativeHorz - bullet.uniqueHorzOffset) * 0.5;

			var x = NT.Globals.horzCenter 
					+ (horzOffset * frameOffset) 
					+ (bullet.uniqueHorzOffset * frameOffset)
					+ closeOnPlayer * bullet.attackValue;
			var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
			bullet.setScale(frameOffset * NT.Bullets.spriteScale);
			// bullet.setAngle(angle);
			bullet.setPosition(x,y);

			if(bullet.nowFrame >= 100){
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
	    .setTint(Phaser.Display.Color.RandomRGB().color)
	    .play('bullet_shoot');

	    bullet.nowTick = guard.nowTick;
		bullet.nowFrame = guard.nowFrame;
		bullet.uniqueHorzOffset = guard.uniqueHorzOffset;
		bullet.attackValue = NT.Bullets.attackValue;
		// bullet.setDepth(50);

		// bullet.setFrame(NT.Globals.randomNumber(0,4));
	},

	addBullet: function (guard) {
	    var bullet = NT.Bullets.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!bullet) return; // None free

	    NT.Bullets.activateBullet(bullet, guard);
	}

};

