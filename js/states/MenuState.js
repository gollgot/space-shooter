class MenuState extends Phaser.State {
    init(){
        console.log("MenuState INIT");
    }

    preload(){
        game.load.spritesheet('btnPlay', 'img/buttons/play.png', 195, 50);
    }

    create() {
        game.stage.backgroundColor = "#3A2E3F";
        // UP, Over, Down
        var btnPlay = game.add.button(game.world.centerX, game.world.centerY, 'btnPlay', this.actionOnClick, this, 0, 0, 0);
        btnPlay.anchor.set(0.5, 0.5);
    }

    update(){

    }

    actionOnClick () {
        console.log("Clicked");
    }
}