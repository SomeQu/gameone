import Phaser from "phaser";
import { LoadingScene } from "./scenes/LoadingScene";
import HomeScene from "./scenes/HomeScene";

const config = {
  type: Phaser.WEBGL,
  width: 1500,
  height: 800,
  backgroundColor: "grey",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  },
  scene: [HomeScene],
  pixelArt: true,
  roundPixels: true,
};
export default config;
