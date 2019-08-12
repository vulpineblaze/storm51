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

        thisGame = this;
        NT.Globals.game = this;
        NT.Globals.initKeys(this);
    },

    preload: function ()
    {
        this.load.image('black_center', 'img/background_win_lose.png');
	    this.load.image('tinySquare', 'img/tinySquare.png');

        this.load.audio('emptySound', ['audio/emptySound.mp3','audio/emptySound.ogg']);
        this.load.audio('musicAudio', ['audio/TheyCantStopUsAll.mp3','audio/TheyCantStopUsAll.ogg']);


    },

    create: function ()
    {



        NT.Sounds.musicAudio = this.sound.add('musicAudio', {loop: true});
        // NT.Sounds.musicAudio.play();


    	var black_center = this.add.sprite(0,0, 'black_center');
	    black_center.setDisplayOrigin(0);

        NT.Messages.introText = this.add.text(160, 80, 
                                    NT.Messages.introTextMsg , 
                                    { fontFamily: 'Anton', fontSize: '48px', fill: '#fff' });
        NT.Messages.introText.setStroke('#000', 5); 

        this.pointerUp = false;
        this.input.once('pointerup', function () {

            // this.scene.start('play');
            this.pointerUp = true;


        }, this);

        this.input.once('pointerdown', function () {
            NT.Sounds.musicAudio.play();
        }, this);


    },

    update: function (){
        if(this.pointerUp && NT.Sounds.musicAudio.isPlaying){
            console.log("audio loaded!");
            this.scene.start('select');
        }
    }

});






NT.Scenes.Select = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Intro ()
    {
        Phaser.Scene.call(this, { key: 'select' });
    },

    init: function (data)
    {
        // console.log('init', data);

        this.imageID = data.id;
        this.imageFile = data.image;

        thisGame = this;
        NT.Globals.game = this;
        NT.Globals.initKeys(this);
    },

    preload: function ()
    {
        // this.load.image('teal_border', 'img/backgrounds_teal_border.png');
        this.load.image('black_center', 'img/background_win_lose.png');
        this.load.image('tinySquare', 'img/tinySquare.png');


        var i;
        for(i=0;i<NT.Player.masterSheets.length;++i){
            var sprite = NT.Player.masterSheets[i];
            this.load.spritesheet(sprite.key, sprite.path, 
                        { frameWidth: sprite.frameWidth, frameHeight: sprite.frameHeight });
        }

    },

    create: function ()
    {

        var black_center = this.add.sprite(0,0, 'black_center');
        black_center.setDisplayOrigin(0);

        NT.Messages.introText = this.add.text(160, 80, 
                                    NT.Messages.introTextMsg , 
                                    { fontFamily: 'Anton', fontSize: '48px', fill: '#fff' });
        NT.Messages.introText.setStroke('#000', 5); 

        this.pointerUp = false;
        this.input.once('pointerup', function () {

            // this.scene.start('play');
            this.pointerUp = true;


        }, this);

        this.input.once('pointerdown', function () {
            NT.Sounds.musicAudio.play();
        }, this);


        NT.Player.thisSheet = 0;
        var i = 1;
        var j = 1;
        var k = 0;
        var maxSize = 20;
        var scale = 20;
        var pad = 40;
        var x = pad;
        var y = pad;
        var clampHigh = -20/3 * (pad + scale*4);
        var clampLow = NT.Globals.gameHeight + 20/3 * (pad + scale*4);
        var hitArea = new Phaser.Geom.Rectangle(0, 0, 80, 100);
        var hitAreaCallback = Phaser.Geom.Rectangle.Contains;
        var topSquare, bottomSquare;
        var group = this.add.group({
            defaultKey: 'tinySquare',
            maxSize: maxSize
        });
        group.createMultiple({
            key: group.defaultKey,
            repeat: group.maxSize - 1,
            hitArea: hitArea,
            hitAreaCallback: hitAreaCallback,
        });
        group.children.iterate(function (child) {
            thisX = x + (child.width * scale * i) + (pad * i);
            thisY = y + (child.height * scale * j) + (pad * j);
            child
                .setActive(true)
                .setVisible(true)
                .setDepth(1)
                .setScale(scale)
                .setPosition(thisX, thisY);

            if(k < NT.Player.masterSheets.length){

                child.sheet = NT.Player.masterSheets[k];
                // console.log("avatar",k, NT.Player.masterSheets.length, child.sheet);
                var avatar = thisGame.add.sprite(0,0, child.sheet.key);
                var relativeScale = scale * child.width / Math.max(avatar.width,avatar.height);

                avatar.setScale(relativeScale)
                    .setDepth(2)
                    .setPosition(thisX, thisY);

                child.avatar = avatar; 
            }
                
            if(k == 1){
                topSquare = child;
            }else if(k >= maxSize -1){
                bottomSquare = child;
                // console.log("make bottomSquare", k, maxSize,topSquare.y,bottomSquare.y);

            }
            // console.log("make tinySquare", i,j,child);
            i += 1;
            k += 1;

            if(i > 3){
                i = 1;
                j += 1;
            }
        });

        //  The rectangle they can 'drag' within
        var zone = this.add.zone(0, 0, NT.Globals.gameWidth, NT.Globals.gameHeight).setOrigin(0).setInteractive();

        zone.on('pointermove', function (pointer) {
            // console.log("pointermove", pointer.velocity.y);
            if (pointer.isDown)
            {    
                var topY = topSquare.y;
                var bottomY = bottomSquare.y;
                // console.log("pointermove", pointer.velocity.y,topY,bottomY);

                var dragVal = ((pointer.y - pointer.downY) / 20);
                if(bottomY + dragVal > 0
                        && topY + dragVal < NT.Globals.gameHeight){
                    group.children.iterate(function (child) {
                        child.y += dragVal;
                        if(child.avatar){child.avatar.y = child.y;}
                    });
                }

            }

        });
        zone.on('wheel', function (pointer, deltaX, deltaY, deltaZ) {

            group.children.iterate(function (child) {
                child.y += (pointer.velocity.y / 10);
                if(child.avatar){child.avatar.y = child.y;}
            });

        });

        this.input.on('gameobjectdown', function (pointer, gameObject) {

            // gameObject.visible = false;
            // console.log("clicked gameObject", gameObject);
            if(gameObject.sheet){
                NT.Player.thisSheet = gameObject.sheet;
            }
            
            // console.log("clicked gameObject", gameObject);

        });

    },

    update: function (){
        if(this.pointerUp && NT.Player.thisSheet){
            console.log("select!!", NT.Player.thisSheet.key);
            this.scene.start('play');
        }
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
            // console.log("pointerup , click!");
            var deadlockTimer = this.time.delayedCall(NT.Globals.deadlockTimeDelay, 
                                                    function(){this.scene.start('select')}, 
                                                    [], this); 

        }, this);

        this.input.once('pointerdown', function () {

            // console.log("pointerdown , click!");
            if(fullClick){
                console.log("fullClick! , select");
                this.scene.start('select');
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
            // console.log("pointerup , click!");
            var deadlockTimer = this.time.delayedCall(NT.Globals.deadlockTimeDelay, 
                                                    function(){this.scene.start('select')}, 
                                                    [], this); 

        }, this);

        this.input.once('pointerdown', function () {

            // console.log("pointerdown , click!");
            if(fullClick){
                console.log("fullClick! , select");
                this.scene.start('select');
            }

        }, this);
    }

});






NT.Scenes.Play = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Play ()
    {
        // console.log("Play Scene Play()");
        Phaser.Scene.call(this, 'play');
    },


    preload: function ()
    {

        this.load.image('mountain', 'img/mountain.png');
        this.load.image('base', 'img/base.png');
        this.load.image('line', 'img/line.png');
        this.load.image('barracade', 'img/barracade_fixed.png');
        this.load.image('dewey', 'img/dewey.png');
        this.load.image('sign', 'img/sign.png');
        // this.load.image('player', 'img/naruto_run_quickie.png'); // can & will change
        // this.load.spritesheet('player', 'img/naruto_run_quickie.png', { frameWidth: 110, frameHeight: 140 });
        // this.load.spritesheet('player', 'img/pony_quickie_trim2_80x200.png', { frameWidth: 80, frameHeight: 200 });
        this.load.spritesheet(NT.Player.thisSheet.key, 
                            NT.Player.thisSheet.path, 
                            { frameWidth: NT.Player.thisSheet.frameWidth, 
                                frameHeight: NT.Player.thisSheet.frameHeight });
        // console.log("preload", NT.Player.thisSheet.key);
        this.load.spritesheet('cactus', 'img/cactus_quick.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('guard', 'img/guard.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('bullet', 'img/bullet.png', { frameWidth: 8, frameHeight: 8 });

        // this.load.audio('musicAudio', ['audio/TheyCantStopUsAll.mp3','audio/TheyCantStopUsAll.ogg']);
        this.load.audio('brroww', 'audio/brroww.wav');

    },


    create: function ()
    {
        console.log("Play Scene create()");
        thisGame = this;
        NT.Globals.game = this;
        NT.Globals.initKeys(this);

        // var musicAudio = this.sound.add('musicAudio', {loop: true});
        // // this.sound.play('musicAudio');
        // // musicAudio.setLoop(true);
        // musicAudio.play();

        var pauseBorder = Math.min(NT.Globals.gameWidth, NT.Globals.gameHeight) * 0.05;
        NT.Globals.pauseRect = new Phaser.Geom.Rectangle(pauseBorder, 
                                            pauseBorder, 
                                            NT.Globals.gameWidth - pauseBorder*2, 
                                            NT.Globals.gameHeight - pauseBorder*2);
        NT.Globals.pauseGraphics = this.add.graphics({ fillStyle: { color: '#000', alpha : 0.8 } });
        NT.Globals.pauseGraphics.fillRectShape﻿(NT.Globals.pauseRect);
        NT.Globals.pauseGraphics.setDepth(200); 
        NT.Globals.pauseGraphics.setVisible(false); 
        

	    //  A simple background for our game
        NT.Globals.backgroundColorUpdates = 0;
        NT.Globals.backgroundRect = new Phaser.Geom.Rectangle(0, 
                                            NT.Globals.vertOneThird, 
                                            NT.Globals.gameWidth, 
                                            NT.Globals.gameHeight);
        NT.Globals.backgroundGraphics = this.add.graphics({ fillStyle: { color: NT.Globals.colors.desertLow } });
        NT.Globals.backgroundGraphics.fillRectShape﻿(NT.Globals.backgroundRect);
        NT.Globals.backgroundGraphics.setDepth(-50);

        NT.Globals.roadTriangleGraphics = this.add.graphics({ fillStyle: { color: NT.Globals.colors.road } });
        NT.Globals.roadbumperTriangleGraphics = this.add.graphics({ fillStyle: { color: NT.Globals.colors.bumper } });

        NT.Globals.roadTriangle = new Phaser.Geom.Triangle(NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                                0, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth, NT.Globals.gameHeight);
        NT.Globals.roadBumperTriangle = new Phaser.Geom.Triangle(NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                                -50, NT.Globals.gameHeight, 
                                NT.Globals.gameWidth+50, NT.Globals.gameHeight);

        NT.Globals.roadbumperTriangleGraphics.fillTriangleShape(NT.Globals.roadBumperTriangle);
        NT.Globals.roadbumperTriangleGraphics.setDepth(NT.Globals.roadTriangleGraphics.depth-1);

        NT.Globals.roadTriangleGraphics.fillTriangleShape(NT.Globals.roadTriangle);
        console.log("road:",NT.Globals.roadTriangleGraphics,NT.Globals.roadbumperTriangleGraphics);


        mountain = this.add.image(0, 0, 'mountain');
        mountain.setDisplayOrigin(0);
        base = this.add.image(0, NT.Globals.vertOneThird, 'base');
        base.y += -base.height + (NT.Globals.vertOneThird * 2 * 0.01);
        base.setDisplayOrigin(0);

    	// console.log('globals',NT.Globals);
					
		

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


        NT.Messages.signText = this.add.text(40, 40, 
                                    NT.Messages.ticksTextPrefix + NT.Globals.winGameTicks, 
                                    { fontFamily: 'Anton', fontSize: '48px', fill: '#fff' });
        NT.Messages.signText.setStroke('#000', 5);
        NT.Messages.signText.setDepth(200); 
        NT.Messages.signText.setVisible(false);


        // NT.Messages.debugText = this.add.text(300, NT.Globals.vertOneThird*2.8, 
        //                             NT.Messages.debugText + 0.0, 
        //                             { fontFamily: 'Anton', fontSize: '36px', fill: '#fff' });
        // NT.Messages.debugText.setStroke('#000', 2);

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

        NT.Signs.createChildren();


        NT.Player.createPlayer();
        


        var drag = false;

        this.input.on('pointerdown', function (pointer) {

            // console.log('pointer down',pointer);
            NT.Deweys.checkTapped(pointer);
            NT.Signs.checkTapped(pointer);
            drag = true;

            NT.Globals.pointerDown = true;

            if(NT.Signs.signFullClick && NT.Signs.signUp){
                NT.Signs.toggleSign();
                NT.Signs.signFullClick = false;
            }

        });

        this.input.on('pointerup', function () {

            drag = false;
            NT.Player.dragAmount = 0;
            

            if(NT.Signs.signUp && !NT.Signs.signFullClick){
                NT.Signs.signFullClick = true;
            }


            NT.Globals.pointerDown = false;

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
                }else if(newRelativeHorz < NT.Player.dragThreshold && newRelativeHorz > 0){
                    newRelativeHorz = NT.Player.dragThreshold;
                }


                // NT.Player.relativeHorz += newRelativeHorz;
                NT.Player.dragAmount = newRelativeHorz;


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

        NT.Signs.updateChildren();

        NT.Player.updatePlayer();

        if(NT.Player.dragAmount){
            NT.Player.relativeHorz += NT.Player.dragAmount;
            var horzOffset = NT.Globals.horzCenter - NT.Player.relativeHorz;

            NT.Globals.roadTriangleGraphics.clear();
            NT.Globals.roadTriangle = new Phaser.Geom.Triangle(
                            NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                            horzOffset, NT.Globals.gameHeight, 
                            NT.Globals.gameWidth + horzOffset, NT.Globals.gameHeight);

            NT.Globals.roadbumperTriangleGraphics.clear();
            NT.Globals.roadBumperTriangle = new Phaser.Geom.Triangle(
                            NT.Globals.horzCenter, NT.Globals.vertOneThird,   
                            horzOffset-50, NT.Globals.gameHeight, 
                            NT.Globals.gameWidth + horzOffset+50, NT.Globals.gameHeight);


            NT.Globals.roadbumperTriangleGraphics.fillTriangleShape(NT.Globals.roadBumperTriangle);
            NT.Globals.roadTriangleGraphics.fillTriangleShape(NT.Globals.roadTriangle);
        }


        if(NT.Player.relativeHorz < 0 ){
            NT.Player.relativeHorz = 0;
        }else if (NT.Player.relativeHorz > NT.Globals.gameWidth ){
            NT.Player.relativeHorz = NT.Globals.gameWidth; 
        }

        // thisGame.physics.arcade.overlap(NT.Player.player, NT.Barracades.barracades, this.collideEnemy, null, this);
        NT.Barracades.group.children.iterate(function (barracade) {
            if(barracade && barracade.active && barracade.nowFrame > 80 && barracade.nowFrame < 90){
                // console.log('barracade.nowFrame:',barracade.nowFrame,NT.Player.player, barracade);

                if (NT.Globals.checkOverlap(NT.Player.player, barracade, NT.Barracades.collideSoftness)){
                    // console.log('collide try:',barracade.nowFrame,NT.Player.player, barracade);
                    // thisGame.scene.start('lose', { id: 2, text:  "Collided with: "+barracade.name  });
                    NT.Globals.shutdownScene(myTime, 'lose',  "Collided with: "+barracade.name );

                };
            }
        });

        NT.Guards.group.children.iterate(function (child) {
            if(child && child.active && child.nowFrame > 80 && child.nowFrame < 90){
                if (NT.Globals.checkOverlap(NT.Player.player, child, NT.Guards.collideSoftness)){
                    NT.Globals.shutdownScene(myTime, 'lose',  "Collided with: "+child.name );
                };
            }
        });

        NT.Bullets.group.children.iterate(function (bullet) {
            if(bullet && bullet.active){
                var isOverlap = false;
                if (NT.Globals.checkOverlap(NT.Player.player, bullet, 0)){
                    // console.log("bullet collide", bullet.nowFrame, bullet, NT.Player.player, NT.Player.relativeHorz);
                    isOverlap = true;
                }
                if(isOverlap && bullet.nowFrame > 70 && bullet.nowFrame < 90){
                    console.log("bullet collide", bullet.nowFrame, bullet, NT.Player.player, NT.Player.relativeHorz);
                    NT.Globals.shutdownScene(myTime, 'lose',  "Collided with: "+bullet.name );
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

        for(i=0;i<NT.Signs.signTriggerFrames.length;++i){
            if(NT.Signs.signTriggerFrames[i] > -1 && NT.Signs.signTriggerFrames[i] < NT.Player.runTicks){
                NT.Signs.signTriggerFrames[i] = -1;
                console.log(NT.Signs.signTriggerText[i] , i , );
                NT.Signs.addChild(-450, NT.Signs.signTriggerText[i]);
                NT.Signs.updateChildren();
            }
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
        
        NT.Signs.updateTicks();


        NT.Player.updateTicks();

        NT.Globals.backgroundColorUpdates +=1;
        if(NT.Globals.backgroundColorUpdates > 10){
            NT.Globals.backgroundColorUpdates = 0;
            this.tickBasedBackgroundColor();
        }
        
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
        
    }, 

    tickBasedBackgroundColor: function(){
        // var colorHigh = Math.max( parseInt(NT.Globals.colors.desertHigh) , parseInt(NT.Globals.colors.desertLow) );
        // var colorLow = Math.min( parseInt(NT.Globals.colors.desertHigh) ,parseInt( NT.Globals.colors.desertLow) );
        // var colorDiff = colorHigh - colorLow;
        // var colorDiffRed = colorDiff.toString(16).substring(0,2);
        // var colorDiffGreen = colorDiff.toString(16).substring(2,4);
        // var colorDiffBlue = colorDiff.toString(16).substring(4,6).padEnd(2, '0');

        // console.log("color diffs",
        //             colorDiffRed,
        //             colorDiffGreen,
        //             colorDiffBlue,
        //             parseInt(colorDiffRed,16),
        //             parseInt(colorDiffGreen,16),
        //             parseInt(colorDiffBlue,16)
        //             );

        var timeFactor = (NT.Player.runTicks / NT.Globals.winGameTicks); // 0 up to 1

        // var ourNewColor = parseInt(colorDiffRed,16) * timeFactor
        //                 + parseInt(colorDiffGreen,16) * timeFactor
        //                 + parseInt(colorDiffBlue,16) * timeFactor; 




        var i;
        var ourNewColor = "0x";
        for(i=2;i<8;i+=2){
            var charHigh = NT.Globals.colors.desertHigh.charAt(i);
            charHigh += NT.Globals.colors.desertHigh.charAt(i+1);
            var charLow = NT.Globals.colors.desertLow.charAt(i);
            charLow += NT.Globals.colors.desertLow.charAt(i+1);
            var colorDiff = parseInt(charHigh,16) -  parseInt(charLow,16) ;
            colorDiff *= timeFactor;
            var adjDiff = colorDiff + parseInt(charLow,16);
            ourNewColor += parseInt(adjDiff).toString(16);
            // console.log("making new color", i, 
            //         timeFactor, 
            //         parseInt(colorDiff).toString(16), 
            //         parseInt(adjDiff).toString(16), 
            //         charHigh , charLow, 
            //         ourNewColor);
        }




        // console.log("tick based color:"
        //                         ,(NT.Player.runTicks / NT.Globals.winGameTicks)
        //                         , ourNewColor);
        NT.Globals.backgroundGraphics.fillStyle( ourNewColor );
        NT.Globals.backgroundGraphics.fillRectShape﻿(NT.Globals.backgroundRect);
    }

});










