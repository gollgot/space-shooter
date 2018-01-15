// Get all the states
var menuState = new MenuState();
var gameState = new GameState();
var gameOverState = new GameOverState();

// Define constants
const WINDOW_WIDTH = 1000;
const WINDOW_HEIGHT = 700;

// Create the game and laod the menu
var game = new Game();
game.state.start('menuState');