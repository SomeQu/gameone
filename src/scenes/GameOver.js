import { Input, Scene } from "phaser";

export default class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  preload() {
    // load font
  }

  create() {
    console.log("you died");
    this.add
      .text(150, 100, "you died", {
        fontSize: 24,
        color: "white",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(150, 100, "press f to restart", {
        fontSize: 24,
        color: "white",
      })
      .setOrigin(0.5, 0.5);
  }

  update() {
    const spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.F);

    if (Input.Keyboard.JustDown(spaceKey)) {
      this.scene.start("MainScene");
    }
  }
}
