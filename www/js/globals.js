if(NT === undefined) { 
  var NT = {};
}

NT.Globals = {
	game: 0,

	gameWidth: 600,
	gameHeight: 840,

	moves: 0,

	movesUpdate: 0,
	movesDifficultyOffset: 5,

	musicMax: 0.6,
	musicVolume: 0.6,

	squarePx: 60,
	squareWidth: 9,
	squareHeight: 12,
	verticalOpenSpace: 80,

	deadlockTimeDelay: 1500,
	gameTimeStart: 0,

	baseFrameMult: 1.029,


	colors: {
        desertLow:		"0xD49143",
        desertHigh:		"0xE8AF88",	
        road:		"0x857D74",	
        bumper:		"0xA29E9B"	
    },

	level: 1,
	winGameTicks: 2000,
	millisPerTick: 30,

	randomNumber: function (min, max) {  
	    var min = Math.ceil(min); 
	    var max = Math.floor(max); 
	    return Math.floor(Math.random() * (max - min + 1)) + min; 
	}, 


	randomThreshold: function (exLeft, inLeft, inRight, exRight) {  
		var left = NT.Globals.randomNumber(exLeft, inLeft);
		var right = NT.Globals.randomNumber(inRight, exRight);
	    return Math.random() < 0.5 ? left : right;
	},

	randomFloat: function (min, max) {
        return Math.random() * (max - min) + min;
	},


	checkOverlap: function(spriteA, spriteB, softness=0) {
		var retVal = false;
		if(spriteA && spriteB){
			var boundsA = spriteA.getBounds();
		    var boundsB = spriteB.getBounds();

		    // console.log("top bottom try", spriteB.name, boundsA.top, boundsB.bottom);

		    if(boundsA.top < boundsB.bottom){
		    	// console.log("left right try:",spriteB.name, boundsA.left, boundsA.right, boundsB.left);
		    	// console.log("left right try:",spriteB.name, boundsA, boundsB);
			    if(boundsB.left < boundsA.left 
			    		&& Math.abs(boundsB.left - boundsA.left) > softness
				    	&& boundsB.right > boundsA.left
			    		&& Math.abs(boundsB.right - boundsA.left) > softness
				    	){
				    // console.log("overlap?", boundsA, boundsB);
			    	retVal = true;
			    }else if(boundsB.left < boundsA.right 
			    		&& Math.abs(boundsB.left - boundsA.right) > softness
				    	&& boundsB.right > boundsA.right
			    		&& Math.abs(boundsB.right - boundsA.right) > softness
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

	shutdownScene: function (time, type, message)
    {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        thisGame.input.keyboard.shutdown();

        NT.Messages.savedTime = time;

        NT.Line.group.children.each(line => {
        	line.destroy();
		});
        NT.Cactuses.group.children.each(cactus => {
        	cactus.destroy();
		});
        NT.Barracades.group.children.each(barracade => {
        	barracade.destroy();
		});

		

        thisGame.scene.start(type, { id: 2, text:  message  });
    },

    initKeys: function (thisGame){
    	var i; 
    	// keyString = "W,1";
    	keyString = [87]; // W = 87
		for(i=1;i<10;++i){
			// keys = this.input.keyboard.addKeys(''+i);
			keyString.push(48+i);
		}    
		NT.Globals.keys = thisGame.input.keyboard.addKeys(keyString);
		console.log("keys",NT.Globals.keys,keyString);
    } 
};


NT.Globals.squarePxHalf = NT.Globals.squarePx/2;

NT.Globals.horizontalOffset = NT.Globals.squarePxHalf 
				+ (NT.Globals.gameWidth - (NT.Globals.squarePx * NT.Globals.squareWidth))/2;

// finds the number of px on each side of play area, sans alloted openspace at top
NT.Globals.verticalOffset = NT.Globals.squarePxHalf 
				+ ((NT.Globals.gameHeight - NT.Globals.verticalOpenSpace) 
				- (NT.Globals.squarePx * NT.Globals.squareHeight))/2;

NT.Globals.verticalOffsetTop = NT.Globals.verticalOpenSpace + NT.Globals.verticalOffset;

NT.Globals.vertOneThird = NT.Globals.gameHeight / 3;	
NT.Globals.horzCenter = NT.Globals.gameWidth / 2;	





