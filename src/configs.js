import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import GameOver from "./scenes/GameOver";

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "grey",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [MainScene, GameOver],
  pixelArt: true,
  roundPixels: true,
};
export default config;
