class Meteor extends Phaser.Sprite{

    constructor(){
        // Generate a random number to pick one of my 4 meteors skin
        let randomNumber = Math.floor(Math.random() * 4) + 1;
        super(game, game.world.randomX, game.world.randomY, 'meteor'+randomNumber);
        this.create();
    }



    create(){
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5); // Set the anchor at the middle of the sprite (not top left cornet)

        // Choose a random angle (rotation) and direction for the meteor
        this.rotationAngle = this.generateRandom(0.2, 1.2, true, true);
        this.newX = this.generateRandom(1, 4, true, true);
        this.newY = this.generateRandom(1, 2, true, true);
    }



    update(){
        // Update the position and rotation
        this.angle += this.rotationAngle;
        this.x = this.x + this.newX;
        this.y = this.y + this.newY;
    }



    // Gennerate a random number between the min and max (inclusive) and possible to have float number and negative
    generateRandom(min, max, float, negative){
        let result = 0;
        // user want a float number
        if (float){
            result = Math.random() * max + min;
        }
        // user doesn't want a float number
        else{
            result = Math.floor(Math.random() * max) + min;
        }

        // user want positive AND negative number
        if(negative){
            // 50% chance the number choose above will be negative or positive
            result *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        }

        return result;
    }


}
