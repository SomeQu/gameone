import Phaser from "phaser";
import MainScene from "./scenes/MainScene";

const config = {
  type: Phaser.WEBGL,
  width: "100%",
  height: "115%",
  backgroundColor: "grey",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  },
  scene: [MainScene],
  pixelArt: true,
  roundPixels: true,
};
export default config;
