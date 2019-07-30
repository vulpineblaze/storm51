if(NT === undefined) {
  var NT = {};
}

NT.Player = {

	refresh: function (){
		// NT.Player.player = 0;
		NT.Player.relativeHorz = 300;
		NT.Player.dragValue = 5;
		NT.Player.runTicks = 0;
		NT.Player.speedBoost = 1; 
		NT.Player.speedBoostEvent = "";
	},

	createPlayer: function(){
		NT.Player.refresh();

		var playerAnimation = thisGame.anims.create({
	        key: 'run',
	        frames: thisGame.anims.generateFrameNumbers('player'),
	        frameRate: 8,
	        yoyo: true,
	        repeat: -1
	    });

		NT.Player.player = thisGame.physics.add.sprite(NT.Globals.horzCenter,NT.Globals.vertOneThird * 2.5, 'player');
		NT.Player.player.setDepth(50);
		// NT.Player.player.anims.load('run');
		NT.Player.player.anims.play('run');

	},

	updatePlayer: function(){
		var tickMult = 1;
		if(NT.Player.speedBoost > 1){
			tickMult = NT.Player.speedBoost * 1.5;
		}
		NT.Player.runTicks += 1 * tickMult;
	}

	

	

};