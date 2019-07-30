if(NT === undefined) {
  var NT = {};
}

NT.Barracades = {
	
	barracades: [],
	startFrame: 1,
	startTick: 1,
	group: 0,

	spriteScale: 0.5,
	spriteAngle: -5,

	frameMult: 1.03,

	barracadeTotalCount: 0,
	barracadeMaxTotal: 20,

	lineDelay: 1000,
	timedEvent: "",

	threshold: 350,
	collideSoftness: 30, 


	updateBarracades: function(){

		NT.Barracades.group.children.iterate(function (barracade) {
			// console.log("update: ", barracade.name,barracade);
			barracade.nowTick *= NT.Barracades.frameMult * NT.Player.speedBoost;
			barracade.nowFrame *= NT.Barracades.frameMult * NT.Player.speedBoost;

			var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
			var frameOffset = (barracade.nowFrame/100);
			var angle = NT.Barracades.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

			var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (barracade.uniqueHorzOffset * frameOffset);
			var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
			barracade.setScale(frameOffset * NT.Barracades.spriteScale);
			barracade.setAngle(angle);
			barracade.setPosition(x,y);

			if(barracade.nowFrame >= 100){
				NT.Barracades.group.killAndHide(barracade);
			}

	    });

	},



	createBarracades: function (){

		NT.Barracades.group = thisGame.add.group({
	        defaultKey: 'barracade',
	        maxSize: NT.Barracades.barracadeMaxTotal,
	        createCallback: function (barracade) {
	            barracade.setName('barracade' + this.getLength());
	            barracade.uniqueHorzOffset = NT.Globals.randomNumber(
	            				-NT.Barracades.threshold,
	            				NT.Barracades.threshold);
	            console.log('Created', barracade.name);
	        },
	        removeCallback: function (barracade) {
	            console.log('Removed', barracade.name);
	        }
	    });

	    // NT.Barracades.enableBody = true;
	    // NT.Barracades.physicsBodyType = Phaser.Physics.ARCADE;
	    
		console.log("Barracades:",NT.Barracades.group);
	},

	activateBarracade: function (barracade) {
	    barracade
	    .setActive(true)
	    .setVisible(true);

	    barracade.nowTick = NT.Barracades.startFrame;
		barracade.nowFrame = NT.Barracades.startTick;
		// barracade.setDepth(50);

		// barracade.setFrame(NT.Globals.randomNumber(0,4));
	},

	addBarracade: function () {
	    var barracade = NT.Barracades.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!barracade) return; // None free

	    NT.Barracades.activateBarracade(barracade);
	}

};

