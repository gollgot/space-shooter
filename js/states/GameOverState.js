class GameOverState extends Phaser.State {
    init(score){
        console.log("GameOver score : "+score);
    }

    preload(){
        // Image
        game.load.spritesheet('btnRetry', 'assets/img/buttons/btn_retry.png', 195, 50);
        game.load.image('gameover_title','assets/img/other/gameover_title.png');
        // Audio
        game.load.audio('sound_music', 'assets/audio/game_over.mp3');
    }

    create() {
        game.world.setBounds(0, 0, 1000, 700); // Mandatory to have the world match windows game, not the real big world in the game state
        game.add.tileSprite(0, 0, 1000, 700, 'background');
        this.gameover_title = game.add.sprite(game.world.centerX, 100, 'gameover_title');
        this.gameover_title.anchor.set(0.5, 0.5);

        // BUTTON
        // last tree params are spriteposition for UP, Over, Down
        var btnRetry = game.add.button(game.world.centerX, game.world.centerY, 'btnRetry', this.btnRetryOnClick, this, 0, 0, 0);
        btnRetry.anchor.set(0.5, 0.5);

        // AUDIO
        this.sound_music = game.add.audio('sound_music');
        this.sound_music.volume = 0.2;
        this.sound_music.play();
    }

    update(){

    }

    btnRetryOnClick () {
        this.sound_music.stop();
        // Launch the game state
        game.state.start("gameState", true, false);
    }

}