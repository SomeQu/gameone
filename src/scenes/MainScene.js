import Phaser from 'phaser'
import config from '../configs';

let abc=false;
class Laser extends Phaser.Physics.Arcade.Sprite
{

	constructor(scene, x, y) {
		super(scene, x, y, 'laser');
    
	}
	fire(x, y) {
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);
    if(!abc){
      this.setVelocityX(1200);

    }else{
      this.setVelocityX(-1200);

    }
    this.body.allowGravity=false
    console.log(abc)
	}

  preUpdate(time, delta) {
		super.preUpdate(time, delta);
 
		if (this.x >= 1920) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}

class LaserGroup extends Phaser.Physics.Arcade.Group
{
  
	constructor(scene) {
		super(scene.physics.world, scene);

    this.createMultiple({
			frameQuantity: 30,
			key:'laser02',
			active: false,
			visible: false,
			classType: Laser,
		});
 
	}
	fireBullet(x, y) {
		const laser = this.getFirstDead(false);

		if(laser) {
			laser.fire(x, y);
		}
	}

}

export default class MainScene extends Phaser.Scene 
{
  state={
    boxHP:100,
  }
  constructor() {
    super( "MainScene")
    this.player=null
    this.player2=null
    this.box=null
    this.swordHitbox=null
  }
  preload(){
    this.load.atlas('laser', '/player2/shoot.png','/player2/shoot_atlas.json')
    this.load.image('sky', '/images/bluesky.jpeg')
    this.load.image('ground', '/images/ground.png')
    this.load.atlas('player', 
    '/player/knight_texture.png',
    '/player/knight_texture.json', 
    {frameWidth:300, frameHeight:100 });
    this.load.atlas('player2', 
    '/player2/ranger.png',
     '/player2/ranger_atlas.json',
     {frameWidth:300, frameHeight:100 })
    
  }
  
  create() {
    this.laserGroup = new LaserGroup(this,config);
    this.laserGroup.setDepth(1);
    // this.laserGroup.angle(90)
    this.add.image('961','320','sky');
    this.ground = this.physics.add.staticGroup()
    this.ground.create('961', '620', 'ground')
    this.ground.create('300', '620', 'ground')
    this.ground.create('1500', '620', 'ground')

    //*  мечник
    this.player=this.physics.add.sprite(100, 500,'player', 'idle_1.png')
    this.player.setScale(2);
    this.player.setBodySize(50, 50, 0.5, 0.5);
    this.player.body.setOffset(120, 79);    
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, this.ground)
   
    //* лучница
    this.player2=this.physics.add.sprite(200,400, 'player2', 'idle_0.aseprite' )
    this.player2.setScale(2);
    this.player2.setBodySize(50, 50, 0.5, 0.5);
    this.player2.body.setOffset(120, 79);    
    this.player2.setCollideWorldBounds(true)
    this.physics.add.collider(this.player2, this.ground)

    this.cursor = this.input.keyboard.createCursorKeys()


    this.box = this.add.rectangle(400, 550, 100, 100, 0xffffff);
    this.physics.add.existing(this.box, true)
    this.physics.add.collider(this.player, this.box)
    this.hpText = this.add.text(this.box.x, this.box.y - 90, `HP: ${Math.floor(this.state.boxHP)}`)
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

    this.physics.add.overlap(
      this.laserGroup,
      this.box,
      this.bulletOverlapping,
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

    this.anims.create({
      key: "run2",
      frames: this.player2.anims.generateFrameNames("player2", {
        start: 1,
        end: 11,
        prefix: "#run_",
        suffix: ".aseprite",
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: "idle2",
      frames: this.player2.anims.generateFrameNames("player2", {
        start: 0,
        end: 11,
        prefix: "#idle_",
        suffix: ".aseprite",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "jump2",
      frames: this.player2.anims.generateFrameNames("player2", {
        start: 0,
        end: 21,
        prefix: "#jump_",
        suffix: ".aseprite",
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "attack2",
      frames: this.player2.anims.generateFrameNames("player2", {
        start: 0,
        end: 14,
        prefix: "#2_atk_",
        suffix: ".aseprite",
      }),
      frameRate: 50,
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
  bulletOverlapping(){
    this.state.boxHP += -0.5


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

  fireBullet() {
    if(!abc){

      this.laserGroup.fireBullet(this.player2.x+80, this.player2.y+60);
    }else{
      this.laserGroup.fireBullet(this.player2.x-80, this.player2.y+60);

    }

    
	}
  update(){
	

    this.hpText.text =`${this.state.boxHP}`
    this.criticalHP()

    this.player2.setVelocityX(0)
     this.player.setVelocityX(0)
    if(this.cursor.left.isDown){
      this.player.setVelocityX(-150)
      this.player2.setVelocityX(-150)
      if(this.player.body.velocity.y ===0 || this.player2.body.velocity.y){

        this.player.play('run',true).chain('idle')
        this.player.flipX=true

        this.player2.play('run2',true).chain('idle2')
        this.player2.flipX=true

      }

    }else if(this.cursor.right.isDown){
      this.player.setVelocityX(150)
      this.player2.setVelocityX(150)
      if(this.player.body.velocity.y ===0 || this.player2.body.velocity.y ===0){

        this.player.play('run',true).chain('idle')
        this.player.flipX=false

        this.player2.play('run2',true).chain('idle2')
        this.player2.flipX=false
      }
    }else if(this.cursor.up.isDown && this.player.body.onFloor() || this.cursor.up.isDown && this.player2.body.onFloor() ){
      this.player.setVelocityY(-250) 
      this.player.play('jump').chain('idle')

      this.player2.setVelocityY(-250) 
    
      this.player2.play('jump2').chain('idle2')
       

    
      // this.player.play('jumpup', true)

    }else if(Phaser.Input.Keyboard.JustDown(this.cursor.space)){
      if(!this.player.flipX){
        abc=false
        this.swordHitbox.x = this.player.x + 80;
        this.swordHitbox.y = this.player.y + 60;
      }else{
        abc=true
        this.swordHitbox.x = this.player.x - 80;
        this.swordHitbox.y = this.player.y +60;
      }
        this.player.play('attack',false).chain('idle')
        this.player2.play('attack2').chain('idle2')
        this.swordHitbox.body.enable = true
			this.physics.world.add(this.swordHitbox.body)
      setTimeout(() => {
        this.swordHitbox.body.enable = false
        this.physics.world.remove(this.swordHitbox.body)
      }, 20);
      this.fireBullet();
      }
  }
    
  
  //* Можно прыгать в воздухе
//   if(this.cursor.up.isDown && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

//     this.player.setVelocityY(-300);

//     this.anims.play('jumpup', this.player);

// }

// }

}

