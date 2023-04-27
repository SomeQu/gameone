import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    const player = (this.player = null);
    this.AGRESSOR_RADIUS = 100;
    this.speed = 100;
  }

  setTarget(player) {
    this.player = player;
  }

  preload() {
    this.load.image("sky", "/images/bluesky.jpeg");
    this.load.image("ground", "/images/ground.png");
    this.load.atlas(
      "player",
      "/player/knight_texture.png",
      "/player/knight_texture.json",
      { frameWidth: 500, frameHeight: 300 }
    );
    this.load.spritesheet("enemy", "/enemy/_Crouch.png", {
      frameWidth: 300,
      frameHeight: 300,
    });
  }
  create() {
    this.add.image("961", "320", "sky");
    this.ground = this.physics.add.staticGroup();
    this.ground.create("961", "620", "ground");
    this.ground.create("300", "620", "ground");
    this.ground.create("1500", "620", "ground");
    this.player = this.physics.add.sprite(100, 500, "player");
    this.player.setBodySize(40, 130);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);
    this.swordHitbox = this.add.rectangle(100, 100, 50, 50, 0xffffff, 0);
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.add(this.swordHitbox.body);
    this.physics.world.remove(this.swordHitbox.body);

    console.log(this.swordHitbox.body);

    // bot adding
    this.bot = this.physics.add.staticGroup();
    this.bot.create("800", "550", "enemy");

    for (let i = 0; i < 3; i++) {
      this.bot = this.physics.add.sprite(800, 550, "enemy");
      this.physics.add.collider(this.bot, this.ground);
      this.bot.setBodySize(40, 110);
      this.bot.setCollideWorldBounds(true);
      this.physics.add.existing(this.bot, true);
    }

    this.cursor = this.input.keyboard.createCursorKeys();

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
    console.log(this.player);
  }

  update() {
    this.swordHitbox.x = this.player.x + 50;
    this.swordHitbox.y = this.player.y;

    this.player.setVelocityX(0);
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-150);
      if (this.player.body.velocity.y === 0) {
        this.player.play("run", true).chain("idle");
      }
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(150);
      if (this.player.body.velocity.y === 0) {
        this.player.play("run", true).chain("idle");
      }
    } else if (this.cursor.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-250);

      this.player.play("jump").chain("idle");

      // this.player.play('jumpup', true)
    } else if (this.cursor.space.isDown) {
      this.player.play("attack", false).chain("idle");
    }

    if (this.player) {
      // вычисляем расстояние до цели
      const distance = Phaser.Math.Distance.Between(
        this.bot.x,
        this.bot.y,
        this.player.x,
        this.player.y
      );

      // если расстояние меньше, чем допустимый порог, останавливаем бота
      if (distance < 10) {
        this.bot.setVelocity(0, 0);
        return;
      }

      // вычисляем вектор направления движения к цели
      const angle = Phaser.Math.Angle.Between(
        this.bot.x,
        this.bot.y,
        this.player.x,
        this.player.y
      );
      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;

      // устанавливаем скорость движения бота
      this.bot.setVelocity(vx, vy);
    }
  }
}
