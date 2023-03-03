import Phaser from "phaser";
import ballSprite from "../assets/ball.png";
import baseSprite from "../assets/base.png";
import bgImage from "../assets/bg.png";
import brickSprite from "../assets/brick.png";
import Swal from "sweetalert2";

class Main extends Phaser.Scene {
    constructor() {
        super("Main");
        this.score=0;
        this.scoreText=null;  
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
        this.scoreText=this.add.text(5,0,'Score: '+this.score, {font:'800 18px Poppins' ,fill:'#00000'});
        // //collision between the ball and the base
        this.brickGroup = this.add.group();
        // this.physics.add.collider(this.ball, this.base);
        // this.physics.add.collider(this.ball, this.brickGroup,this.ballhitbrick);
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (down) {
                this.gameOver();
                this.retry();
            }
        });
        this.generateBricks();
    }

    update() {
        this.movementManager();
        this.physics.add.collider(this.ball, this.base,this.ballhitbase);
        this.physics.add.collider(this.ball, this.brickGroup,this.ballhitbrick,null,this);
    }
    ballhitbase(){
        console.log("hitbase");
    }
    ballhitbrick(ball,brick){
        console.log("hitbrick");
         brick.destroy();
         this.score+=1;
         if(this.scoreText) {
            this.scoreText.setText('Score: ' + this.score);
        }

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
        const ball = this.physics.add.image(400 - 50, 450, "ball");
        ball.setVelocity(0,0)//initial velocity
            .setCollideWorldBounds(true)
            //sets bounds smaller than the canvas for the border
            .body.setBoundsRectangle(new Phaser.Geom.Rectangle(20, 20, 760, 560))
            .setBounce(0); //fully elastic behaviour
        ball.setScale(0.6);
        ball.body.onWorldBounds = true;
        return ball;
    }



    moveBase(dir) {  //dir is the direction of movement
        const velocity = 300; //how fast can you control the base
        this.base.setVelocity(dir * velocity, 0);
    }

    moveBall(){
        this.ball.setVelocity(250,450);
        
    }

    stopBall() {
        this.ball.setVelocity(0,500);
        this.ball.setBounce(0);
    }

    stopBase() {
        this.base.setVelocity(0, 0);
    }

    movementManager() {
        if(this.keyControls.space.isDown===true){
            this.ball.setBounce(1);
            this.moveBall();
        }
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

    retry(){
        Swal.fire({
            title: 'YOU LOST!!',
            text: "Do you want to retry??",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
          }).then((result) => {
            if (result.isConfirmed) {
                this.create();
            } else {
                Swal.fire(
                    'Thank you for Playing!',
                )
            }
          })
    }

    gameOver() {
        console.log("Game Over");
        //Define gameOver logic
        this.ball.setPosition(350);
        this.stopBall();
    }

}

export default Main;
