import Phaser from "phaser";

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
      frameQuantity: 30,
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

  fireBullet(x, y) {
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.fire(x, y);
    }
  }
}

export default class SceneWithBoss extends Phaser.Scene {
  state = {
    boxHP: 100,
  };
  constructor() {
    super("SceneWithBoss");
    this.player = null;
    this.player2 = null;
    this.swordHitbox = null;
    this.portal = null;

    this.ekey = null;
  }

  preload() {
    this.load.image("skyL0", "/background2/skyL2.png");
    this.load.image("ground1", "/background2/layerback.png");
    this.load.image("skyL1", "/background2/skyL3.png");
    this.load.image("skyL2", "/background2/skyL3.png");
    this.load.image("plat", "/background2/plat.png");
    this.load.atlas("laser", "/player2/shoot.png", "/player2/shoot_atlas.json");

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
  }

  generateEnemy() {
    const xCoordinate = Math.random() * 1200;
    this.enemies.create(xCoordinate, 750, "enemyBot");
  }

  EnemyCollide(swordHitbox, enemy) {
    enemy.destroy();
  }
  EnemyAndPlayerCollide() {
    setTimeout(() => {
      console.log("hello there");
      this.state.playerHP -= 0.02;
      console.log(this.state.playerHP);
    }, 1000);
  }
  playerDestroy() {
    if (this.state.playerHP <= 0) {
      this.player.visible = false;
      this.time.delayedCall(1000, () => {
        this.scene.start("GameOver");
      });
    }
  }

  create() {
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
    this.add.image("961", "390", "skyL0");
    this.add.image("-958", "390", "skyL1");
    this.add.image("2880", "390", "skyL2");
    this.ground = this.physics.add.staticGroup();
    this.ground.create("2500", "880", "ground1");
    this.ground.create("961", "880", "ground1");
    this.ground.create("-900", "880", "ground1");
    this.ground.create("900", "830", "plat");
    this.ground.create("1100", "780", "plat");
    this.ground.create("1400", "830", "plat");

    this.ground.children.entries[0].setSize(1920, 15);
    this.ground.children.entries[1].setSize(1920, 15);
    this.ground.children.entries[2].setSize(1920, 15);
    this.ground.children.entries[3].setSize(220, 10);
    this.ground.children.entries[4].setSize(220, 10);
    this.ground.children.entries[5].setSize(220, 10);

    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.enemies, this.ground);

    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.generateEnemy,
      callbackScope: this, // контекст функции
    });

    //*  мечник
    this.player = this.physics.add.sprite(100, 720, "player");
    this.player.setScale(2);
    this.player.setBodySize(50, 50, 0.5, 0.5);
    this.player.body.setOffset(120, 79);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);
    const framesNames = this.textures.get("player").getFrameNames();
    console.log(framesNames);
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.EnemyAndPlayerCollide,
      null,
      this
    );
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
    this.box.alpha = 0;
    this.physics.add.existing(this.box, true);
    this.physics.add.collider(this.player, this.box);
    this.hpText = this.add
      .text(this.box.x, this.box.y - 90, `HP: ${Math.floor(this.state.boxHP)}`)
      .setOrigin(0.5)
      .setVisible(true);

    this.playerText = this.add
      .text(
        this.player.x,
        this.player.y - 90,
        `HP: ${Math.floor(this.state.playerHP)}`
      )
      .setOrigin(0.5)
      .setVisible(true);

    this.hpText.alpha = 0;
    // Sword Hitbox
    this.swordHitbox = this.add.rectangle(130, 130, 100, 150, "#000000");
    this.swordHitbox.alpha = 0;
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.remove(this.swordHitbox.body);
    console.log(this.swordHitbox.body);

    this.physics.add.overlap(
      this.laserGroup,
      // this.box,
      this.bulletOverlapping,
      null,
      this
    );
    this.physics.add.overlap(
      this.enemies,
      this.swordHitbox,
      this.EnemyCollide,
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
      frameRate: 15,
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
      frameRate: 15,
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

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNames("enemyBot", {
        start: 0,
        end: 13,
        prefix: "walk_",
        suffix: ".ase",
      }),
      frameRate: 15,
      repeat: -1,
    });
  }

  fireBullet() {
    if (!abc) {
      this.laserGroup.fireBullet(this.player2.x + 80, this.player2.y + 60);
    } else {
      this.laserGroup.fireBullet(this.player2.x - 80, this.player2.y + 60);
    }
  }

  update(time, delta) {
    // this.hpText.text = `${this.state.boxHP}`;
    this.playerText.text = Math.ceil(this.state.playerHP);

    // this.criticalHP();
    this.playerDestroy();
    this.playerText.x = this.player.x;
    this.playerText.y = this.player.y;
    this.enemies.playAnimation("walk", "walk_0.ase");
    Phaser.Actions.Call(
      this.enemies.getChildren(),
      function (enemy) {
        if (enemy.body.onFloor()) {
          this.physics.moveToObject(enemy, this.player, 100);
        }
      },
      this
    );

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
  }

  //* Можно прыгать в воздухе
  //   if(this.cursor.up.isDown && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

  //     this.player.setVelocityY(-300);

  //     this.anims.play('jumpup', this.player);

  // }
}
