class GameState extends Phaser.State {
    init(){
        console.log("GameState INIT");
    }

    preload(){
        game.load.image('background','img/backgrounds/bg-game.jpg');
        game.load.spritesheet('player', 'img/game/player.png', 88, 99, 4); // 5 sprites an each 88 x 99 px
        game.load.image('bullet', 'img/game/bullet.png');
        game.load.image('meteor1','img/game/meteor1.png');
        game.load.image('meteor2','img/game/meteor2.png');
        game.load.image('meteor3','img/game/meteor3.png');
        game.load.image('meteor4','img/game/meteor4.png');
    }

    create() {
        // Create the deadzone (zone in center that the player can move)
        this.deadZone = new Phaser.Rectangle(150, 150, 500, 300);
        // Background (all the world)
        game.add.tileSprite(0, 0, 1000, 1000, 'background');
        game.world.setBounds(0, 0, 1000, 1000);

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

        // Camera settings
        game.camera.follow(this.player);
        game.camera.deadzone = this.deadZone;
    }

    update(){
        // Set the collision detection between bullets and meteors
        game.physics.arcade.overlap(this.weapon.bullets, this.meteors, this.hitMeteor, null, this);

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
        }

        // Meteors update
        this.meteors.forEachAlive(function(meteor){
            let newAngle = Math.floor(Math.random() * 2) + 0.5;

            meteor.angle += 1.5;
            meteor.x = meteor.x + 1;
            meteor.y = meteor.y + 2;
            // Reappears at the other side of the world if touch limits
            self.gameState.screenWrap(meteor);
        });
    }

    createMeteors(meteors){
        let totalMeteors = 5;
        for (var x = 0; x < totalMeteors; x++){
            let randomNumber = Math.floor(Math.random() * 4) + 1;
            let meteor = meteors.create(game.world.randomX, game.world.randomY, 'meteor'+randomNumber);
            game.physics.enable(meteor, Phaser.Physics.ARCADE);
            meteor.anchor.setTo(0.5, 0.5);
        }
    }

    hitMeteor(bullet, meteor){
        bullet.kill();
        meteor.kill();
        console.log("Hit a meteor at : ("+meteor.x+" ; "+meteor.y+")");
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
}