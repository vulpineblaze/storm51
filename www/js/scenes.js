if(NT === undefined) {
  var NT = {};
}

NT.Scenes = {};




NT.Scenes.Intro = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Intro ()
    {
        Phaser.Scene.call(this, { key: 'intro' });
    },

    init: function (data)
    {
        // console.log('init', data);

        this.imageID = data.id;
        this.imageFile = data.image;
    },

    preload: function ()
    {
	    // this.load.image('teal_border', 'img/backgrounds_teal_border.png');
	    this.load.image('black_center', 'img/background_win_lose.png');
    },

    create: function ()
    {
    	// var teal_border = this.add.image(0, 0, 'teal_border');
	    // teal_border.setDisplayOrigin(0);

    	var black_center = this.add.sprite(0,0, 'black_center').setInteractive();
	    black_center.setDisplayOrigin(0);


        this.add.text(160, 80, NT.Messages.introTextMsg, { font: '48px Impact', fill: '#fff' });


        this.input.once('pointerup', function () {

            this.scene.start('play');

        }, this);
    }

});




NT.Scenes.Win = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Win ()
    {
        Phaser.Scene.call(this, { key: 'win' });
    },

    init: function (data)
    {
        this.inText = data.text;
    },

    preload: function ()
    {
	    // this.load.image('teal_border', 'img/backgrounds_teal_border.png');
	    this.load.image('black_center', 'img/background_win_lose.png');
    },

    create: function ()
    {
    	// var teal_border = this.add.image(0, 0, 'teal_border');
	    // teal_border.setDisplayOrigin(0);

    	var black_center = this.add.sprite(0,0, 'black_center').setInteractive();
	    black_center.setDisplayOrigin(0);


	    this.add.text(NT.Globals.horizontalOffset, 80, 
	    	NT.Messages.winTextMsg + "\n" + this.inText, 
	    	{ align: 'center', 
	    		font: '48px Impact', 
	    		fill: '#fff', 
	    		wordWrap: {width: NT.Globals.gameWidth - (NT.Globals.horizontalOffset*2)} 
	    	});
        // this.add.text(40, 80, NT.Messages.winTextMsg + this.inText, { align: 'center', font: '48px Impact', fill: '#fff' });
	    this.add.text(60, 780, NT.Messages.restartTextMsg, { align: 'center', font: '48px Impact', fill: '#fff' });


        var fullClick = false;

	    this.input.once('pointerup', function () {

            fullClick = true;

        }, this);

        this.input.once('pointerdown', function () {

            if(fullClick){
            	this.scene.start('play');
            }

        }, this);
    }

});




NT.Scenes.Lose = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Lose ()
    {
        Phaser.Scene.call(this, { key: 'lose' });
    },

    init: function (data)
    {
        this.inText = data.text;
    },

    preload: function ()
    {
	    // this.load.image('teal_border', 'img/backgrounds_teal_border.png');
	    this.load.image('black_center', 'img/background_win_lose.png');
    },

    create: function ()
    {
    	// var teal_border = this.add.image(0, 0, 'teal_border');
	    // teal_border.setDisplayOrigin(0);

    	var black_center = this.add.sprite(0,0, 'black_center').setInteractive();
	    black_center.setDisplayOrigin(0);


		this.add.text(NT.Globals.horizontalOffset, 80, 
	    	NT.Messages.loseTextMsg + "\n" + this.inText, 
	    	{ align: 'center', 
	    		font: '48px Impact', 
	    		fill: '#fff', 
	    		wordWrap: {width: NT.Globals.gameWidth - (NT.Globals.horizontalOffset*2)} 
	    	});	    this.add.text(60, 780, NT.Messages.restartTextMsg, { align: 'center', font: '48px Impact', fill: '#fff' });

	    var fullClick = false;

	    this.input.once('pointerup', function () {

            fullClick = true;
            console.log("click!");

        }, this);

        this.input.once('pointerdown', function () {

            if(fullClick){
                console.log("fullClick! , play");
            	this.scene.start('play');
            }

        }, this);
    }

});






NT.Scenes.Play = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Play ()
    {
        console.log("Play Scene Play()");
        Phaser.Scene.call(this, 'play');
    },


    preload: function ()
    {

        this.load.image('mountain', 'img/mountain.png');
        this.load.image('base', 'img/base.png');
        this.load.image('line', 'img/line.png');
        this.load.image('barracade', 'img/barracade_fixed.png');
        this.load.image('dewey', 'img/dewey.png');
        // this.load.image('player', 'img/naruto_run_quickie.png'); // can & will change
        // this.load.spritesheet('player', 'img/naruto_run_quickie.png', { frameWidth: 110, frameHeight: 140 });
        this.load.spritesheet('player', 'img/pony_quickie.png', { frameWidth: 100, frameHeight: 200 });
        this.load.spritesheet('cactus', 'img/cactus_quick.png', { frameWidth: 50, frameHeight: 50 });

    },


    create: function ()
    {
        console.log("Play Scene create()");
        thisGame = this;
        NT.Globals.game = this;
	    //  A simple background for our game
        var rect = new Phaser.Geom.Rectangle(0, 
                                            NT.Globals.vertOneThird, 
                                            NT.Globals.gameWidth, 
                                            NT.Globals.gameHeight);
        var graphics = this.add.graphics({ fillStyle: { color: NT.Globals.colors.desertLow } });
        graphics.fillRectShape﻿(rect);
        graphics.setDepth(-50);

        var roadTriangleGraphics = this.add.graphics({ fillStyle: { color: NT.Globals.colors.road } });
        var roadbumperTriangleGraphics = this.add.graphics({ fillStyle: { color: NT.Globals.colors.bumper } });

        var roadTriangle = new Phaser.Geom.Triangle(NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                                0, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth, NT.Globals.gameHeight);
        var roadBumperTriangle = new Phaser.Geom.Triangle(NT.Globals.horzCenter, NT.Globals.vertOneThird+10,   
                                -50, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth+50, NT.Globals.gameHeight);

        roadbumperTriangleGraphics.fillTriangleShape(roadBumperTriangle);
        roadbumperTriangleGraphics.setDepth(roadTriangleGraphics.depth-1);

        roadTriangleGraphics.fillTriangleShape(roadTriangle);
        console.log("road:",roadTriangleGraphics,roadbumperTriangleGraphics);


        mountain = this.add.image(0, 0, 'mountain');
        mountain.setDisplayOrigin(0);
        base = this.add.image(0, NT.Globals.vertOneThird, 'base');
        base.setDisplayOrigin(0);



    	

    	console.log('globals',NT.Globals);
					
		

        //  If you disable topOnly it will fire events for all objects the pointer is over
        //  regardless of their place on the display list
        this.input.setTopOnly(false);

        //  Events
        // this.input.on('gameobjectdown', NT.Squares.squareDown);
        // this.input.on('gameobjectout', NT.Squares.squareOut);
        // this.input.on('gameobjectup', NT.Squares.squareUp);
        
	    //  Input Events	    

	    // cursors = this.input.keyboard.addKeys('M', '1');
	    // keyOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);


	    //  The score
	    // NT.Messages.movesText = this.add.text(40, 40, 
	    // 							NT.Messages.movesTextPrefix + NT.Globals.moves, 
	    // 							{ fontFamily: 'Impact', fontSize: '48px', fill: '#fff' });
	    NT.Messages.ticksText = this.add.text(40, 40, 
	    							NT.Messages.ticksTextPrefix + NT.Globals.winGameTicks, 
	    							{ fontFamily: 'Impact', fontSize: '48px', fill: '#fff' });

	    


	 //    this.anims.create({
		//     key: 'static',
		//     frames: this.anims.generateFrameNumbers('overlays', { start: 0, end: 5 }),
		//     frameRate: 10,
		//     yoyo: true,
		//     repeat: -1
		// });

	 //    this.anims.create({
		//     key: 'wick',
		//     frames: this.anims.generateFrameNumbers('bombs', { start: 0, end: 5 }),
		//     frameRate: 10,
		//     yoyo: true,
		//     repeat: -1
		// });



        // NT.Squares.createGame(thisGame);

        // this.time.events.repeat(Phaser.Timer.SECOND * Nt.Globals.lineDelay, 10, NT.Line.createLines(), this);
        // game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        NT.Line.timedEvent = this.time.addEvent({ delay: NT.Line.lineDelay, 
                                                callback: this.lineTimerEvent, 
                                                callbackScope: this, 
                                                loop: true });


        NT.Cactuses.timedEvent = this.time.addEvent({ delay: NT.Cactuses.lineDelay, 
                                                callback: this.lineTimerEventCactuses, 
                                                callbackScope: this, 
                                                loop: true });

        NT.Barracades.timedEvent = this.time.addEvent({ delay: NT.Barracades.lineDelay, 
                                                callback: this.lineTimerEventBarracades, 
                                                callbackScope: this, 
                                                loop: true });

        NT.Deweys.timedEvent = this.time.addEvent({ delay: NT.Deweys.lineDelay, 
                                                callback: this.lineTimerEventDeweys, 
                                                callbackScope: this, 
                                                loop: true });

        // NT.Player.speedBoostEvent = this.time.addEvent({ delay: NT.Deweys.boostTime, 
        //                                         callback: function(){NT.Player.speedBoost = 1}, 
        //                                         callbackScope: this});

        // NT.Player.speedBoostEvent = this.time.delayedCall(NT.Deweys.boostTime, 
        //                                     function(){NT.Player.speedBoost = 1}, 
        //                                     [], this);        

        // do once
        NT.Line.createLines();
        NT.Line.addLine();

        NT.Cactuses.createCactuses();
        NT.Barracades.createBarracades();
        NT.Deweys.createDeweys();


        NT.Player.createPlayer();

        var drag = false;

        this.input.on('pointerdown', function (pointer) {

            // console.log('pointer down',pointer);
            NT.Deweys.checkTapped(pointer);
            drag = true;

        });

        this.input.on('pointerup', function () {

            drag = false;

        });

        this.input.on('pointermove', function (pointer) {

            if (drag)
            {
                if(pointer.x < pointer.downX){
                    // left, center 300
                    NT.Player.relativeHorz -= NT.Player.dragValue; 
                }else{
                    NT.Player.relativeHorz += NT.Player.dragValue; 
                }

                var horzOffset = NT.Globals.horzCenter - NT.Player.relativeHorz;

                roadTriangleGraphics.clear();
                var roadTriangle = new Phaser.Geom.Triangle(
                                NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                                horzOffset, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth + horzOffset, NT.Globals.gameHeight);

                roadbumperTriangleGraphics.clear();
                var roadBumperTriangle = new Phaser.Geom.Triangle(
                                NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                                horzOffset-50, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth + horzOffset+50, NT.Globals.gameHeight);


                roadbumperTriangleGraphics.fillTriangleShape(roadBumperTriangle);
                roadTriangleGraphics.fillTriangleShape(roadTriangle);

            }

        });

        // this.input.on('gameobjectdown', this.tappedSomething);
        // this.input.on('gameobjectdown', function (ptr,obj)
        // {
        //     console.log("tapped:",obj);
        //     obj.killAndHide();
        // }, this);

        // this.physics.add.overlap(NT.Player.player, NT.Barracades.barracades);
        // this.physics.add.overlap(NT.Player.player, NT.Barracades.barracades, this.collideEnemy, null, this);
        // this.physics.add.collide(NT.Player.player, NT.Barracades.barracades, this.collideEnemy, null, this);


    },

    update: function ()
    {

        // console.log( NT.Player.speedBoostEvent.getProgress().toString().substr(0, 4) );

        NT.Line.updateLines();
        NT.Cactuses.updateCactuses();
        NT.Barracades.updateBarracades();
        NT.Deweys.updateDeweys();

        NT.Player.updatePlayer();


        if(NT.Player.relativeHorz < 0 ){
            NT.Player.relativeHorz = 0;
        }else if (NT.Player.relativeHorz > NT.Globals.gameWidth ){
            NT.Player.relativeHorz = NT.Globals.gameWidth; 
        }

        // thisGame.physics.arcade.overlap(NT.Player.player, NT.Barracades.barracades, this.collideEnemy, null, this);
        NT.Barracades.group.children.iterate(function (barracade) {
            if(barracade && barracade.nowFrame > 90 && barracade.nowFrame < 105){
                // console.log('barracade.nowFrame:',barracade.nowFrame,NT.Player.player, barracade);

                if (NT.Player.checkOverlap(barracade)){
                    // console.log('collide try:',barracade.nowFrame,NT.Player.player, barracade);
                    // thisGame.scene.start('lose', { id: 2, text:  "Collided with: "+barracade.name  });
                    NT.Globals.shutdownScene('lose',  "Collided with: "+barracade.name );

                };
            }
        });

        NT.Messages.ticksText.setText(NT.Messages.ticksTextPrefix + (NT.Globals.winGameTicks - NT.Player.runTicks));
        if(NT.Globals.winGameTicks < NT.Player.runTicks){
            NT.Globals.shutdownScene('win',  "You YEETed the base!" );
        }


    },

    tappedSomething: function (ptr,obj)
    {
        console.log("tapped:",obj);
        obj.killAndHide();
        // var isReClick = false;
        // console.log(this,NT.Squares);
        // if(NT.Squares.getTint(obj) == NT.Squares.getTint(home)){
        //     isReClick = true;
        // }

        // if( !isReClick ) {
        //     var color = NT.Squares.getTint(obj);
        //        sfxClick.play();
        //        NT.Squares.checkHomeSides(color);
        //     NT.Squares.setMoves(-1);
        //     sfxClick.play();
        // }
        
    },

    lineTimerEvent: function(){
        // workaround for timer
        NT.Line.addLine();
    }, 

    lineTimerEventCactuses: function(){
        // workaround for timer
        NT.Cactuses.addCactus();
    }, 

    lineTimerEventBarracades: function(){
        // workaround for timer
        NT.Barracades.addBarracade();
    },

    lineTimerEventDeweys: function(){
        // workaround for timer
        NT.Deweys.addDewey();
    } 

});










