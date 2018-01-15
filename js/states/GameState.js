class GameState extends Phaser.State {

    // State initialisation, get params passed from the previous state
    init(level, playerLife, score){
        this.level = level;
        this.playerLife  = playerLife;
        this.score = score;
    }

    // Load all the assets
    preload(){
        // Game images
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
        game.load.image('life', 'assets/img/game/life.png');

        // Sounds
        game.load.audio('sound_gameMusic', 'assets/audio/game.mp3');
        game.load.audio('sound_gem', 'assets/audio/gem.mp3');
        game.load.audio('sound_explosion', 'assets/audio/explosion.mp3');
        game.load.audio('sound_blaster', 'assets/audio/blaster.mp3');
    }

    create() {
        // Create the deadzone (zone in center that the player can move)
        this.deadZone = new Phaser.Rectangle(200, 200, 600, 300);
        // Create the world (background and world bounds)
        game.add.tileSprite(0, 0, 1500, 1500, 'background');
        game.world.setBounds(0, 0, 1500, 1500);
        // Phsysics
        game.physics.startSystem(Phaser.Physics.ARCADE);


        // GEMS (create a group of X gems and display them randomly in the world)
        this.gems = game.add.group();
        this.gems.enableBody = true;
        this.gems.physicsBodyType = Phaser.Physics.ARCADE;
        this.totalGems = 5;
        this.catchingGems = 0;
        this.createGems(this.gems, this.totalGems);


        // PLAYER
        // Create the player / set the anchor at the center of the sprite / Enable the physics on it / collide with world bounds
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.animations.add('propulse', [1, 2, 3], 30, true); // frames for anim, rate FPS, true for looping
        this.player.anchor.set(0.5, 0.5);
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.set(200);
        this.player.angle -= 90;


        // WEAPON
        this.weapon = game.add.weapon(30, 'bullet'); // 30 bullet max on the screen
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 100ms
        this.weapon.fireRate = 100;
        //  Tell the Weapon to track the 'player' Sprite | set a little offset | true to track sprite rotation
        this.weapon.trackSprite(this.player, 60, 0, true);


         // METEORS
        this.meteors = game.add.group();
        this.createMeteors(this.meteors, 3);
        this.creationMeteorProcess(); // Launch the process which will create each 3sec 1 more meteor


        // CURSORS (FOR KEYBOARD INPUT) and fireButton
        this.cursors = game.input.keyboard.createCursorKeys(); //used to manage keyboard input in update method
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR); // Spacebar is the firebutton


        // MUTE / UNMUTE
        this.unmuted = game.add.sprite(953, 15, 'unmuted');
        this.unmuted.fixedToCamera = true;
        this.unmuted.inputEnabled = true;
        this.unmuted.events.onInputDown.add(this.muteTheGame, this);

        this.muted = game.add.sprite(953, 15, 'muted');
        this.muted.fixedToCamera = true;
        this.muted.visible = false;
        this.muted.inputEnabled = true;
        this.muted.events.onInputDown.add(this.unmuteTheGame, this);


        // HUD
        // Score
        this.txtLevel = game.add.text(15, 15, "Niveau "+this.level, { font: "24px Arial", fill:"#FFF",  align: "center" });
        this.txtLevel.fixedToCamera = true;
        this.txtScore = game.add.text(15, 45, "Score "+this.score, { font: "24px Arial", fill:"#FFF",  align: "center" });
        this.txtScore.fixedToCamera = true;
        // Catching gems
        this.gemImg = game.add.sprite(15, 80, 'gems');
        this.gemImg.fixedToCamera = true;
        this.gemImg.scale.setTo(0.3, 0.3);
        this.txtCatchingGems = game.add.text(45, 80, this.catchingGems+" / "+this.totalGems, { font: "22px Arial", fill:"#FFF",  align: "center" });
        this.txtCatchingGems.fixedToCamera = true;
        // Lives - Added 3 lives
        this.lives = game.add.group();
        for (var i = 0; i < this.playerLife; i++) {
            let life = game.add.sprite(this.deadZone.centerX - (33+10+16) + (i*33) + (i*10), 15, 'life'); // Calculate position to place all 3 lives in center of the screen
            life.fixedToCamera = true;
            this.lives.add(life);
        }


        // SOUNDS
        this.sound_gameMusic = game.add.audio('sound_gameMusic');
        this.sound_gem = game.add.audio('sound_gem');
        this.sound_explosion = game.add.audio('sound_explosion');
        this.sound_blaster = game.add.audio('sound_blaster');
        this.sound_gameMusic.volume = 0.2;
        this.sound_gameMusic.loop = true;
        this.sound_gem.volume = 0.2;
        this.sound_explosion.volume = 0.2;
        this.sound_blaster.volume = 0.2;
        this.sound_gameMusic.play();


        // CAMERA SETTINGS
        game.camera.follow(this.player);
        game.camera.deadzone = this.deadZone;
    }

    // game loop (called 60 times per second)
    update(){
        // COLLISONS MANAGER
        // Set the collision detection between gems and player
        game.physics.arcade.overlap(this.player, this.gems, this.catchGem, null, this);
        // Set the collision detection between player and meteors
        game.physics.arcade.overlap(this.player, this.meteors, this.playerHitMeteor, null, this);
        // Set the collision detection between bullets and meteors
        game.physics.arcade.overlap(this.weapon.bullets, this.meteors, this.bulletsHitMeteor, null, this);


        // SCORE MANAGER
        // Update the score and catching gems texts
        this.txtScore.setText("Score "+this.score);
        this.txtCatchingGems.setText(this.catchingGems+" / "+this.totalGems);


        // KEYBOARD INPUT
        // Accelerate when up key is downs
        if (this.cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(this.player.rotation, 900, this.player.body.acceleration);
            this.player.animations.play('propulse'); // Animate the player to show engine fire
        }
        // Stop acceleration and animation when key up
        else{
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
            meteor.update(); // Call the update method for each meteor, to update their position and rotation
            // Reappears at the other side of the world if touch limits
            self.gameState.screenWrap(meteor);
        });
    }


    // Create a number of meteor and add them into the meteors group
    createMeteors(meteors, nb){
        for (var x = 0; x < nb; x++){
            let meteor = new Meteor();
            meteors.add(meteor);
        }
    }

    // Each 3 seconds, create 1 more meteors
    creationMeteorProcess(){
        this.meteorProcess = window.setInterval(function(){
            if(self.gameState.playerLife > 0){
                self.gameState.createMeteors(self.gameState.meteors, 1);
            }
        }, 3000);
    }

    // Create a number of gems and add them into the gems group
    createGems(gems, totalGems){
        for (var x = 0; x < totalGems; x++){
            let gem = new Gem();
            gems.add(gem);
        }
    }

    // Catch a gem (called when collide occure between player and gem)
    catchGem(player, gem){
        this.sound_gem.play();
        gem.kill();
        this.gems.remove(gem);
        this.score += 50;
        this.catchingGems ++;

        // Catching all the available gems
        if(this.catchingGems == this.totalGems){
            this.sound_gameMusic.stop();
            clearInterval(this.meteorProcess); // Stop the generation of meteor (mandatory because this is an event on the windows, so when we launch the new gameState (lvl2) a new generation of meteor will be called)
             /*
             * Start the gameState
             * Param1: state id
             * Param2 : clear the world cache (object etc.)
             * Param3 : Clear the cache (assets etc.)
             * param 4 - 5 - 6 : Game level / Player lives / Score
             */
            game.state.start("gameState", true, false, this.level + 1, this.playerLife, this.score);
        }
    }

    // Hitting meteor (player)
    playerHitMeteor(player, meteor){
        // Kill and remove current meteor
        meteor.kill();
        this.meteors.remove(meteor);
        // Remove the last life img on the HUD and remove one playerLife
        let count = 1;
        this.lives.forEachAlive(function(life){
            if(count == self.gameState.playerLife){
                life.kill();
                self.gameState.playerLife --;
                // Create and display explosion animation at the current meteor position
                let explosion = game.add.sprite(meteor.x, meteor.y, 'explosion');
                explosion.anchor.setTo(0.5, 0.5);
                explosion.scale.setTo(1.5, 1.5);
                let explode = explosion.animations.add('explode');
                explode.killOnComplete = true;
                explosion.animations.play('explode', 20);
                self.gameState.sound_explosion.play();
            }
            count++;
        });

        // Player dead
        if(this.playerLife == 0){
            this.sound_gameMusic.stop();
            clearInterval(this.meteorProcess); // Stop the generation of meteor (mandatory because this is an event on the windows, so when we launch the new gameState (lvl2) a new generation of meteor will be called)
            /*
             * Start the gameOver state
             * Param1: state id
             * Param2 : clear the world cache (object etc.)
             * Param3 : Clear the cache (assets etc.)
             * param 4 - 5 : Score / Game level reached
             */
            game.state.start("gameOverState", true, false, this.score, this.level);
        }
    }

    // Hitting meteor (weapon's bullets)
    bulletsHitMeteor(bullet, meteor){
        bullet.kill();
        // kill and remove current meteor
        meteor.kill();
        this.meteors.remove(meteor);
        // Create and display explosion animation at the current meteor position
        let explosion = game.add.sprite(meteor.x, meteor.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.scale.setTo(1.5, 1.5);
        let explode = explosion.animations.add('explode');
        explode.killOnComplete = true;
        explosion.animations.play('explode', 20);
        this.sound_explosion.play();
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