// This class init the game and manage the states
class Game extends Phaser.Game {
    constructor(){
        // Create the gameFrame and added it to the parent html called "game"
        super(800, 600, Phaser.AUTO, "game");
    }

    startState(stateName, state){
        switch (stateName) {
            case 'menuState':
                this.state.add('menuState', state);
                this.state.start('menuState');
                break;
            case 'gameState':
                this.state.add('gameState', state);
                this.state.start('gameState');
        }

    }
}