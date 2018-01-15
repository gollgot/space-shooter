class MenuState extends Phaser.State {

    // Load all the assets
    preload(){
        // Images
        game.load.image('background','assets/img/backgrounds/bg-game.jpg');
        game.load.image('title','assets/img/other/game_title.png');
        game.load.spritesheet('btnPlay', 'assets/img/buttons/btn_play.png', 195, 50);
        // Audio
        game.load.audio('sound_music', 'assets/audio/menu.mp3');
    }

    create() {
        // Background and title
        game.add.tileSprite(0, 0, 1000, 700, 'background');
        this.title = game.add.sprite(game.world.centerX, 100, 'title');
        this.title.anchor.set(0.5, 0.5);

        // BUTTON
        // last tree params are sprite position for UP, Over, Down
        var btnPlay = game.add.button(game.world.centerX, game.world.centerY, 'btnPlay', this.btnPlayOnClick, this, 0, 0, 0);
        btnPlay.anchor.set(0.5, 0.5);

        // AUDIO
        this.sound_music = game.add.audio('sound_music');
        this.sound_music.volume = 0.2;
        this.sound_music.loop = true;
        this.sound_music.play();
    }

    btnPlayOnClick () {
        this.sound_music.stop();
        /*
         * Start the gameState
         * Param1: state id
         * Param2 : clear the world cache (object etc.)
         * Param3 : Clear the cache (assets etc.)
         * param 4 - 5 - 6 : Game level / Player lives / Score
         */
        game.state.start("gameState", true, false, 1, 3, 0);
    }
}