import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene 
{
  constructor() {
    super( "MainScene")
    this.player=null
  }
  preload(){
    this.load.image('sky', '/images/bluesky.jpeg')
    this.load.image('ground', '/images/ground.png')
    this.load.spritesheet('player', '/player/main_hero.png', {frameWidth:300, frameHeight:300 })
  }
  create() {
    this.add.image('961','320','sky')
    this.ground = this.physics.add.staticGroup()
    this.ground.create('961', '620', 'ground')
    this.ground.create('300', '620', 'ground')
    this.ground.create('1500', '620', 'ground')
    this.player=this.physics.add.sprite(100, 100,'player')
    this.player.setCollideWorldBounds(true)

    this.cursor = this.input.keyboard.createCursorKeys()


    // this.scene.start("MainScene");
  }

  update(){
    if(this.cursor.left.isDown){
      this.player.setVelocityX(-160)
    }else if(this.cursor.right.isDown){
      this.player.setVelocityX(160)
    }else{
      this.player.setVelocityX(0)
    }
    if(this.cursor.up.isDown && this.player.body.touching.down){
      this.player.setVelocityY(-160)
    }
  }

}

