import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene 
{
  constructor() {
    super( "MainScene")
    this.player=null
    this.box=null
    this.boxHP = 100;
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
    this.player=this.physics.add.sprite(100, 500,'player')
    this.player.setBodySize(50,100)
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, this.ground)
    const framesNames = this.textures.get('player').getFrameNames();
    console.log(framesNames)
    this.cursor = this.input.keyboard.createCursorKeys()
    this.box = this.add.rectangle(400, 550, 100, 100, 0xffffff);
    this.physics.add.existing(this.box, true)
    this.physics.add.collider(this.player, this.box)
    this.hpText = this.add.text(this.box.x, this.box.y - 90, `HP: ${this.boxHP}`)
			.setOrigin(0.5)
    this.swordHitbox = this.add.rectangle(50, 50, 50, 50, '0xffffff')
		this.physics.add.existing(this.swordHitbox)
		this.swordHitbox.body.enable = false
		this.physics.world.remove(this.swordHitbox.body)
		console.log(this.swordHitbox.body)
    this.anims.create({
      key:'run',
      frames:this.player.anims.generateFrameNames('player', {
        start:1,
        end:8,
        prefix:'run_',
        suffix:'.png'
      }),
      frameRate:15,
    })
    this.anims.create({
      key:'jump',
      frames:this.player.anims.generateFrameNames('player', {
        start:1,
        end:20,
        prefix:'jump_',
        suffix:'.png',

      }),
      frameRate:10,

    })
    this.anims.create({
      key:'jumpup',
      frames:this.player.anims.generateFrameNames('player', {
        start:1,
        end:3,
        prefix:'jumpup_',
        suffix:'.png'
      }),
      frameRate:10,
      repeat:-1
    })
      
    this.anims.create({
      key:'idle',
      frames:this.player.anims.generateFrameNames('player', {
        start:2,
        end:8,
        prefix:'idle_',
        suffix:'.png'
      }),
      frameRate:10,
      repeat:-1,

    })
    this.anims.create({
      key:'jumpd',
      frames:this.player.anims.generateFrameNames('player', {
        start:1,
        end:3,
        prefix:'jumpd_',
        suffix:'.png'
      }),
      frameRate:10,
      repeat:-1
    })
    this.anims.create({
      key:'attack',
      frames:this.player.anims.generateFrameNames('player', {
        start:1,
        end:11,
        prefix:'1_atk_',
        suffix:'.png'
      }),
      frameRate:20,
      repeat:0
    })
    console.log(this.player)
    // this.scene.start("MainScene");

  }

  update(){
    if (checkOverlap(this.ballBlue, this.goal)) {
      console.log('overlapping');
  }
    this.swordHitbox.x=this.player.x + this.player.width 
    this.swordHitbox.y=this.player.y
   
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
      }  
      

  }
    
  
  //* Можно прыгать в воздухе
//   if(this.cursor.up.isDown && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

//     this.player.setVelocityY(-300);

//     this.anims.play('jumpup', this.player);

// }

// }

}

