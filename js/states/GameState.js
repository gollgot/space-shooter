class GameState extends Phaser.State {
    init(){
        console.log("GameState INIT");
    }

    preload(){
        game.load.image('background','img/backgrounds/debug-grid.png');
        game.load.image('player','img/player.png');
    }

    create() {
        this.deadZone = new Phaser.Rectangle(150, 150, 500, 300);

        game.add.tileSprite(0, 0, 1920, 1920, 'background');
        game.world.setBounds(0, 0, 1920, 1920);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;

        this.cursors = game.input.keyboard.createCursorKeys();

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