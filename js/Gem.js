class Gem extends Phaser.Sprite{

    constructor(){
        super(game, game.world.randomX, game.world.randomY, 'gems');
        this.create();
    }

    create(){
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.animations.add('gemRotation', [1,2,3,4,5,6], 10, true); // frames for anim, rate FPS, true for looping
        this.animations.play('gemRotation');
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.4, 0.4);
    }

    update(){

    }
}

