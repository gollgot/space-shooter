// This class init the game and manage the states
class Game extends Phaser.Game {
    constructor(){
        // Create the gameFrame and added it to the parent html called "game"
        super(1000, 700, Phaser.AUTO, "game");
        this.state.add('menuState', menuState);
        this.state.add('gameState', gameState);
    }
}