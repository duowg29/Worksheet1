import { AUTO, Game } from "phaser";
import WorksheetScene from "./scenes/WorksheetScene";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 900, // Kích thước theo thiết kế Figma
    height: 1165,
    parent: "phaser-example",
    backgroundColor: "#FFFFFF",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: 1920,
            height: 1080,
        },
        min: {
            width: 480,
            height: 270,
        },
    },

    pixelArt: false,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true,
            debugShowVelocity: false,
        },
    },
    scene: [WorksheetScene],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
