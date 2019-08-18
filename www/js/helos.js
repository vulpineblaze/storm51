if(NT === undefined) {
  var NT = {};
}

NT.Helos = {
	
	startFrame: 1,
	startTick: 1,

	spriteScale: 1,
	spriteAngle: -5,
	collideSoftness: 30, 

	heloMaxTotal: 100,

	rarity: 999,
	spawnFrames: {start: 100, end: 300},

	thresholdOuter: 3000,
	thresholdInner: 1,
	thresholdVert: 2000,
	relativeDepth: 10,
	// elevation: NT.Globals.vertOneThird*2,
	// elevation: 0,
	elevation: 200,

	hoverFrame: 20,
	hoverTilt: -10,
	hoverLeftTicker: 100,
	hoverRightTicker: 200,
	hoverCenterTicker: 100,

	publicName: "Attack Helicopter",

	refresh: function (){
		NT.Helos.frameMult = NT.Globals.baseFrameMult ;
		NT.Helos.timedEvent;
		NT.Helos.spawnOnce = true;
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
	            child.publicName = NT.Helos.publicName;

	            child
				    .setActive(false)
				    .setVisible(false);
				child.hoverState = "spawn";
				child.tempTicker = 0;
				child.elevation = NT.Helos.elevation;
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

				if(child.nowFrame > NT.Helos.hoverFrame && child.hoverState == "spawn"){
					child.hoverState = "hoverLeft";
					// console.log("helo hover start", child.y , child);
				}else if(child.hoverState == "hoverLeft"){
					child.tempTicker += 1;
					if(child.tempTicker > NT.Helos.hoverLeftTicker){
						child.hoverState = "hoverRight";
						child.tempTicker = 0;
					}
				}else if(child.hoverState == "hoverRight"){
					child.tempTicker += 1;
					if(child.tempTicker > NT.Helos.hoverRightTicker){
						child.hoverState = "hoverCenter";
						child.tempTicker = 0;
					}
				}else if(child.hoverState == "hoverCenter"){
					child.tempTicker += 1;
					if(child.tempTicker > NT.Helos.hoverCenterTicker){
						child.hoverState = "flyOver";
						child.tempTicker = 0;
						NT.Helos.frameMult *= 1.03;
					}
				}else{
					child.nowTick *= (NT.Helos.frameMult + levelAcelAdded) * NT.Player.speedBoost;
					child.nowFrame *= (NT.Helos.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				}
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

				// var elevation = -(NT.Player.player.height - child.height) * frameOffset;
				var slider = 0;
				if(child.hoverState == "hoverLeft"){
					slider = -child.tempTicker / NT.Helos.hoverLeftTicker;
				}else if(child.hoverState == "hoverRight"){
					slider = (-NT.Helos.hoverLeftTicker + child.tempTicker) / NT.Helos.hoverLeftTicker; // 2 left make a right lol
				}else if(child.hoverState == "hoverCenter"){
					slider = (NT.Helos.hoverCenterTicker - child.tempTicker) / NT.Helos.hoverCenterTicker;
				}
				child.uniqueHorzOffset = NT.Globals.horzCenter * slider * (1/frameOffset);


				var x = NT.Globals.horzCenter 
						+ (horzOffset * frameOffset) 
						+ child.uniqueHorzOffset * frameOffset;
				var y = NT.Globals.vertOneThird
						+ -NT.Globals.vertOneThird * frameOffset
						+ -child.uniqueElevation * frameOffset;

				var angle = (NT.Helos.spriteAngle) *  (horzOffset/NT.Globals.gameHeight)
							+ NT.Helos.hoverTilt * slider;

				child.setScale(frameOffset * NT.Helos.spriteScale);
				child.setAngle(angle);
				child.setPosition(x,y);
				child.setDepth(NT.Helos.relativeDepth + child.nowFrame);

				var tempVol = ((100+child.nowFrame)/(200));
				if(tempVol > 1){
					tempVol = 1;
				}
				// NT.Sounds.heliblades.volume = tempVol;

				if(child.nowFrame >= 100){
					NT.Helos.group.killAndHide(child);
					NT.Helos.spawnOnce = true;

				}
				if(child.nowFrame >= NT.Helos.hoverFrame){
					child.setTint(Phaser.Display.Color.RandomRGB().color);
					// NT.Sounds.heliblades.play({loop:true, volume: tempVol});
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

		child.uniqueHorzOffset = NT.Globals.horzCenter;


		child.uniqueElevation = 0;

		

		// child.uniqueElevation = NT.Globals.randomNumber(0,
	 //            				NT.Helos.thresholdVert);
		// // helo.setDepth(50);

		// helo.setFrame(NT.Globals.randomNumber(0,4));
		    // .setTint(Phaser.Display.Color.RandomRGB().color)


// 
	},

	addChild: function () {
		if(NT.Player.runTicks < NT.Helos.spawnFrames.start 
				|| NT.Player.runTicks > NT.Helos.spawnFrames.end){
			return;
		}

		NT.Helos.spawnOnce = false;

	    var child = NT.Helos.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!child) return; // None free

	    NT.Helos.activateChild(child);
	}

};

