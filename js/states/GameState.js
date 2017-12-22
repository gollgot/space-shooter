class GameState extends Phaser.State {
    init(){
        console.log("GameState INIT");
    }

    preload(){
        // Game images
        game.load.image('background','assets/img/backgrounds/bg-game.jpg');
        game.load.spritesheet('player', 'assets/img/game/player.png', 88, 99, 4); // 5 sprites an each 88 x 99 px
        game.load.image('bullet', 'assets/img/game/bullet.png');
        game.load.image('meteor1','assets/img/game/meteor1.png');
        game.load.image('meteor2','assets/img/game/meteor2.png');
        game.load.image('meteor3','assets/img/game/meteor3.png');
        game.load.image('meteor4','assets/img/game/meteor4.png');
        game.load.spritesheet('explosion', 'assets/img/game/explosion.png', 96, 96);
        game.load.image('unmuted', 'assets/img/buttons/unmuted.png');
        game.load.image('muted', 'assets/img/buttons/muted.png');
        game.load.spritesheet('gems', 'assets/img/game/gems.png', 80, 80);

        // Sounds
        game.load.audio('sound_gameMusic', 'assets/audio/game.mp3');
        game.load.audio('sound_explosion', 'assets/audio/explosion.mp3');
        game.load.audio('sound_blaster', 'assets/audio/blaster.mp3');
    }

    create() {
        // Create the deadzone (zone in center that the player can move)
        this.deadZone = new Phaser.Rectangle(200, 200, 600, 300);
        // Background (all the world)
        game.add.tileSprite(0, 0, 1500, 1500, 'background');
        game.world.setBounds(0, 0, 1500, 1500);


        //  Add gems group
        this.gems = game.add.group();
        this.gems.enableBody = true;
        this.gems.physicsBodyType = Phaser.Physics.ARCADE;
        this.createGems(this.gems);


        // Start the physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create the player / set the anchor at the center of the sprite / Enable the physics on it / collide with world bounds
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.animations.add('propulse', [1, 2, 3], 30, true); // frames for anim, rate FPS, true for looping
        this.player.anchor.set(0.5, 0.5);
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.set(200);
        this.player.angle -= 90;

        // Create a weapon
        this.weapon = game.add.weapon(30, 'bullet');
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 100;
        //  Tell the Weapon to track the 'player' Sprite | set a little offset | true to track sprite rotation
        this.weapon.trackSprite(this.player, 60, 0, true);

         //  Add meteors group
        this.meteors = game.add.group();
        this.meteors.enableBody = true;
        this.meteors.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMeteors(this.meteors);


        // Create the cursors dor input keyboard
        this.cursors = game.input.keyboard.createCursorKeys();
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Sound and no-sound images
        this.unmuted = game.add.sprite(953, 15, 'unmuted');
        this.unmuted.fixedToCamera = true;
        this.unmuted.inputEnabled = true;
        this.unmuted.events.onInputDown.add(this.muteTheGame, this);

        this.muted = game.add.sprite(953, 15, 'muted');
        this.muted.fixedToCamera = true;
        this.muted.visible = false;
        this.muted.inputEnabled = true;
        this.muted.events.onInputDown.add(this.unmuteTheGame, this);

        // Text displayed
        this.score = 0;
        this.txtScore = game.add.text(15, 15, "Score "+this.score, { font: "24px Arial", fill:"#FFF",  align: "center" });
        this.txtScore.fixedToCamera = true;

        // Create sounds
        this.sound_gameMusic = game.add.audio('sound_gameMusic');
        this.sound_explosion = game.add.audio('sound_explosion');
        this.sound_blaster = game.add.audio('sound_blaster');
        this.sound_gameMusic.volume = 0.2;
        this.sound_gameMusic.loop = true;
        this.sound_explosion.volume = 0.2;
        this.sound_blaster.volume = 0.2;
        this.sound_gameMusic.play();

        // Camera settings
        game.camera.follow(this.player);
        game.camera.deadzone = this.deadZone;
    }

    update(){
        // Set the collision detection between gems and player
        game.physics.arcade.overlap(this.player, this.gems, this.catchGem, null, this);
        // Set the collision detection between bullets and meteors
        game.physics.arcade.overlap(this.weapon.bullets, this.meteors, this.hitMeteor, null, this);

        // Update the score text
        this.txtScore.setText("Score "+this.score);

        // Accelerate when up key is downs
        if (this.cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(this.player.rotation, 800, this.player.body.acceleration);
            this.player.animations.play('propulse'); // true for looping when finish
        }else{
            this.player.body.acceleration.set(0);
            this.player.frame = 0;
        }

        // Rotation left and right
        if (this.cursors.left.isDown){
            this.player.body.angularVelocity = -300;
        }else if (this.cursors.right.isDown){
            this.player.body.angularVelocity = 300;
        }else{
            this.player.body.angularVelocity = 0;
        }


        // Shoot
        if (this.fireButton.isDown){
            this.weapon.fire();
            this.sound_blaster.play();
        }

        // Meteors update
        this.meteors.forEachAlive(function(meteor){
            meteor.update();
            // Reappears at the other side of the world if touch limits
            self.gameState.screenWrap(meteor);
        });
    }

    createMeteors(meteors){
        let totalMeteors = 5;
        for (var x = 0; x < totalMeteors; x++){
            let meteor = new Meteor();
            meteors.add(meteor);
        }
    }

    createGems(gems){
        let totalGems = 10;
        for (var x = 0; x < totalGems; x++){
            let gem = new Gem();
            gems.add(gem);
        }
    }

    hitMeteor(bullet, meteor){
        bullet.kill();
        meteor.kill();
        // Explosion
        let explosion = game.add.sprite(meteor.x, meteor.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.scale.setTo(1.5, 1.5);
        let explode = explosion.animations.add('explode');
        explode.killOnComplete = true;
        explosion.animations.play('explode', 20);
        this.sound_explosion.play();
    }

    catchGem(player, gem){
        gem.kill();
        this.score += 10;
    }

    // Let the sprite reappears at the other side of the world if he touches the world limit
    screenWrap(sprite){
        if (sprite.x < 0){
            sprite.x = game.world._width;
        }else if (sprite.x > game.world._width){
            sprite.x = 0;
        }

        if (sprite.y < 0){
            sprite.y = game.world._height;
        }else if (sprite.y > game.world._height){
            sprite.y = 0;
        }
    }

    muteTheGame(){
        this.sound_gameMusic.pause();
        game.sound.mute = true;
        this.unmuted.visible = false;
        this.muted.visible = true;
    }

    unmuteTheGame(){
        this.sound_gameMusic.resume();
        game.sound.mute = false;
        this.unmuted.visible = true;
        this.muted.visible = false;
    }
}