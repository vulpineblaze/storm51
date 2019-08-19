if(NT === undefined) {
  var NT = {};
}

NT.Line = {

	startFrame: 1,
	startTick: 1,

	lineTotalCount: 0,
	spriteAngle: -75,


	// lineDelay: 10000,
	lineDelay: 400,
	relativeDepth: 0,
	maxTotal: 40,

	
	refresh: function (){
		NT.Line.group;
		NT.Line.frameMult = NT.Globals.baseFrameMult * NT.Player.thisSheet.frameMult;

		NT.Line.timedEvent;

	},


	createLines: function (){
		NT.Line.refresh();

		NT.Line.group = thisGame.add.group({
	        defaultKey: 'line',
	        maxSize: NT.Line.maxTotal,
	        createCallback: function (line) {
	            line.setName('line' + this.getLength());
	            // console.log('Created', line.name);
	        },
	        removeCallback: function (line) {
	            // console.log('Removed', line.name);
	        }
	    });
	    NT.Line.frontloadLine();
	},

	updateTicks: function(){
		var percentComplete = 1 - (NT.Globals.winGameTicks - NT.Player.runTicks)/NT.Globals.winGameTicks;
		var levelAcelAdded =  NT.Globals.progressFrameMultAdded * percentComplete;
		// console.log("levelAcel" , levelAcelAdded);

		NT.Line.group.children.iterate(function (child) {
			if(child.active){
				child.nowTick *= (NT.Line.frameMult + levelAcelAdded) * NT.Player.speedBoost;
				child.nowFrame *= (NT.Line.frameMult + levelAcelAdded) * NT.Player.speedBoost;
			}
		});
	},

	updateLines: function(){

		NT.Line.group.children.iterate(function (line) {
			if(line.active){
				var horzOffset = NT.Globals.horzCenter - NT.Player.relativeHorz;
				var frameOffset = (line.nowFrame/100);
				var angle = NT.Line.spriteAngle *  (horzOffset/NT.Globals.gameHeight);

				var x = NT.Globals.horzCenter + (horzOffset * frameOffset);
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
				// line.setScale(30*frameOffset,0.15*frameOffset);
				line.setScale(frameOffset);
				line.setAngle(angle);
				line.setPosition(x,y);
				line.setDepth(NT.Line.relativeDepth + line.nowFrame);

				// NT.Messages.debugText.setStroke('#000', 5);
				// NT.Messages.debugText.setFontSize(20);
				// NT.Messages.debugText.setText(""+ Math.round(line.nowFrame, 1));
				// NT.Messages.debugText.setY(y);

				if(line.nowFrame >= 100){
					NT.Line.group.killAndHide(line);
				}else if(line.nowFrame >= 70){
					// line.setTint(Phaser.Display.Color.RandomRGB().color);
				}
			}
	    });

	},

	activateLine: function (line, forceFrame) {
	    line
	    .setActive(true)
	    .setVisible(true)
	    .clearTint();

	    if(forceFrame){
			line.nowTick = forceFrame;
			line.nowFrame = forceFrame;
			// console.log("line forceFrame", forceFrame, line);
	    }else{
	    	line.nowTick = NT.Line.startFrame;
			line.nowFrame = NT.Line.startTick;
	    }
		    
	},

	addLine: function (forceFrame=0) {
	    var line = NT.Line.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!line) return; // None free

	    NT.Line.activateLine(line,forceFrame);
	},

	frontloadLine: function(){
		var i,j;
		var forceFrame = (NT.Line.lineDelay / NT.Globals.millisPerTick);
		var emulatedFrame = 1;
		// console.log("loop forceFrame", forceFrame);
		for(i=forceFrame;i<150;i+=forceFrame){
			for(j=0;j<forceFrame;++j){
				emulatedFrame *= NT.Line.frameMult;
			}
			

    		if(emulatedFrame > 150){
    			return;
    		}
            NT.Line.addLine(emulatedFrame);
		}
	}

	

};