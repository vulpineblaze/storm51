if(NT === undefined) {
  var NT = {};
}

NT.Player = {

	masterSheets: [
	    { 	
	    	key: 'pony', 
	    	path: 'img/pony_quickie_trim2_80x200.png', 
	    	frameWidth: 80, 
	    	frameHeight: 200,
	    	frameMult: 1.015,
	    	agilityAdded: 2,
	    	tickFactorIncrease: 0.015 
	    },
	    { 	
	    	key: 'naruto', 
	    	path: 'img/naruto_run_quickie.png', 
	    	frameWidth: 110, 
	    	frameHeight: 140,
	    	frameMult: 1.005,
	    	agilityAdded: 10,
	    	tickFactorIncrease: 0.005  
	    }
	],

	refresh: function (){
		// NT.Player.player = 0;
		NT.Player.relativeHorz = 300;
		NT.Player.dragValue = 9 + NT.Player.thisSheet.agilityAdded;
		NT.Player.dragThreshold = 5 + NT.Player.thisSheet.agilityAdded/2;
		NT.Player.runTicks = 0;
		NT.Player.speedBoost = 1; 
		NT.Player.speedBoostEvent = "";
		NT.Player.relativeDepth = 99;
		// NT.Player.thisSheet = 0;
	},

	createPlayer: function(){
		NT.Player.refresh();

		var playerAnimation = thisGame.anims.create({
	        key: 'run'+NT.Player.thisSheet.key,
	        frames: thisGame.anims.generateFrameNumbers(NT.Player.thisSheet.key),
	        frameRate: 8,
	        yoyo: true,
	        repeat: -1
	    });
        console.log("player spirte", NT.Player.thisSheet.key);

		NT.Player.player = thisGame.physics.add.sprite(
							NT.Globals.horzCenter,
							NT.Globals.vertOneThird * 2.5, 
							NT.Player.thisSheet.key);
		NT.Player.player.setDepth(NT.Player.relativeDepth);
		NT.Player.player.setInteractive();
		// NT.Player.player.anims.load('run');
		NT.Player.player.anims.play('run'+NT.Player.thisSheet.key);
		thisGame.input.setDraggable(NT.Player.player);

	},

	updateTicks: function(){
		var tickMult = 1;
		if(NT.Player.speedBoost > 1){
			tickMult = NT.Player.speedBoost * 1.5;
		}
		NT.Player.runTicks += 1 * (tickMult + NT.Player.thisSheet.tickFactorIncrease);
	},

	updatePlayer: function(){
		
	}

	

	

};