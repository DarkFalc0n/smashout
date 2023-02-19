import Phaser from "phaser";
import ballSprite from "../assets/ball.png";
import baseSprite from "../assets/base.png";
import bgImage from "../assets/bg.png";
import brickSprite from "../assets/brick.png";

class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }

    preload() {
        this.load.image("background", bgImage);
        this.load.image("ball", ballSprite);
        this.load.image("base", baseSprite);
        this.load.image("brick", brickSprite);
    }

    create() {
        this.bg = this.add.image(400, 300, "background");
        this.ball = this.placeBall();
        this.base = this.placeBase();
        this.keyControls = this.input.keyboard.createCursorKeys();
        // //collision between the ball and the base
        this.brickGroup = this.add.group();
        this.physics.add.collider(this.ball, this.base);
        this.physics.add.collider(this.ball, this.brickGroup);
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (down) {
                this.gameOver();
            }
        });
        this.generateBricks();
    }

    update() {
        this.movementManager();
    }

    generateBricks() {
        this.brickGroup.enableBody = true;
        this.brickGroup.physicsBodyType = Phaser.Physics.Arcade;
        this.placeBricks(this.brickGroup);
    }

    placeBricks(brickGroup) {
        let rows = 3, columns = 10, xOffset = 10, yOffset = 10, width = 65, height = 35;
        let brick;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let brick = this.physics.add.image(53 + (xOffset * (j + 1) + width * j), 40 + (yOffset * (i + 1) + height * i), "brick");
                brick.body.allowGravity = false;
                brick.body.immovable = true;
                brickGroup.add(brick);
            }
        }
    }
    placeBase() {
        const base = this.physics.add.image(400 - 50, 500, "base");
        base.setBounce(1)
            .setCollideWorldBounds(true);
        base.body.immovable = true;
        base.body.allowGravity = false;
        return base;
    }

    placeBall() {
        const ball = this.physics.add.image(200, 200, "ball");
        ball.setVelocity(250, 550)//initial velocity
            .setCollideWorldBounds(true)
            //sets bounds smaller than the canvas for the border
            .body.setBoundsRectangle(new Phaser.Geom.Rectangle(20, 20, 760, 560))
            .setBounce(1); //fully elastic behaviour
        ball.setScale(0.6);
        ball.body.onWorldBounds = true;
        return ball;
    }



    moveBase(dir) {  //dir is the direction of movement
        const velocity = 300; //how fast can you control the base
        this.base.setVelocity(dir * velocity, 0);
    }

    stopBase() {
        this.base.setVelocity(0, 0);
    }

    movementManager() {
        if (this.keyControls.left.isDown === true && this.keyControls.right.isDown === true) {
            this.stopBase();
            return;
        }
        if (this.keyControls.left.isUp === true) {
            this.stopBase();
        }
        if (this.keyControls.right.isUp === true) {
            this.stopBase();
        }
        if (this.keyControls.left.isDown === true) {
            this.moveBase(-1);
            return;
        }
        if (this.keyControls.right.isDown === true) {
            this.moveBase(1);
            return;
        }
    }


    gameOver() {
        console.log("Game Over");
        //Define gameOver logic
    }

}

export default Main;
