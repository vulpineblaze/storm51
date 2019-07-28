if(NT === undefined) {
  var NT = {};
}

NT.Cactuses = {
	
	cactuses: [],
	startFrame: 1,
	startTick: 1,
	group: 0,

	frameMult: 1.03,

	cactusTotalCount: 0,
	cactusMaxTotal: 2000,

	lineDelay: 5,
	timedEvent: "",

	thresholdOuter: 6000,
	thresholdInner: 350,

	updateCactuses: function(){

		NT.Cactuses.group.children.iterate(function (cactus) {
			// console.log("update: ", cactus.name,cactus);
			cactus.nowTick *= NT.Cactuses.frameMult * NT.Player.speedBoost;
			cactus.nowFrame *= NT.Cactuses.frameMult * NT.Player.speedBoost;

			var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
			var frameOffset = (cactus.nowFrame/100);
			var angle = -90 *  (horzOffset/NT.Globals.gameHeight);

			var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (cactus.uniqueHorzOffset * frameOffset);
			var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
			cactus.setScale(frameOffset * 2);
			cactus.setAngle(angle);
			cactus.setPosition(x,y);

			if(cactus.nowFrame >= 100){
				NT.Cactuses.group.killAndHide(cactus);
			}

	    });

	},



	createCactuses: function (){


		NT.Cactuses.group = thisGame.add.group({
	        defaultKey: 'cactus',
	        maxSize: NT.Cactuses.cactusMaxTotal,
	        createCallback: function (cactus) {
	            cactus.setName('cactus' + this.getLength());
	            cactus.uniqueHorzOffset = NT.Globals.randomThreshold(
	            				-NT.Cactuses.thresholdOuter,
	            				-NT.Cactuses.thresholdInner,
	            				NT.Cactuses.thresholdInner,
	            				NT.Cactuses.thresholdOuter);
	            // console.log('Created', cactus.name);
	        },
	        removeCallback: function (cactus) {
	            // console.log('Removed', cactus.name);
	        }
	    });
		console.log("Cactuses:",NT.Cactuses.group);
	},

	activateCactus: function (cactus) {
	    cactus
	    .setActive(true)
	    .setVisible(true);

	    cactus.nowTick = NT.Cactuses.startFrame;
		cactus.nowFrame = NT.Cactuses.startTick;
		cactus.setFrame(NT.Globals.randomNumber(0,4));
	},

	addCactus: function () {
	    var cactus = NT.Cactuses.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!cactus) return; // None free

	    NT.Cactuses.activateCactus(cactus);
	}

};

