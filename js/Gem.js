class Gem extends Phaser.Sprite{

    constructor(){
        super(game, game.world.randomX, game.world.randomY, 'gems');
        this.create();
    }

    create(){
        this.animations.add('gemRotation', [1,2,3,4,5,6], 10, true); // frames for anim, rate FPS, true for looping
        this.animations.play('gemRotation');
        this.anchor.setTo(0.5, 0.5); // Set anchor to the middle of sprite (not top - left)
        this.scale.setTo(0.4, 0.4);
    }

}

