import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.player = null;
    this.box = null;
    this.boxHP = 100;
    this.portal = null;
    this.shop = null;
    this.ekey = null;
  }
  state = {
    boxHP: 100,
  };
  preload() {
    this.load.image("sky", "/background/sky.png");
    this.load.image("ground", "/background/ground.png");
    this.load.image("sky1", "/background/sky1.png");
    this.load.image("under", "/background/under.png");
    this.load.image("sky2", "/background/sky1.png");

    this.load.atlas(
      "player",
      "/player/knight_texture.png",
      "/player/knight_texture.json",
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

    // Player
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
      frameRate: 15,
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
      frameRate: 15,
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

    // ENEMY
    this.cursor = this.input.keyboard.createCursorKeys();
    this.box = this.add.rectangle(400, 550, 100, 80, 0xffffff);
    this.physics.add.existing(this.box, true);
    this.physics.add.collider(this.player, this.box);
    this.hpText = this.add
      .text(this.box.x, this.box.y - 90, `HP: ${this.boxHP}`)
      .setOrigin(0.5);

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
  }

  overlapping() {
    console.log("hi there");
    this.state.boxHP += -10;
    console.log(this.state.boxHP);
  }
  criticalHP() {
    if (this.hpText.text <= 30) {
      this.box.fillColor = 0xff0000;
    }
    if (this.hpText.text <= 0) {
      this.box.destroy();
      this.hpText.setVisible(false);
    }
  }

  update() {
    this.hpText.text = `${this.state.boxHP}`;
    this.criticalHP();
    this.swordHitbox.x = this.player.x + 80;
    this.swordHitbox.y = this.player.y + 60;

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
        this.player.play("run", true).chain("idle");
      }
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(150);
      if (this.player.body.velocity.y === 0) {
        this.player.play("run", true).chain("idle");
      }
    } else if (this.cursor.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-300);

      this.player.play("jump").chain("idle");
    } else if (this.cursor.space.isDown) {
      this.player.play("attack", false).chain("idle");
      this.swordHitbox.body.enable = true;
      this.physics.world.add(this.swordHitbox.body);
      setTimeout(() => {
        this.swordHitbox.body.enable = false;
        this.physics.world.remove(this.swordHitbox.body);
      }, 20);
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
}
