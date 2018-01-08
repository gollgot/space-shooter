class GameOverState extends Phaser.State {
    init(score){
        console.log("GameOver score : "+score);
    }

    preload(){
        // Audio
        game.load.audio('sound_music', 'assets/audio/game_over.mp3');
    }

    create() {
        this.sound_music = game.add.audio('sound_music');
        this.sound_music.volume = 0.2;
        this.sound_music.play();
    }

    update(){

    }

}