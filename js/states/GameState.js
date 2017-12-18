class GameState extends Phaser.State {
    init(){
        console.log("GameState INIT");
    }

    preload(){
        game.load.image('background','img/backgrounds/bg-game.jpg');
        game.load.image('player','img/game/player.png');
    }

    create() {
        // Create the deadzone (zone in center that the player can move)
        this.deadZone = new Phaser.Rectangle(150, 150, 500, 300);
        // Background (all the world)
        game.add.tileSprite(0, 0, 1920, 1920, 'background');
        game.world.setBounds(0, 0, 1920, 1920);

        // Start the physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create the player / set the anchor at the center of the sprite / Enable the physics on it / collide with world bounds
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.set(0.5, 0.5);
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.set(200);
        this.player.angle -= 90;

        // Create the cursors dor input keyboard
        this.cursors = game.input.keyboard.createCursorKeys();

        // Camera settings
        game.camera.follow(this.player);
        game.camera.deadzone = this.deadZone;
    }

    update(){
        // Accelerate when up key is downs
        if (this.cursors.up.isDown)
        {
            game.physics.arcade.accelerationFromRotation(this.player.rotation, 800, this.player.body.acceleration);
        }
        else
        {
            this.player.body.acceleration.set(0);
        }

        // Rotation left and right
        if (this.cursors.left.isDown)
        {
            this.player.body.angularVelocity = -300;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.angularVelocity = 300;
        }
        else
        {
            this.player.body.angularVelocity = 0;
        }
    }
}