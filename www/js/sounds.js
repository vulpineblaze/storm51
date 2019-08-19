if(NT === undefined) { 
  var NT = {};
}

NT.Sounds = {
	brroww: 0,

	allSounds: [
		{
			name: 'barricadecollide',
			volume: 0.10,
			loop: false
		},
		{
			name: 'bulletcollide2',
			volume: 0.9,
			loop: false
		},
		{
			name: 'dewycollide',
			volume: 0.15,
			loop: false
		},
		{
			name: 'heliblades',
			volume: 0.9,
			loop: false
		},
		{
			name: 'hitsign',
			volume: 0.9,
			loop: false
		},
		{
			name: 'running',
			volume: 0.9,
			loop: false
		},
		{
			name: 'fiftycal',
			volume: 0.4,
			loop: false
		},
		{
			name: 'ninemil',
			volume: 0.25,
			loop: false
		},
		{
			name: 'birdflap',
			volume: 0.7,
			loop: false
		},
		{
			name: 'losecondition',
			volume: 0.25,
			loop: false
		},
		{
			name: 'endgamealienbeam',
			volume: 0.25,
			loop: false
		},
		{
			name: 'TheyCantStopUsAll',
			volume: 0.25,
			loop: true
		},
		{
			name: 'emptySound',
			volume: 0.01,
			loop: false
		}
	],

	myPlay: function (name, vol=1){
		console.log("sounds", name, NT.Sounds);
		var tune = NT.Sounds.findTuneByName(name);
		NT.Sounds[tune.name].play({volume: tune.volume * vol, loop: tune.loop});
	},

	findTuneByName: function (name){
		var i;
		for(i=0;i<NT.Sounds.allSounds.length;++i){
			var tune = NT.Sounds.allSounds[i];
			if(tune.name == name){
				return tune;
			}
		}
	},

	preload: function (thisGame){
		var i;
		for(i=0;i<NT.Sounds.allSounds.length;++i){
			var tune = NT.Sounds.allSounds[i];
			thisGame.load.audio(tune.name, ['audio/'+tune.name+'.mp3','audio/'+tune.name+'.ogg']);
		}
	},

	create: function (thisGame){
		var i;
		for(i=0;i<NT.Sounds.allSounds.length;++i){
			var tune = NT.Sounds.allSounds[i];
			NT.Sounds[tune.name] = thisGame.sound.add(tune.name, {volume: tune.volume, loop: tune.loop});
		}
		console.log("create sounds", NT.Sounds);
	}
};


