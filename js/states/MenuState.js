class MenuState extends Phaser.State {
    init(){
        console.log("MenuState INIT");
    }

    preload(){
        // Image
        game.load.image('background','assets/img/backgrounds/bg-game.jpg');
        game.load.image('title','assets/img/other/game_title.png');
        game.load.spritesheet('btnPlay', 'assets/img/buttons/btn_play.png', 195, 50);
        // Audio
        game.load.audio('sound_music', 'assets/audio/menu.mp3');
    }

    create() {
        // Background (all the world) and images
        game.add.tileSprite(0, 0, 1000, 700, 'background');
        this.title = game.add.sprite(game.world.centerX, 100, 'title');
        this.title.anchor.set(0.5, 0.5);

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
        game.state.start("gameState", true, false, 1, 25, 0);
        // - 2nd parameter clear the world cache (custom object)
        // - 3rd NOT clear the cache (loaded assets)
        // Params : 1) level 2) lives 3) score
    }
}