import Phaser from "phaser";
import config from "../configs";

let abc = false;
class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "laser");
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);
    this.setScale(0.5)
    if (!abc) {
      this.setVelocityX(1200);
    } else {
      this.setVelocityX(-1200);
    }
    this.body.allowGravity = false;
    console.log(abc);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.x >= 1920) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100 ,
      key: "laser02",
      active: false,
      visible: false,
      classType: Laser,
    });
  }
  fireBullet(x, y) {
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.fire(x, y);
    }
  }

}

export default class MainScene extends Phaser.Scene {
  state = {
    playerHP: null,
    coinCounter:0,
    killCount:0,
    isSwordsman:true,
    demonHP:100
  };
  constructor() {
    super("MainScene");
    this.player = null;
    this.swordHitbox = null;
    this.portal = null;
    this.shop = null;
    this.ekey = null;
    this.demonSword=null
  }

  preload() {
    this.load.image("sky", "/background/sky.png");
    this.load.image("ground", "/background/ground.png");
    this.load.image("sky1", "/background/sky1.png");
    this.load.image("under", "/background/under.png");
    this.load.image("sky2", "/background/sky1.png");
    
    
   




    this.load.atlas("laser",
     "/player2/shoot.png",
      "/player2/shoot_atlas.json", 
       {frameWidth:100, frameHeight:100});

    this.load.atlas('coin', 
    '/consumables/coin/coin_sheet.png',
    '/consumables/coin/coin_atlas.json', 
    {frameWidth:100, frameHeight:100})
    this.load.atlas("demon",
    '/entities/demon.png',
    '/entities/demon_atlas.json',
    {frameWidth:100, frameHeight:100})


    this.load.audio('swordSwing', ['/sound/mixkit-fantasy-sword-slide-2798.wav']);
    this.load.audio('death', ['/sound/death.mp3'])
    this.load.audio('mainAudio', ['/sound/undertale_005. Ruins.mp3'])
    this.load.audio('skeletonWalk', ['/sound/big-skeleton-walk-05.mp3'])
    this.load.audio('jumping', ['/sound/salto-madera-46546.mp3'])
    this.load.audio('coinCollected', ['/sound/mixkit-coin-win-notification-1992.wav'])
    this.load.audio('skeletonDeath', ['sound/Skeleton Hit Shatter - QuickSounds.com.mp3'])
    this.load.audio('whoosh', ['/sound/whoosh-transitions-sfx-01-118227.mp3'])
    if(this.state.isSwordsman===true){
      this.load.atlas(
        "player",
        "/player/knight_texture.png",
        "/player/knight_texture.json",
        { frameWidth: 300, frameHeight: 100 }
      );

    }else{
      this.load.atlas(
        "player",
        "/player2/ranger.png",
        "/player2/ranger_atlas.json",
        { frameWidth: 300, frameHeight: 100 }
      );
    }
    this.load.atlas(
      "enemyBot",
      "/enemyBot/skeleton_sheet.png",
      "/enemyBot/skeleton_atlas.json",
      { frameWidth: 300, frameHeight: 100 }
    );
    this.load.atlas("shop", "/player/shopmasta.png", "/player/shopmasta.json");
    this.load.atlas(
      "portal",
      "/player/portal.png",
      "/player/portal_atlas.json"
    );
  }
  generateEnemy () {
    const xCoordinate = Math.random() * 1200;
    if(this.state.killCount===5){
     return
    }else{

      this.enemies.create(xCoordinate, 750, 'enemyBot');  
      if(this.state.killCount===2){
        this.demon.x=800;
        this.demon.y=0
      }
    }

  }
  generateCoin(enemylocation){
    this.coins.create(enemylocation,750, 'coin')
  }
  CollectCoin(player, coin){
    coin.destroy()
    console.log('coin')
    this.coinCollected.play()
    this.state.coinCounter +=1
  }
  EnemyCollide(swordHitbox, enemy){
    enemy.destroy()
    this.coins.create(enemy.x,750, 'coin')
    this.skeletonDeath.play()
    this.state.killCount +=1
    this.killText.text=`Enemies Slayed: ${this.state.killCount}`  }
  EnemyAndPlayerCollide(player, enemy){
    setTimeout(() => {
      console.log('hello there')
      this.state.playerHP-= 0.02
      console.log(this.state.playerHP)
    }, 1000);
  }
  playerDestroy(){
    if(this.state.playerHP<=0){
      this.player.visible =false
      this.deathSound.play()
    }
  }
  laserOverlap(laser,enemy){
    laser.destroy();
    enemy.destroy();
    this.skeletonDeath.play()
    this.coins.create(enemy.x,750, 'coin')
    this.state.killCount +=1
    this.killText.text=`Enemies Slayed: ${this.state.killCount}`  
  }
  demonswordCollide(){
    console.log('demon hit')
    this.state.playerHP -= 0.05
  }
  demonAndLaserOverlap(demon,laser){
    laser.destroy()
    this.state.demonHP-=2
  }
  demonAndSwordOverlap(demon,sword){
    this.state.demonHP-=2
  }
  create() {
    if(this.state.isSwordsman===true){
      this.state.playerHP=10
    }else if(this.state.isSwordsman===false){
      this.state.playerHP=5
    }
    this.whoosh=this.sound.add('whoosh', {loop:false})
    this.swing = this.sound.add('swordSwing', {loop:false})
    this.deathSound = this.sound.add('death', {loop:false})
    this.mainAudio=this.sound.add('mainAudio', {loop:false})
    this.skeletonWalk = this.sound.add('skeletonWalk', {loop:false, volume:0.1})
    this.jumping = this.sound.add('jumping', {loop:false})
    this.coinCollected=this.sound.add('coinCollected', {loop:false})
    this.skeletonDeath=this.sound.add('skeletonDeath',{loop:false})
    this.mainAudio.play()

      this.laserGroup = new LaserGroup(this);
      this.laserGroup.setDepth(1);
    // this.laserGroup.angle(90)
    // Настройка свойств камеры и создание
    this.cameras.main.fadeIn(5000);
    const camera = this.cameras.add(3840, 1080);
    camera.setBackgroundColor("#000000");
    camera.setZoom();
    camera.setBounds(0, 0, 0, 0);
    
    // Окружение земля, небо
    this.add.image("961", "320", "sky");
    this.add.image("-958", "320", "sky1");
    this.add.image("2880", "320", "sky2");
    this.ground = this.physics.add.staticGroup();
    
    this.ground.create("2970", "880", "ground");
    this.ground.create("961", "880", "ground");
    this.ground.create("-1020", "880", "ground");
    
    this.ground.children.entries[0].setSize(1920, 30);
    this.ground.children.entries[1].setSize(1920, 30);
    this.ground.children.entries[2].setSize(1920, 30);
    
    this.enemies = this.physics.add.group(); 
    this.coins = this.physics.add.group()
    this.enemies.children.iterate((child) => {
      child.setScale(5, 5);
    });
    this.physics.add.collider(this.enemies ,this.ground)
    this.physics.add.collider(this.coins,this.ground)
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.generateEnemy,
      callbackScope: this, // контекст функции
    });
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.demonLogic,
      callbackScope: this, // контекст функции
    });
    this.generateCoin()
    if(this.state.isSwordsman===true){
      this.player = this.physics.add.sprite(100, 720, "player");
      this.player.setScale(2);
      this.player.setBodySize(50, 50, 0.5, 0.5);
      this.player.body.setOffset(120, 79);
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, this.ground);
        const framesNames = this.textures.get("player").getFrameNames();
      console.log(framesNames);
      // камера
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -200, 200)
    }else{
      this.player = this.physics.add.sprite(
        100,
        720,
        "player",
        "idle_0.aseprite"
        );
        this.player.setScale(2);
        this.player.setBodySize(50, 50, 0.5, 0.5);
        this.player.body.setOffset(120, 79);
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, this.ground);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -200, 200)

    }
    this.physics.add.overlap(
      this.player
      ,this.enemies, 
      this.EnemyAndPlayerCollide,
      null,
      this)
      this.physics.add.overlap(
        this.laserGroup,
         this.enemies, 
         this.laserOverlap, 
         null, 
         this)

          this.demon = this.physics.add.sprite(0, 1500,'demon')
          this.physics.add.collider(this.demon, this.ground)
          this.demon.setSize(100)
          this.demon.setScale(3)

        
    this.cursor = this.input.keyboard.createCursorKeys();
    this.cursor = this.input.keyboard.createCursorKeys();


    this.coinText=this.add.text(0,0, `Collected Coins: ${this.state.coinCounter}`,{color:'black',fontSize:'24px'})
    this.killText=this.add.text(0,50, `Enemy Slayed: ${this.state.killCount}`,{color:'black',fontSize:'24px'})
    this.demonText=this.add.text(0,0, ` DEMON: ${this.state.demonHP}`,{color:'black',fontSize:'24px'})
  
    this.playerText = this.add
    .text(this.player.x, this.player.y - 90, `HP: ${Math.floor(this.state.playerHP)}`)
    .setOrigin(0.5)
    .setVisible(true);
    // SHOP
    this.shop = this.physics.add.sprite(800, 795, "shop");
    this.shop.setScale(1.5);
    this.shop.setBodySize(40, 60);
    this.physics.add.collider(this.shop, this.ground);
    this.shopText = this.add.text(650, 720, "Press `E` to enter the shop.", {
      fontSize: "20px",
      fill: "#000000",
    });
    this.shopText.setFontStyle("bold");
    
    // взаимодействие на Е
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    const framesNamesShop = this.textures.get("shop").getFrameNames();
    console.log(framesNamesShop);
    
    this.anims.create({
      key: "speak",
      frames: this.shop.anims.generateFrameNames("shop", {
        start: 0,
        end: 3,
        prefix: "#speak_",
        suffix: ".png",
      }),
      
      frameRate: 4,
      repeat: 0,
    });
    // shop and player
    this.player.setDepth(1);
    this.shop.setDepth(0);

    // PORTAL
    this.portal = this.physics.add.sprite(1800, 595, "portal");
    this.portal.setScale(4);
    this.portal.setBodySize(40, 35);
    this.physics.add.collider(this.portal, this.ground);
    
    // взаимодействие на T
    this.TKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    const framesNamesPortal = this.textures.get("portal").getFrameNames();
    console.log(framesNamesPortal);
    
    this.anims.create({
      key: "spin",
      frames: this.portal.anims.generateFrameNames("coin", {
        start: 0,
        end: 3,
        prefix: "monedaNo1_00 ",
        suffix: ".png",
      }),

      frameRate: 8,
      repeat: 0,
    });
    this.anims.create({
      key: "round",
      frames: this.portal.anims.generateFrameNames("portal", {
        start: 0,
        end: 4,
        prefix: "portalRings2_",
        suffix: ".png",
      }),

      frameRate: 8,
      repeat: 0,
    });
    this.player.setDepth(1);
    this.portal.setDepth(0);
    
    // Sword Hitbox
    this.swordHitbox = this.add.rectangle(130, 130, 100, 150, "0xfqqfff",0);
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.remove(this.swordHitbox.body);
    console.log(this.swordHitbox.body);
    
    //demon's sword hitbox
    this.demonSword = this.add.rectangle(130, 130, 100, 150, "0xfqqfff",0);
    this.physics.add.existing(this.demonSword);
    this.demonSword.body.enable = false;
    this.physics.world.remove(this.demonSword.body);

 this.physics.add.overlap(
          this.player,
          this.demonSword, 
          this.demonswordCollide,
          null, 
       this)
       this.physics.add.overlap(this.coins, 
        this.player,
        this.CollectCoin,
        null,
        this)

        this.physics.add.overlap(
          this.enemies,
          this.swordHitbox, 
          this.EnemyCollide,
          null, 
       this)
       this.physics.add.overlap(
        this.player
        ,this.enemies, 
        this.EnemyAndPlayerCollide,
        null,
        this)
        this.physics.add.overlap(
          this.laserGroup,
           this.demon, 
           this.demonAndLaserOverlap, 
           null, 
           this)
           this.physics.add.overlap(
            this.swordHitbox,
             this.demon, 
             this.demonAndSwordOverlap, 
             null, 
             this)
        

    if(this.state.isSwordsman===true){
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
  
    }else{
      this.anims.create({
        key: "run",
        frames: this.player.anims.generateFrameNames("player", {
          start: 1,
          end: 11,
          prefix: "#run_",
          suffix: ".aseprite",
        }),
        frameRate: 20,
        repeat: 0,
      });
      this.anims.create({
        key: "idle",
        frames: this.player.anims.generateFrameNames("player", {
          start: 0,
          end: 11,
          prefix: "#idle_",
          suffix: ".aseprite",
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "jump",
        frames: this.player.anims.generateFrameNames("player", {
          start: 0,
          end: 21,
          prefix: "#jump_",
          suffix: ".aseprite",
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "attack",
        frames: this.player.anims.generateFrameNames("player", {
          start: 0,
          end: 14,
          prefix: "#2_atk_",
          suffix: ".aseprite",
        }),
        frameRate: 50,
        repeat: 0,
      });
    }
   
      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNames("enemyBot", {
          start: 0,
          end: 13,
          prefix: "walk_",
          suffix: ".ase",
        }),
        frameRate: 15,
        repeat:-1
      });
      this.anims.create({
        key: "atk",
        frames: this.anims.generateFrameNames("enemyBot", {
          start: 0,
          end: 17,
          prefix: "atk_",
          suffix: ".ase",
        }),
        frameRate: 15,
        repeat:-1
      });
      this.anims.create({
        key: "shoot",
        frames: this.anims.generateFrameNames("laser", {
          start: 0,
          end: 4,
          prefix: "#shoot_",
          suffix: ".aseprite",
        }),
        frameRate: 5,
        repeat:-1
      });
      this.anims.create({
        key: "demonIdle",
        frames: this.demon.anims.generateFrameNames("demon", {
          start: 0,
          end: 5,
          prefix: "#d_idle ",
          suffix: ".aseprite",
        }),
  
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: "demonWalk",
        frames: this.demon.anims.generateFrameNames("demon", {
          start: 0,
          end: 11,
          prefix: "#d_walk ",
          suffix: ".aseprite",
        }),
  
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: "demonCleave",
        frames: this.demon.anims.generateFrameNames("demon", {
          start: 0,
          end: 14,
          prefix: "#d_cleave ",
          suffix: ".aseprite",
        }),
  
        frameRate: 15,
        repeat: 0,
      });
      
  }



  overlapping(box, swordHitbox) {
    console.log("hi there");

  }
  criticalHP() {
    
      if (this.state.playerHP <= 0 || this.state.demonHP<=0) {
        this.time.delayedCall(1000, () => {
          this.scene.start("GameOver");
          this.game.sound.stopAll();
        
        });
      }
    
  }


  fireBullet() {
    if (!abc) {
      this.laserGroup.fireBullet(this.player.x + 80, this.player.y + 60);
    } else {
      this.laserGroup.fireBullet(this.player.x - 80, this.player.y + 60);
    }

  }
  demonLogic(){

    const choosing = Math.round(Math.random()*3)
    console.log(choosing)
    if(choosing==1){
      this.demon.play('demonWalk',true)
      this.demon.setVelocityX(100)
      this.demon.flipX=true
    }else if(choosing==2){
      this.demon.play('demonWalk',true)
      this.demon.setVelocityX(-100)
      this.demon.flipX=false

    }else if(choosing===3){
      this.demon.setVelocityX(0)
      this.demon.play('demonCleave').chain('demonIdle')
      this.demonSword.body.enable = true;
      this.physics.world.add(this.demonSword.body);
      setTimeout(() => {
        this.demonSword.body.enable = false;
        this.physics.world.remove(this.demonSword.body);
      }, 500);
    }
  }
  update(time, delta) {
    
    
    
    this.playerDestroy()
    this.demonText.x = this.demon.x
    this.demonText.y=this.demon.y-200
    this.coinText.x=this.player.x
    this.killText.x=this.player.x
    if(this.state.killCount===5){
      this.killText.text = 'All Enemies are slayed'
    }
    this.demonText.text=`DEMON: ${this.state.demonHP}`
    this.coinText.text=`Collected Coins: ${this.state.coinCounter}`
    this.playerText.x= this.player.x
    this.playerText.y=this.player.y
    this.coins.playAnimation('spin', 'monedaNo1_00 0.png')
    this.laserGroup.playAnimation('shoot', '#shoot_0.aseprite')
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
      enemy.setScale(3)

      if(enemy.body.onFloor()){
        if(enemy.body.velocity.x>0){
          enemy.flipX=false
        }else if(enemy.body.velocity.x<0){
          enemy.flipX=true
        }
        this.enemies.playAnimation('walk', 'walk_0.ase')
        this.physics.moveToObject(enemy, this.player, 100);
        
      }
         
  }, this);
  
    this.playerText.text = Math.ceil(this.state.playerHP) 
    this.criticalHP();
   

    // анимации шоп
    this.shop.setVelocityX(0);
    if (this.shop.setVelocityX(0)) {
      this.shop.play("speak", true);
    }

    // анимации портала
    this.portal.setVelocityX(0);
    if (this.portal.setVelocityX(0)) {
      this.portal.play("round", true);
    }

    this.player.setVelocityX(0);
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-150);
      if (this.player.body.velocity.y === 0) {
        if(this.state.isSwordsman===true){
          this.player.play("run", true).chain("idle");
          this.player.flipX = true;
        }else{
          this.player.play("run", true).chain("idle");
          this.player.flipX = true;
        }
      }
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(150);
      if (this.player.body.velocity.y === 0){
        if(this.state.isSwordsman===true){
          this.player.play("run", true).chain("idle");
          this.player.flipX = false;
        }else{
          this.player.play("run", true).chain("idle");
          this.player.flipX = false;
        }
      }
    } else if ((this.cursor.up.isDown && this.player.body.onFloor())) {
      this.jumping.play()
      if(this.state.isSwordsman===true){
        this.player.setVelocityY(-250);
        this.player.play("jump").chain("idle");
      }else{

        this.player.setVelocityY(-250);
        this.player.play("jump").chain("idle");
      }
    } 
    // else if (Phaser.Input.Keyboard.JustDown(this.cursor.space)) {
    //   this.swing.play()
    //   if (!this.player.flipX) {
    //     abc = false;
    //     if(this.state.isSwordsman===true){
    //       this.swordHitbox.body.x = this.player.x + 80;
    //       this.swordHitbox.body.y = this.player.y + 60;
    //     }else{return}
    //   } else {
    //     abc = true;
    //     if(this.state.isSwordsman===true){
    //       this.swordHitbox.x = this.player.x - 80;
    //       this.swordHitbox.y = this.player.y + 60;
    //     }else{
    //       return
    //     }
    //   }
    //   if(this.state.isSwordsman===true){
    //     this.player.play("attack", false).chain("idle");
    //   this.swordHitbox.body.enable = true;
    //   this.physics.world.add(this.swordHitbox.body);
    //   setTimeout(() => {
    //     this.swordHitbox.body.enable = false;
    //     this.physics.world.remove(this.swordHitbox.body);
    //   }, 20);
    //   }else{
    //     this.player.play("attack",false).chain("idle");
    //     this.fireBullet();
    //   }
      
    // }
    if (!this.demon.flipX) {
      this.demonSword.body.x = this.demon.x - 200;
      this.demonSword.body.y = this.demon.y - 30;
     }else{
       this.demonSword.body.x = this.demon.x + 200;
       this.demonSword.body.y = this.demon.y - 30;
     }



    if (!this.player.flipX) {
         abc = false;
         this.swordHitbox.body.x = this.player.x + 80;
         this.swordHitbox.body.y = this.player.y + 60;
        }else{
          abc=true
          this.swordHitbox.body.x = this.player.x - 80;
          this.swordHitbox.body.y = this.player.y + 60;
        }

    if(Phaser.Input.Keyboard.JustDown(this.cursor.space)){
      if(this.state.isSwordsman===true){
        this.player.play("attack",false).chain("idle");
        this.swing.play()
          this.swordHitbox.body.enable = true;
          this.physics.world.add(this.swordHitbox.body);
          setTimeout(() => {
            this.swordHitbox.body.enable = false;
            this.physics.world.remove(this.swordHitbox.body);
          }, 20);
      }else{
        this.player.play("attack",false).chain("idle");
        this.whoosh.play()
        this.fireBullet()
      }
    }
    // Shop на E
    if (this.physics.overlap(this.player, this.shop)) {
      if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
        this.cameras.main.fadeOut(2000, 0, 0, 0, function () {
          window.location.href = "http://localhost:3000/shop";
        });
        if (this.shopText) {
          this.shopText.destroy();
          this.shopText = null;
        }
      }
    }

    // Портал на T
    if (this.physics.overlap(this.player, this.portal)) {
      if (Phaser.Input.Keyboard.JustDown(this.TKey)) {
        this.cameras.main.fadeOut(2000, 0, 0, 0, function () {
          this.scene.start('SceneWithBoss');
        });
      }
    }
  }

  //* Можно прыгать в воздухе
  //   if(this.cursor.up.isDown && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

  //     this.player.setVelocityY(-300);

  //     this.anims.play('jumpup', this.player);

  // }
}
