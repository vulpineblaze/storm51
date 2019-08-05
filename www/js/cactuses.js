if(NT === undefined) {
  var NT = {};
}

NT.Cactuses = {
	
	startFrame: 1,
	startTick: 1,

	cactusMaxTotal: 3000,

	lineDelay: 15,
	addPerTimerEvent: 5,
	thresholdOuter: 15000,
	// thresholdOuter: 6000,
	thresholdInner: 350,
	relativeDepth: 0,

	refresh: function (){
		NT.Cactuses.frameMult = NT.Globals.baseFrameMult;
		NT.Cactuses.timedEvent;
	},		

	createCactuses: function (){
		NT.Cactuses.refresh();

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
	    // NT.Cactuses.group.createMultiple({
	    //     active: false,
	    //     key: NT.Cactuses.group.defaultKey,
	    //     repeat: NT.Cactuses.group.maxSize - 1
	    // });
		NT.Cactuses.frontloadCactus();

		console.log("Cactuses:",NT.Cactuses.group);
	},

	updateTicks: function(){
		NT.Cactuses.group.children.iterate(function (cactus) {
			if(cactus.active){
				cactus.nowTick *= NT.Cactuses.frameMult * NT.Player.speedBoost;
				cactus.nowFrame *= NT.Cactuses.frameMult * NT.Player.speedBoost;
			}
		});
	},
	
	updateCactuses: function(){

		NT.Cactuses.group.children.iterate(function (cactus) {
			// console.log("update: ", cactus.name,cactus);
			if(cactus.active){

				var horzOffset = (NT.Globals.horzCenter) - NT.Player.relativeHorz;
				var frameOffset = (cactus.nowFrame/100);
				var angle = -90 *  (horzOffset/NT.Globals.gameHeight);

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

	    if(forceFrame){
	    	cactus.nowTick = forceFrame;
			cactus.nowFrame = forceFrame;
			// console.log("in forceFrame", forceFrame, cactus.x, cactus.y);
	    }else{
	    	cactus.nowTick = NT.Cactuses.startFrame;
			cactus.nowFrame = NT.Cactuses.startTick;
	    }
	    
		cactus.setFrame(NT.Globals.randomNumber(0,cactus.frame.texture.frameTotal-2));

		// console.log("cactus frmaes",cactus.frame.texture);
		// console.log("cactus frmaes",cactus.frame.texture.frameTotal);
	},

	addCactus: function (forceFrame=0) {
	    var cactus = NT.Cactuses.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!cactus) return; // None free
	    // console.log("addCactus forceFrame", forceFrame);
	    NT.Cactuses.activateCactus(cactus, forceFrame);
	},

	frontloadCactus: function(){
		var i,j;
		var forceFrame = (NT.Cactuses.lineDelay / NT.Globals.millisPerTick);
		var emulatedFrame = 1;
		// console.log("loop forceFrame", ticksRatio,NT.Cactuses.lineDelay , NT.Globals.millisPerTick);
		for(i=forceFrame;i<100;i+=forceFrame){
			emulatedFrame *= NT.Cactuses.frameMult;

			// console.log("forceframe i",i);
			for(j=0;j<NT.Cactuses.addPerTimerEvent*1;++j){
	    		// console.log("loop forceFrame", i, forceFrame,emulatedFrame);
	    		if(emulatedFrame > 100){
	    			return;
	    		}
	            NT.Cactuses.addCactus(emulatedFrame);
	        }
	        // NT.Cactuses.updateCactuses();
		}
		// NT.Cactuses.updateCactuses();
	}


};

