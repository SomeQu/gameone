import Phaser from "phaser";
import Enemy from "./Enemy";
import GameOver from "./GameOver";

let abc = false;
class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "laser");
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);
    if (!abc) {
      this.setVelocityX(900);
    } else {
      this.setVelocityX(-900);
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

    this.lassor = this.createMultiple({
      frameQuantity: 30,
      key: "laser",
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
    boxHP: 100,
  };
  constructor() {
    super("MainScene");
    this.player = null;
    this.player2 = null;
    this.box = null;
    this.swordHitbox = null;
    this.portal = null;
    this.shop = null;
    this.ekey = null;
  }
  preload() {
    this.load.image("sky", "/background/sky.png");
    this.load.image("ground", "/background/ground.png");
    this.load.image("sky1", "/background/sky1.png");
    this.load.image("under", "/background/under.png");
    this.load.image("sky2", "/background/sky1.png");

    this.load.image("laser", "/player2/shoot.png");

    this.load.atlas(
      "player",
      "/player/knight_texture.png",
      "/player/knight_texture.json",
      { frameWidth: 300, frameHeight: 100 }
    );
    this.load.atlas(
      "player2",
      "/player2/ranger.png",
      "/player2/ranger_atlas.json",
      { frameWidth: 300, frameHeight: 100 }
    );
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

  create() {
    // группа для ботов
    this.enemies = this.add.group({
      classType: Enemy,
      runChildUpdate: true,
      enemy: Enemy,
    });

    // событие, которое будет выполняться каждые 3 секунды типа сетинтервал
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.addEnemy,
      callbackScope: this, // контекст функции
    });
    this.physics.add.collider(this.enemies, this.ground);

    this.laserGroup = new LaserGroup(this);
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

    //*  мечник
    this.player = this.physics.add.sprite(100, 720, "player");
    this.player.setScale(2);
    this.player.setBodySize(50, 50, 0.5, 0.5);
    this.player.body.setOffset(120, 79);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);
    const framesNames = this.textures.get("player").getFrameNames();
    console.log(framesNames);
    // камера
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -200, 200);

    //* лучница
    this.player2 = this.physics.add.sprite(
      200,
      400,
      "player2",
      "idle_0.aseprite"
    );
    this.player2.setScale(2);
    this.player2.setBodySize(50, 50, 0.5, 0.5);
    this.player2.body.setOffset(120, 79);
    this.player2.setCollideWorldBounds(true);
    this.physics.add.collider(this.player2, this.ground);

    this.cursor = this.input.keyboard.createCursorKeys();
    this.cursor = this.input.keyboard.createCursorKeys();
    this.box = this.add.rectangle(400, 550, 100, 100, 0xffffff);

    this.physics.add.existing(this.box, true);
    this.physics.add.collider(this.player, this.box);
    this.hpText = this.add
      .text(this.box.x, this.box.y - 90, `HP: ${Math.floor(this.state.boxHP)}`)
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
    this.swordHitbox = this.add.rectangle(130, 130, 100, 150, "0xfqqfff");
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.remove(this.swordHitbox.body);
    console.log(this.swordHitbox.body);

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
    console.log(this.player);

    // this.scene.start("MainScene");
    // какого-то хуя не работают анимации ругаетя на generateframesname

    //   this.anims.create({
    //     key: "atk",
    //     frames: this.enemies.anims.generateFrameNames("enemyBot", {
    //       start: 0,
    //       end: 17,
    //       prefix: "atk_",
    //       suffix: ".ase",
    //     }),
    //     frameRate: 10,
    //     repeat: -1,
    //   });
    //   this.anims.create({
    //     key: "dead",
    //     frames: this.enemies.anims.generateFrameNames("enemyBot", {
    //       start: 18,
    //       end: 33,
    //       prefix: "dead_",
    //       suffix: ".ase",
    //     }),
    //     frameRate: 20,
    //     repeat: 0,
    //   });
    //   this.anims.create({
    //     key: "hit",
    //     frames: this.enemies.anims.generateFrameNames("enemyBot", {
    //       start: 34,
    //       end: 42,
    //       prefix: "hit_",
    //       suffix: ".ase",
    //     }),
    //     frameRate: 20,
    //     repeat: 0,
    //   });
    //   this.anims.create({
    //     key: "walk",
    //     frames: this.enemies.anims.generateFrameNames("enemyBot", {
    //       start: 43,
    //       end: 56,
    //       prefix: "walk_",
    //       suffix: ".ase",
    //     }),
    //     frameRate: 15,
    //   });
  }

  addEnemy() {
    // создаем нового бота
    const enemy = new Enemy(
      this,
      (this.enemy = this.physics.add.sprite(
        Phaser.Math.Between(100, 800),
        Phaser.Math.Between(100, 900),
        "enemyBot"
      )),
      this.physics.add.collider(this.enemy, this.ground),
      this.enemy.setBodySize(40, 50),
      this.enemy.setCollideWorldBounds(true),
      this.physics.add.existing(this.enemy, true)
    );
    if (this.player) {
      // вычисляем расстояние до цели
      const distance = Phaser.Math.Distance.Between(
        this.enemy.x,
        this.player.x,
        this.enemy.y,
        this.player.y
      );

      // если расстояние меньше, чем допустимый порог, останавливаем бота
      if (distance < 10) {
        this.enemy.setVelocity(0, 0);
        this.enemy.play("atk", true);
      }

      // вычисляем вектор направления движения к цели
      const angle = Phaser.Math.Angle.Between(
        this.enemy.x,
        this.enemy.y,
        this.player.x,
        this.player.y,
        this.enemy.play("walk", true)
      );
      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;

      // устанавливаем скорость движения бота
      this.enemy.setVelocity(vx, vy);
    }

    // добавляем бота в группу
    this.enemies.add(enemy);
  }

  overlapping(box, swordHitbox) {
    console.log("hi there");
    this.state.boxHP += -10;
    console.log(this.state.boxHP);
  }
  criticalHP() {
    if (this.hpText.text <= 30) {
      this.box.fillColor = 0xff0000;

      if (this.hpText.text <= 0) {
        this.hpText.setVisible(false);
        this.time.delayedCall(1000, () => {
          // this.scene.start("GameOver");
        });
      }
    }
  }

  bulletOverlapping() {
    this.state.boxHP += -0.5;
  }

  fireBullet() {
    if (!abc) {
      this.laserGroup.fireBullet(this.player2.x + 80, this.player2.y + 60);
    } else {
      this.laserGroup.fireBullet(this.player2.x - 80, this.player2.y + 60);
    }
  }

  update(time, delta) {
    this.hpText.text = `${this.state.boxHP}`;
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

    this.player2.setVelocityX(0);
    this.player.setVelocityX(0);
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-150);
      this.player2.setVelocityX(-150);
      if (this.player.body.velocity.y === 0 || this.player2.body.velocity.y) {
        this.player.play("run", true).chain("idle");
        this.player.flipX = true;

        this.player2.play("run2", true).chain("idle2");
        this.player2.flipX = true;
      }
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(150);
      this.player2.setVelocityX(150);
      if (
        this.player.body.velocity.y === 0 ||
        this.player2.body.velocity.y === 0
      ) {
        this.player.play("run", true).chain("idle");
        this.player.flipX = false;

        this.player2.play("run2", true).chain("idle2");
        this.player2.flipX = false;
      }
    } else if (
      (this.cursor.up.isDown && this.player.body.onFloor()) ||
      (this.cursor.up.isDown && this.player2.body.onFloor())
    ) {
      this.player.setVelocityY(-250);
      this.player.play("jump").chain("idle");

      this.player2.setVelocityY(-250);

      this.player2.play("jump2").chain("idle2");

      this.player.play("jump").chain("idle");
    } else if (Phaser.Input.Keyboard.JustDown(this.cursor.space)) {
      if (!this.player.flipX) {
        abc = false;
        this.swordHitbox.x = this.player.x + 80;
        this.swordHitbox.y = this.player.y + 60;
      } else {
        abc = true;
        this.swordHitbox.x = this.player.x - 80;
        this.swordHitbox.y = this.player.y + 60;
      }
      this.player.play("attack", false).chain("idle");
      this.player2.play("attack2").chain("idle2");
      this.swordHitbox.body.enable = true;
      this.physics.world.add(this.swordHitbox.body);
      setTimeout(() => {
        this.swordHitbox.body.enable = false;
        this.physics.world.remove(this.swordHitbox.body);
      }, 20);
      this.fireBullet();
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
          window.location.href = "http://localhost:3000/game";
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
