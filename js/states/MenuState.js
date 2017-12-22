class MenuState extends Phaser.State {
    init(){
        console.log("MenuState INIT");
    }

    preload(){
        game.load.spritesheet('btnPlay', 'assets/img/buttons/play.png', 195, 50);
    }

    create() {
        game.stage.backgroundColor = "#3A2E3F";
        // last tree params are spriteposition for UP, Over, Down
        var btnPlay = game.add.button(game.world.centerX, game.world.centerY, 'btnPlay', this.btnPlayOnClick, this, 0, 0, 0);
        btnPlay.anchor.set(0.5, 0.5);
    }

    update(){

    }

    btnPlayOnClick () {
        console.log("Clicked");
        game.state.start("gameState");
    }
}