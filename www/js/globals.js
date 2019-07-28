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


	colors: {
        desertLow:		"0xD49143",
        desertHigh:		"0xE8AF88",	
        road:		"0x857D74",	
        bumper:		"0xA29E9B"	
    },

	level: 1,
	winGameTicks: 1000,

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

	shutdownScene: function (type, message)
    {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        thisGame.input.keyboard.shutdown();

        NT.Line.group.children.each(line => {
        	line.destroy();
		});
        NT.Cactuses.group.children.each(cactus => {
        	cactus.destroy();
		});
        NT.Barracades.group.children.each(barracade => {
        	barracade.destroy();
		});

		NT.Line.refresh();
		NT.Player.refresh();

        thisGame.scene.start(type, { id: 2, text:  message  });
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


