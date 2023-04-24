import Phaser from 'phaser'


export default class Main extends Phaser.Scene 
{
  constructor() {
    super({ key: "Main" });
  }
  preload(){
  }
  create() {
    this.scene.start("Main");
  }

}

