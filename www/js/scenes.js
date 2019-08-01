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


        this.add.text(160, 80, NT.Messages.introTextMsg, { font: '48px Anton', fill: '#fff' });


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
        this.load.spritesheet('booty_shorts', 'img/booty_shorts.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('dancing_alien1', 'img/dancing_alien1.png', { frameWidth: 210, frameHeight: 630 });
        this.load.spritesheet('hoops', 'img/hoops.png', { frameWidth: 100, frameHeight: 100 });

    },

    create: function ()
    {
    	var black_center = this.add.sprite(0,0, 'black_center').setInteractive();
	    black_center.setDisplayOrigin(0);

        var booty_shortsAnimation = this.anims.create({
            key: 'booty_shorts',
            frames: this.anims.generateFrameNumbers('booty_shorts'),
            frameRate: 16,
            yoyo: true,
            repeat: -1
        });

        var booty_shorts = this.add.sprite(NT.Globals.horzCenter,
                                            NT.Globals.vertOneThird * 2.5, 
                                            'booty_shorts');
        booty_shorts.anims.play('booty_shorts');



        var dancing_alien1Animation = this.anims.create({
            key: 'dancing_alien1',
            frames: this.anims.generateFrameNumbers('dancing_alien1'),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });

        var dancing_alien1 = this.add.sprite(NT.Globals.vertOneThird*0.5,
                                            NT.Globals.vertOneThird, 
                                            'dancing_alien1');
        dancing_alien1.anims.play('dancing_alien1');



        var hoopsAnimation = this.anims.create({
            key: 'hoops',
            frames: this.anims.generateFrameNumbers('hoops'),
            // frames: thisGame.anims.generateFrameNumbers('hoops',{
            //             frames:[0-3,16-21,4-6,8-14,22,24,25-30,32-38]}),
            frameRate: 12,
            repeat: -1
        });

        var hoops = this.add.sprite(NT.Globals.horzCenter*1.5,
                                            NT.Globals.vertOneThird*1.5, 
                                            'hoops');
        hoops.setScale(2);
        hoops.anims.play('hoops');


	    var winText = this.add.text(NT.Globals.horizontalOffset, 80, 
	    	NT.Messages.winTextMsg + "\n" + this.inText, 
	    	{ align: 'center', 
	    		font: '48px Anton', 
	    		fill: '#fff', 
	    		wordWrap: {width: NT.Globals.gameWidth - (NT.Globals.horizontalOffset*2)} 
	    	});
        winText.setStroke('#000', 5);        


	    var restartText = this.add.text(60, NT.Globals.vertOneThird*2.5, 
            NT.Messages.restartTextMsg, 
            { align: 'center', font: '48px Anton', fill: '#fff' });
        restartText.setStroke('#000', 5);        


        NT.Messages.timeText = this.add.text(40, NT.Globals.vertOneThird*2.8, 
                                    NT.Messages.timeTextPrefix + NT.Messages.savedTimeFormatted() , 
                                    { fontFamily: 'Anton', fontSize: '36px', fill: '#fff' });
        NT.Messages.timeText.setStroke('#000', 5);        



        var fullClick = false;

        this.input.once('pointerup', function () {

            fullClick = true;
            console.log("pointerup , click!");
            var deadlockTimer = this.time.delayedCall(NT.Globals.deadlockTimeDelay, 
                                                    function(){this.scene.start('play')}, 
                                                    [], this); 

        }, this);

        this.input.once('pointerdown', function () {

            console.log("pointerdown , click!");
            if(fullClick){
                console.log("fullClick! , play");
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

        // console.log("seconds ",NT.Messages.savedTimeFormatted());
        NT.Messages.timeText = this.add.text(40, NT.Globals.vertOneThird*2.8, 
                                    NT.Messages.timeTextPrefix + NT.Messages.savedTimeFormatted() , 
                                    { fontFamily: 'Anton', fontSize: '36px', fill: '#fff' });
        NT.Messages.timeText.setStroke('#000', 5);        



		var loseText = this.add.text(NT.Globals.horizontalOffset, 80, 
	    	NT.Messages.loseTextMsg + "\n" + this.inText, 
	    	{ align: 'center', 
	    		font: '48px Anton', 
	    		fill: '#fff', 
	    		wordWrap: {width: NT.Globals.gameWidth - (NT.Globals.horizontalOffset*2)} 
	    	});
        loseText.setStroke('#000', 5);	    

        var restartText = this.add.text(60, NT.Globals.vertOneThird*2.5, 
            NT.Messages.restartTextMsg, 
            { align: 'center', font: '48px Anton', fill: '#fff' });
        restartText.setStroke('#000', 5);

	    var fullClick = false;

        this.input.once('pointerup', function () {

            fullClick = true;
            console.log("pointerup , click!");
            var deadlockTimer = this.time.delayedCall(NT.Globals.deadlockTimeDelay, 
                                                    function(){this.scene.start('play')}, 
                                                    [], this); 

        }, this);

        this.input.once('pointerdown', function () {

            console.log("pointerdown , click!");
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
        this.load.spritesheet('guard', 'img/guard.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('bullet', 'img/bullet.png', { frameWidth: 8, frameHeight: 8 });

    },


    create: function ()
    {
        console.log("Play Scene create()");
        thisGame = this;
        NT.Globals.game = this;
        NT.Globals.initKeys(this);
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
        var roadBumperTriangle = new Phaser.Geom.Triangle(NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                                -50, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth+50, NT.Globals.gameHeight);

        roadbumperTriangleGraphics.fillTriangleShape(roadBumperTriangle);
        roadbumperTriangleGraphics.setDepth(roadTriangleGraphics.depth-1);

        roadTriangleGraphics.fillTriangleShape(roadTriangle);
        console.log("road:",roadTriangleGraphics,roadbumperTriangleGraphics);


        mountain = this.add.image(0, 0, 'mountain');
        mountain.setDisplayOrigin(0);
        base = this.add.image(0, NT.Globals.vertOneThird, 'base');
        base.y += -base.height + (NT.Globals.vertOneThird * 2 * 0.01);
        base.setDisplayOrigin(0);

    	console.log('globals',NT.Globals);
					
		

        //  If you disable topOnly it will fire events for all objects the pointer is over
        //  regardless of their place on the display list
        this.input.setTopOnly(false);


	    NT.Messages.ticksText = this.add.text(40, 40, 
	    							NT.Messages.ticksTextPrefix + NT.Globals.winGameTicks, 
	    							{ fontFamily: 'Anton', fontSize: '48px', fill: '#fff' });
        NT.Messages.ticksText.setStroke('#000', 5);

	    NT.Globals.gameTimeStart = new Date().getTime();
        NT.Messages.timeText = this.add.text(40, NT.Globals.vertOneThird*2.8, 
                                    NT.Messages.timeTextPrefix + 0.0, 
                                    { fontFamily: 'Anton', fontSize: '36px', fill: '#fff' });
        NT.Messages.timeText.setStroke('#000', 5);


        NT.Messages.debugText = this.add.text(300, NT.Globals.vertOneThird*2.8, 
                                    NT.Messages.debugText + 0.0, 
                                    { fontFamily: 'Anton', fontSize: '36px', fill: '#fff' });
        NT.Messages.debugText.setStroke('#000', 2);

        // game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        NT.Globals.masterTickTimer = this.time.addEvent({ delay: NT.Globals.millisPerTick, 
                                                callback: this.tickTimerEvent, 
                                                callbackScope: this, 
                                                loop: true });

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

        NT.Guards.timedEvent = this.time.addEvent({ delay: NT.Guards.lineDelay, 
                                                callback: this.lineTimerEventGuards, 
                                                callbackScope: this, 
                                                loop: true });

        NT.Bullets.timedEvent = this.time.addEvent({ delay: NT.Bullets.lineDelay, 
                                                callback: this.lineTimerEventBullets, 
                                                callbackScope: this, 
                                                loop: false });
      

        // do once
        NT.Line.createLines();
        NT.Line.addLine();

        NT.Cactuses.createCactuses();
        NT.Barracades.createBarracades();
        NT.Deweys.createDeweys();
        NT.Guards.createGuards();
        NT.Bullets.createBullets();


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
                var dragMult = (pointer.x - pointer.downX) / NT.Globals.gameWidth;
                var newRelativeHorz = NT.Player.dragValue * dragMult;
                // 0 - 600, R to L   // 600 - 0, L to R
                //  -/+ 600 / 600  ->  -1 to 1
                //   -1 to -0.5  or 0.5 to 1
                // dragMult *= 2;
                if(newRelativeHorz < 0 && newRelativeHorz > -NT.Player.dragThreshold){
                    newRelativeHorz = -NT.Player.dragThreshold;
                }else if(dragMult < NT.Player.dragThreshold && newRelativeHorz > 0){
                    newRelativeHorz = NT.Player.dragThreshold;
                }


                NT.Player.relativeHorz += newRelativeHorz;

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



    },

    update: function ()
    {

        // console.log("update delay", NT.Bullets.lineDelay, NT.Bullets.timedEvent.delay, NT.Bullets.timedEvent);


        // console.log( NT.Player.speedBoostEvent.getProgress().toString().substr(0, 4) );
        var myTime = new Date().getTime() - NT.Globals.gameTimeStart;
        NT.Messages.timeText.setText(NT.Messages.timeTextPrefix + NT.Messages.msToTime(myTime));


        NT.Line.updateLines();
        NT.Cactuses.updateCactuses();
        NT.Barracades.updateBarracades();
        NT.Deweys.updateDeweys();
        NT.Guards.updateGuards();
        NT.Bullets.updateBullets();

        NT.Player.updatePlayer();


        if(NT.Player.relativeHorz < 0 ){
            NT.Player.relativeHorz = 0;
        }else if (NT.Player.relativeHorz > NT.Globals.gameWidth ){
            NT.Player.relativeHorz = NT.Globals.gameWidth; 
        }

        // thisGame.physics.arcade.overlap(NT.Player.player, NT.Barracades.barracades, this.collideEnemy, null, this);
        NT.Barracades.group.children.iterate(function (barracade) {
            if(barracade && barracade.nowFrame > 80 && barracade.nowFrame < 90){
                // console.log('barracade.nowFrame:',barracade.nowFrame,NT.Player.player, barracade);

                if (NT.Globals.checkOverlap(NT.Player.player, barracade, NT.Barracades.collideSoftness)){
                    // console.log('collide try:',barracade.nowFrame,NT.Player.player, barracade);
                    // thisGame.scene.start('lose', { id: 2, text:  "Collided with: "+barracade.name  });
                    NT.Globals.shutdownScene(myTime, 'lose',  "Collided with: "+barracade.name );

                };
            }
        });

        NT.Bullets.group.children.iterate(function (bullet) {
            if(bullet && bullet.active){
                var isOverlap = false;
                if (NT.Globals.checkOverlap(NT.Player.player, bullet, 0)){
                    console.log("bullet collide", bullet.nowFrame, bullet, NT.Player.player, NT.Player.relativeHorz);
                    isOverlap = true;
                }
                if(isOverlap && bullet.nowFrame > 70 && bullet.nowFrame < 90){
                    // NT.Globals.shutdownScene(myTime, 'lose',  "Collided with: "+bullet.name );
                }
            }
        });

        NT.Messages.ticksText.setText(NT.Messages.ticksTextPrefix + Math.round(NT.Globals.winGameTicks - NT.Player.runTicks));
        if(NT.Globals.winGameTicks < NT.Player.runTicks){
            NT.Globals.shutdownScene(myTime, 'win',  "You YEETed the base!" );
        }


        var i; // 48 = ZERO
        for(i=1;i<10;++i){
            // keys = this.input.keyboard.addKeys(''+i);
            // keyString += ""+i;
            // console.log("key checking",i,NT.Player.runTicks, NT.Globals.keys[i].isDown, NT.Globals.keys[i].isUp);
            // console.log("key checking",i,NT.Player.runTicks, NT.Globals.keys[i].isDown, NT.Globals.keys);

            if(NT.Globals.keys[i].isDown){
                NT.Player.runTicks = 0.1 * i * NT.Globals.winGameTicks;
                console.log("key press",i,NT.Player.runTicks);
            }
             // console.log("key press 48",NT.Globals.keys[""+i].keyCode,thisGame.input.keyboard.checkDown(NT.Globals.keys[i]));
             // console.log("key press 48",NT.Globals.keys[""+i].keyCode,thisGame.input.keyboard.checkDown(NT.Globals.keys[i]));

        } 


    },

    tappedSomething: function (ptr,obj)
    {
        console.log("tapped:",obj);
        obj.killAndHide();
        
    },

    tickTimerEvent: function(){
        // workaround for timer
        NT.Line.updateTicks();
        NT.Cactuses.updateTicks();
        NT.Barracades.updateTicks();
        NT.Deweys.updateTicks();
        NT.Guards.updateTicks();
        NT.Bullets.updateTicks();

        NT.Player.updateTicks();
    }, 


    lineTimerEvent: function(){
        // workaround for timer
        NT.Line.addLine();
    }, 

    lineTimerEventCactuses: function(){
        // workaround for timer
        var i;
        for(i=0;i<NT.Cactuses.addPerTimerEvent;++i){
            NT.Cactuses.addCactus();
        }
        
    }, 

    lineTimerEventBarracades: function(){
        // workaround for timer
        NT.Barracades.addBarracade();
    },

    lineTimerEventDeweys: function(){
        // workaround for timer
        NT.Deweys.addDewey();
    }, 

    lineTimerEventGuards: function(){
        // workaround for timer
        NT.Guards.addGuard();
    }, 

    lineTimerEventBullets: function(){
        // workaround for timer
        // NT.Bullets.timedEvent.reset({delay: NT.Bullets.lineDelay + NT.Globals.randomNumber(-50,50)});
        // console.log(NT.Bullets.lineDelay, NT.Bullets.timedEvent.delay, NT.Bullets.timedEvent);
        NT.Guards.group.children.iterate(function (guard) {
            // console.log('guard test:',guard.nowFrame, guard);

            if(guard && guard.active && guard.nowFrame > 1 && guard.nowFrame < 40){
                // console.log('guard bullet:',guard.nowFrame, guard);
                NT.Bullets.addBullet(guard);
            }
        });

        NT.Bullets.timedEvent = this.time.addEvent({ delay: NT.Bullets.lineDelay + NT.Globals.randomNumber(-50,50), 
                                                callback: this.lineTimerEventBullets, 
                                                callbackScope: this, 
                                                loop: false });

        // NT.Bullets.timedEvent = this.time.delayedCall(NT.Bullets.lineDelay + NT.Globals.randomNumber(-50,50), 
        //                                             this.lineTimerEventBullets, 
        //                                             [], this); 
        
    } 

});










