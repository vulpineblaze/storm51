if(NT === undefined) {
  var NT = {};
}

NT.Cactuses = {
	
	startFrame: 1,
	startTick: 1,

	cactusMaxTotal: 3000,
	spriteAngle: -5,

	lineDelay: 15,
	addPerTimerEvent: 5,
	thresholdOuter: 15000,
	// thresholdOuter: 6000,
	thresholdInner: 350,
	relativeDepth: 0,

	refresh: function (){
		NT.Cactuses.frameMult = NT.Globals.baseFrameMult * NT.Player.thisSheet.frameMult;
		NT.Cactuses.timedEvent;
	},		

	createCactuses: function (){
		NT.Cactuses.refresh();

		NT.Cactuses.group = thisGame.add.group({
	        defaultKey: 'cactus',
	        maxSize: NT.Cactuses.cactusMaxTotal,
	        createCallback: function (cactus) {
	            cactus.setName('cactus' + this.getLength());
	            
	        },
	        removeCallback: function (cactus) {
	        }
	    });

		NT.Cactuses.frontloadCactus();

		// console.log("Cactuses:",NT.Cactuses.group);
	},

	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;

		NT.Cactuses.group.children.iterate(function (cactus) {
			if(cactus.active){
				cactus.nowTick *= (NT.Cactuses.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				cactus.nowFrame *= (NT.Cactuses.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},
	
	updateCactuses: function(){

		NT.Cactuses.group.children.iterate(function (cactus) {
			// console.log("update: ", cactus.name,cactus);
			if(cactus.active){

				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (cactus.nowFrame/100);
				var angle = NT.Cactuses.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				var x = NT.Globals.horzCenter + (horzOffset * frameOffset) + (cactus.uniqueHorzOffset * frameOffset);
				var y = NT.Globals.vertOneThird 
						+ (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset;
				cactus.setScale(frameOffset * 2);
				cactus.setAngle(angle);
				cactus.setPosition(x,y);
				cactus.setDepth(NT.Cactuses.relativeDepth + cactus.nowFrame);

				if(cactus.nowFrame >= 100){
					NT.Cactuses.group.killAndHide(cactus);
				}

				var center = cactus.getCenter();
				if(center.x < 0
						|| center.x > NT.Globals.gameWidth
						|| center.y < 0
						|| center.y > NT.Globals.gameHeight
						){
					NT.Cactuses.group.killAndHide(cactus);
				}
			}
	    });

	},

	activateCactus: function (cactus, forceFrame=0) {
	    cactus
	    .setActive(true)
	    .setVisible(true);

	    cactus.uniqueHorzOffset = NT.Globals.randomThreshold(
	            				-NT.Cactuses.thresholdOuter,
	            				-NT.Cactuses.thresholdInner,
	            				NT.Cactuses.thresholdInner,
	            				NT.Cactuses.thresholdOuter);

	    if(forceFrame){
	    	cactus.nowTick = forceFrame;
			cactus.nowFrame = forceFrame;
	    }else{
	    	cactus.nowTick = NT.Cactuses.startFrame;
			cactus.nowFrame = NT.Cactuses.startTick;
	    }
	    
		cactus.setFrame(NT.Globals.randomNumber(0,cactus.frame.texture.frameTotal-2));

	},

	addCactus: function (forceFrame=0) {
	    var cactus = NT.Cactuses.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!cactus) return; // None free
	    NT.Cactuses.activateCactus(cactus, forceFrame);
	},

	frontloadCactus: function(){
		var i,j;
		var forceFrame = (NT.Cactuses.lineDelay / NT.Globals.millisPerTick);
		var emulatedFrame = 1;
		for(i=forceFrame;i<100;i+=forceFrame){
			emulatedFrame *= NT.Cactuses.frameMult;

			for(j=0;j<NT.Cactuses.addPerTimerEvent*1;++j){
	    		if(emulatedFrame > 100){
	    			return;
	    		}
	            NT.Cactuses.addCactus(emulatedFrame);
	        }
		}
	}


};

