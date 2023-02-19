import Phaser from "phaser";
import Main from "./scenes/Main";

//Information about the physics world boundary
const physicsWorldBounds = {
    "x": 20, //x coordinate of left corner of the physics world
    "y": 20, //y coordinate of left corner of the physics world
    "width": 760, //width of the physics world
    "height": 560 //height of the physics world
}
//config for the game
var config = {
    width: 800,
    height: 600,
    backgroundColor: 0x2b2b2b,
    scene: [Main],
    type: Phaser.WEBGL,
    powerPreference: "high-performance",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            x: physicsWorldBounds.x,
            y: physicsWorldBounds.y,
            width: physicsWorldBounds.width,
            height: physicsWorldBounds.height,
            gravity: { y: 200 }
        },
        debug: true,
    }
}

var game = new Phaser.Game(config);