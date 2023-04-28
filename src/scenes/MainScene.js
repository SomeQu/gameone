import Phaser from 'phaser'
import { useState } from 'react';

export default class MainScene extends Phaser.Scene 
{
  state={
    boxHP:100
  }
  constructor() {
    super( "MainScene")
    this.player=null
    this.box=null
    this.swordHitbox=null
    
  }
  preload(){
    this.load.image('sky', '/images/bluesky.jpeg')
    this.load.image('ground', '/images/ground.png')
    this.load.atlas('player', 
    '/player/knight_texture.png',
    '/player/knight_texture.json', 
    {frameWidth:300, frameHeight:100 });
  
  }
  create() {
    
    this.add.image('961','320','sky')

    this.ground = this.physics.add.staticGroup()

    this.ground.create('961', '620', 'ground')
    this.ground.create('300', '620', 'ground')
    this.ground.create('1500', '620', 'ground')


    this.player=this.physics.add.sprite(100, 500,'player', 'idle_1.png')
    this.player.setScale(2);
    this.player.setBodySize(50, 50, 0.5, 0.5);
    this.player.body.setOffset(120, 79);    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, this.ground)
   
    this.cursor = this.input.keyboard.createCursorKeys()


    this.box = this.add.rectangle(400, 550, 100, 100, 0xffffff);
    this.physics.add.existing(this.box, true)
    this.physics.add.collider(this.player, this.box)
    this.hpText = this.add.text(this.box.x, this.box.y - 90, `HP: ${this.state.boxHP}`)
			.setOrigin(0.5).setVisible(true)


    this.swordHitbox = this.add.rectangle(130, 130, 100, 150, "0xfqqfff",0);
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.remove(this.swordHitbox.body);
    console.log(this.swordHitbox.body);


		console.log(this.swordHitbox.body)


        this.physics.add.collider(this.swordHitbox, this.box);
    this.physics.add.overlap(
      this.swordHitbox,
      this.box,
      this.overlapping,
      null,
      this
    );
     
    this.anims.create({
      key: "run",
      frames: this.player.anims.generateFrameNames("player", {
        start: 0,
        end: 7,
        prefix: "#run_",
        suffix: ".png",
      }),
      frameRate: 15,
    });
    this.anims.create({
      key: "jump",
      frames: this.player.anims.generateFrameNames("player", {
        start: 0,
        end: 19,
        prefix: "#jump_",
        suffix: ".png",
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "jumpup",
      frames: this.player.anims.generateFrameNames("player", {
        start: 1,
        end: 3,
        prefix: "jumpup_",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.player.anims.generateFrameNames("player", {
        start: 0,
        end: 7,
        prefix: "#idle_",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "jumpd",
      frames: this.player.anims.generateFrameNames("player", {
        start: 1,
        end: 3,
        prefix: "jumpd_",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "attack",
      frames: this.player.anims.generateFrameNames("player", {
        start: 0,
        end: 10,
        prefix: "#1_atk_",
        suffix: ".png",
      }),
      frameRate: 20,
      repeat: 0,
    });

    console.log(this.player)
    // this.scene.start("MainScene");
    
  }
  overlapping(box, swordHitbox){
    console.log('hi there')
    this.state.boxHP += -10
    console.log(this.state.boxHP)
  }
  criticalHP(){
    if(this.hpText.text<= 30){
      this.box.fillColor = 0xff0000
    }
    if(this.hpText.text<=0){
      this.box.destroy()
      this.hpText.setVisible(false)
    }
  }
  update(){
    this.hpText.text =`${this.state.boxHP}`
    this.criticalHP()
    this.swordHitbox.x = this.player.x + 80;
    this.swordHitbox.y = this.player.y + 60;
   
     this.player.setVelocityX(0)
    if(this.cursor.left.isDown){
      this.player.setVelocityX(-150)
      if(this.player.body.velocity.y ===0){

        this.player.play('run',true).chain('idle')
      }

    }else if(this.cursor.right.isDown){
      this.player.setVelocityX(150)
      if(this.player.body.velocity.y ===0){

        this.player.play('run',true).chain('idle')
      }
    }else if(this.cursor.up.isDown && this.player.body.onFloor()){
      this.player.setVelocityY(-250) 
    
      this.player.play('jump').chain('idle')
       

    
      // this.player.play('jumpup', true)

    }else if(this.cursor.space.isDown){
        this.player.play('attack',false).chain('idle')
        this.swordHitbox.body.enable = true
			this.physics.world.add(this.swordHitbox.body)
      setTimeout(() => {
        this.swordHitbox.body.enable = false
        this.physics.world.remove(this.swordHitbox.body)
        
      }, 20);

      }  
      

  }
    
  
  //* Можно прыгать в воздухе
//   if(this.cursor.up.isDown && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

//     this.player.setVelocityY(-300);

//     this.anims.play('jumpup', this.player);

// }

// }

}

