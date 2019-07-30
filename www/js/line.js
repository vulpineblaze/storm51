if(NT === undefined) {
  var NT = {};
}

NT.Line = {

	lines: [],
	startFrame: 1,
	startTick: 1,
	group: 0,

	frameMult: 1.03,

	lineTotalCount: 0,


	lineDelay: 400,
	timedEvent: "",

	updateLines: function(){

		NT.Line.group.children.iterate(function (line) {
			// console.log("update: ", line.name,line);
			line.nowTick *= NT.Line.frameMult * NT.Player.speedBoost;
			line.nowFrame *= NT.Line.frameMult * NT.Player.speedBoost;

			var horzOffset = NT.Globals.horzCenter - NT.Player.relativeHorz;
			var frameOffset = (line.nowFrame/100);
			var angle = -90 *  (horzOffset/NT.Globals.gameHeight);

			var x = NT.Globals.horzCenter + (horzOffset * frameOffset);
			var y = (NT.Globals.gameHeight - NT.Globals.vertOneThird) * frameOffset + NT.Globals.vertOneThird;
			line.setScale(frameOffset);
			line.setAngle(angle);
			line.setPosition(x,y);

			if(line.nowFrame >= 100){
				NT.Line.group.killAndHide(line);
			}

	    });

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
	},

	activateLine: function (line) {
	    line
	    .setActive(true)
	    .setVisible(true);

	    line.nowTick = NT.Line.startFrame;
		line.nowFrame = NT.Line.startTick;
	},

	addLine: function () {
	    var line = NT.Line.group.get(NT.Globals.horzCenter, NT.Globals.vertOneThird);

	    if (!line) return; // None free

	    NT.Line.activateLine(line);
	},

	refresh: function (){
		NT.Line.lines = [];

		NT.Line.group = 0;


		NT.Line.lineTotalCount = 0;

		NT.Line.timedEvent = "";
	}

};