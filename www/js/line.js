if(NT === undefined) {
  var NT = {};
}

NT.Line = {

	startFrame: 1,
	startTick: 1,

	lineTotalCount: 0,


	lineDelay: 10000,
	// lineDelay: 400,
	relativeDepth: 0,
	
	refresh: function (){
		NT.Line.group;
		NT.Line.frameMult = NT.Globals.baseFrameMult;

		NT.Line.timedEvent;

	},


	createLines: function (){
		NT.Line.refresh();

		NT.Line.group = thisGame.add.group({
	        defaultKey: 'line',
	        maxSize: 20,
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
		NT.Line.group.children.iterate(function (line) {
			if(line.active){
				line.nowTick *= NT.Line.frameMult * NT.Player.speedBoost;
				line.nowFrame *= NT.Line.frameMult * NT.Player.speedBoost;
			}
		});
	},

	updateLines: function(){

		NT.Line.group.children.iterate(function (line) {
			if(line.active){
				var horzOffset = NT.Globals.horzCenter - NT.Player.relativeHorz;
				var frameOffset = (line.nowFrame/100);
				var angle = -90 *  (horzOffset/NT.Globals.gameHeight);

				var x = NT.Globals.horzCenter + (horzOffset * frameOffset);
				var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
				line.setScale(30*frameOffset,0.15*frameOffset);
				// line.setScale(frameOffset);
				// line.setAngle(angle);
				line.setPosition(x,y);
				line.setDepth(NT.Line.relativeDepth + line.nowFrame);

				NT.Messages.debugText.setStroke('#000', 5);
				NT.Messages.debugText.setFontSize(20);
				NT.Messages.debugText.setText(""+ Math.round(line.nowFrame, 1));
				NT.Messages.debugText.setY(y);

				if(line.nowFrame >= 100){
					NT.Line.group.killAndHide(line);
				}else if(line.nowFrame >= 70){
					line.setTint(Phaser.Display.Color.RandomRGB().color);
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
			console.log("line forceFrame", forceFrame, line);
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
		var i,j=0;
		var adj=0.09;
		var forceFrame = NT.Line.lineDelay / NT.Globals.millisPerTick;
		console.log("line outer forceFrame", forceFrame,NT.Line.lineDelay , NT.Globals.millisPerTick);
		for(i=forceFrame;i<100;i+=forceFrame){
			j+=1;
	        // NT.Line.addLine(j*forceFrame*adj);
		}
	}

	

};