if(NT === undefined) {
  var NT = {};
}

NT.Player = {

	player: 0,
	relativeHorz: 300,
	dragValue: 5,
	speedBoost: 1, 
	speedBoostEvent: "",
	

	collideSoftness: 30,

	runTicks: 0,

	createPlayer: function(){
		var playerAnimation = thisGame.anims.create({
	        key: 'run',
	        frames: thisGame.anims.generateFrameNumbers('player'),
	        frameRate: 8,
	        yoyo: true,
	        repeat: -1
	    });

		NT.Player.player = thisGame.physics.add.sprite(NT.Globals.horzCenter,NT.Globals.vertOneThird * 2.5, 'player');
		NT.Player.player.setDepth(50);
		NT.Player.player.anims.load('run');
		NT.Player.player.anims.play('run');
    	// NT.Globals.game.physics.arcade.enable(NT.Player.player);
  //   	Object.assign(
		//   NT.Player.player,
		//   Phaser.Physics.Arcade.Components.Enable // etc.
		// );

		// NT.Player.player.anims.setRepeat(-1);
		// console.log("even test player",NT.Player.player.eventNames());
	},

	updatePlayer: function(){
		NT.Player.runTicks +=1;
	},

	checkOverlap: function(spriteB) {
		var retVal = false;
		if(spriteB){
			var boundsA = NT.Player.player.getBounds();
		    var boundsB = spriteB.getBounds();

		    // console.log("top bottom try", spriteB.name, boundsA.top, boundsB.bottom);

		    if(boundsA.top < boundsB.bottom){
		    	// console.log("left right try:",spriteB.name, boundsA.left, boundsA.right, boundsB.left);
		    	// console.log("left right try:",spriteB.name, boundsA, boundsB);
			    if(boundsB.left < boundsA.left 
			    		&& Math.abs(boundsB.left - boundsA.left) > NT.Player.collideSoftness
				    	&& boundsB.right > boundsA.left
			    		&& Math.abs(boundsB.right - boundsA.left) > NT.Player.collideSoftness
				    	){
				    // console.log("overlap?", boundsA, boundsB);
			    	retVal = true;
			    }else if(boundsB.left < boundsA.right 
			    		&& Math.abs(boundsB.left - boundsA.right) > NT.Player.collideSoftness
				    	&& boundsB.right > boundsA.right
			    		&& Math.abs(boundsB.right - boundsA.right) > NT.Player.collideSoftness
				    	){
				    // console.log("overlap?", boundsA, boundsB);
			    	retVal = true;
			    }
		    }

		    if(retVal){
		    	console.log("collide:",spriteB.name, spriteB.nowFrame, boundsA, boundsB);
		    }

		}
	    
		return retVal;
	},

	refresh: function (){
		NT.Player.player = 0;
		NT.Player.relativeHorz = 300;
		NT.Player.dragValue = 5;
		NT.Player.runTicks = 0;
	}

};