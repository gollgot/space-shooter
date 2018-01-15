class GameOverState extends Phaser.State {

    // State initialisation, get params passed from the previous state
    init(score, level){
        this.score = score;
        this.level = level;
    }

    // Load all the assets
    preload(){
        // Images
        game.load.spritesheet('btnRetry', 'assets/img/buttons/btn_retry.png', 195, 50);
        game.load.image('gameover_title','assets/img/other/gameover_title.png');

        // Audio
        game.load.audio('sound_music', 'assets/audio/game_over.mp3');
    }

    create() {
        // GAME WORLD + TITLE
        game.world.setBounds(0, 0, 1000, 700); // Mandatory to have the world match windows game, not the real big world in the game state
        game.add.tileSprite(0, 0, 1000, 700, 'background');
        this.gameover_title = game.add.sprite(game.world.centerX, 100, 'gameover_title');
        this.gameover_title.anchor.set(0.5, 0.5);

        // TEXTS
        this.txtScore = game.add.text(game.world.centerX, game.world.centerY - 80, "Votre score : " + this.score, { font: "26px Arial", fill:"#FFF",  align: "center" });
        this.txtScore.anchor.set(0.5, 0.5);
        this.txtLevel = game.add.text(game.world.centerX, game.world.centerY - 40, "Niveau atteint : " + this.level, { font: "26px Arial", fill:"#FFF",  align: "center" });
        this.txtLevel.anchor.set(0.5, 0.5);

        // BUTTON
        // last tree params are spriteposition for UP, Over, Down (not used for me)
        var btnRetry = game.add.button(game.world.centerX, game.world.centerY + 40, 'btnRetry', this.btnRetryOnClick, this, 0, 0, 0);
        btnRetry.anchor.set(0.5, 0.5);

        // AUDIO
        this.sound_music = game.add.audio('sound_music');
        this.sound_music.volume = 0.2;
        this.sound_music.play();
    }

    btnRetryOnClick () {
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