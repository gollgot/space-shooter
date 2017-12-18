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
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;

        // Create the cursors dor input keyboard
        this.cursors = game.input.keyboard.createCursorKeys();

        // Camera settings
        game.camera.follow(this.player);
        game.camera.deadzone = this.deadZone;
    }

    update(){
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        //  Move to the left
        if (this.cursors.left.isDown){
            this.player.body.velocity.x = -250;
        }
        //  Move to the right
        else if (this.cursors.right.isDown){
            this.player.body.velocity.x = 250;
        }
        //  Move to the up
        else if (this.cursors.down.isDown){
            this.player.body.velocity.y = 250;
        }
        //  Move to the down
        else if (this.cursors.up.isDown){
            this.player.body.velocity.y = -250;
        }
    }
}