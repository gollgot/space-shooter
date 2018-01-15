// This class init the game and manage the states
class Game extends Phaser.Game {
    constructor(){
        // Create the gameFrame and added it to the parent html called "game"
        super(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, "game");
        // Add all states into the game (a state manager controll automatically all states (in the Game))
        this.state.add('menuState', menuState);
        this.state.add('gameState', gameState);
        this.state.add('gameOverState', gameOverState);
    }
}