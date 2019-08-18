if(NT === undefined) {
  var NT = {};
}

NT.Barracades = {
	
	barracades: [],
	startFrame: 1,
	startTick: 1,

	spriteScale: 0.5,
	spriteAngle: -5,

	barracadeTotalCount: 0,
	barracadeMaxTotal: 20,
	publicName: "Barracade",

	lineDelay: 1000,

	threshold: 350,
	collideSoftness: 30, 
	relativeDepth: 10,

	refresh: function (){
		NT.Barracades.frameMult = NT.Globals.baseFrameMult;
		NT.Barracades.timedEvent;
	},		

	createBarracades: function (){
		NT.Barracades.refresh();
		NT.Barracades.group = thisGame.add.group({
	        defaultKey: 'barracade',
	        maxSize: NT.Barracades.barracadeMaxTotal,
	        createCallback: function (child) {
	            child.setName('barracade' + this.getLength());
	            child.publicName = NT.Barracades.publicName;

	        },
	        removeCallback: function (barracade) {
	        }
	    });
	},

	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;

		NT.Barracades.group.children.iterate(function (barracade) {
			if(barracade.active){
				barracade.nowTick *= (NT.Barracades.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				barracade.nowFrame *= (NT.Barracades.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateBarracades: function(){

		NT.Barracades.group.children.iterate(function (barracade) {
			if(barracade.active){
				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (barracade.nowFrame/100);
				var angle = NT.Barracades.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (barracade.uniqueHorzOffset * frameOffset);
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird ) * frameOffset + NT.Globals.vertOneThird;
				barracade.setScale(frameOffset * NT.Barracades.spriteScale);
				barracade.setAngle(angle);
				barracade.setPosition(x,y);
				barracade.setDepth(NT.Barracades.relativeDepth + barracade.nowFrame);

				if(barracade.nowFrame >= 100){
					NT.Barracades.group.killAndHide(barracade);
				}
				if(barracade.nowFrame >= 70){
					barracade.setTint(Phaser.Display.Color.RandomRGB().color);
				}
			}
	    });

	},


	activateBarracade: function (barracade) {
	    barracade
	    .setActive(true)
	    .setVisible(true)
	    .clearTint();

	    barracade.nowTick = NT.Barracades.startFrame;
		barracade.nowFrame = NT.Barracades.startTick;

		barracade.uniqueHorzOffset = NT.Globals.randomNumber(
	            				-NT.Barracades.threshold,
	            				NT.Barracades.threshold);
		// barracade.setDepth(50);

		// barracade.setFrame(NT.Globals.randomNumber(0,4));
	},

	addBarracade: function () {
	    var barracade = NT.Barracades.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!barracade) return; // None free

	    NT.Barracades.activateBarracade(barracade);
	}

};

