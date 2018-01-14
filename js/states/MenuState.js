class MenuState extends Phaser.State {
    init(){
        console.log("MenuState INIT");
    }

    preload(){
        // Image
        game.load.image('background','assets/img/backgrounds/bg-game.jpg');
        game.load.spritesheet('btnPlay', 'assets/img/buttons/btn_play.png', 195, 50);
        // Audio
        game.load.audio('sound_music', 'assets/audio/menu.mp3');
    }

    create() {
        // Background (all the world)
        game.add.tileSprite(0, 0, 1000, 700, 'background');
        // BUTTON
        // last tree params are spriteposition for UP, Over, Down
        var btnPlay = game.add.button(game.world.centerX, game.world.centerY, 'btnPlay', this.btnPlayOnClick, this, 0, 0, 0);
        btnPlay.anchor.set(0.5, 0.5);

        // AUDIO
        this.sound_music = game.add.audio('sound_music');
        this.sound_music.volume = 0.2;
        this.sound_music.loop = true;
        this.sound_music.play();
    }

    update(){

    }

    btnPlayOnClick () {
        this.sound_music.stop();
        game.state.start("gameState");
    }
}