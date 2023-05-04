import { Input, Scene } from "phaser";

export default class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  preload() {
    this.load.audio('mainMusic', ['/sound/undertale_085. Fallen Down (Reprise).mp3'])
    // load font
  }

  create() {
    this.mainMusic= this.sound.add('mainMusic', {loop:false})
    this.mainMusic.play()
    this.add
      .text(950, 500, "you died", {
        fontSize: 70,
        color: "red",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(950, 600, "press f to restart", {
        fontSize: 50,
        fontWeight: 700,
        color: "red",
      })
      .setOrigin(0.5, 0.5);
  }

  update() {
    const spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.F);

    if (Input.Keyboard.JustDown(spaceKey)) {
      this.scene.start("MainScene");
      this.boxHP = 100;
    }
  }
}
