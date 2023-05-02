import Phaser, { Cameras } from "phaser";
import { useState } from "react";
import Enemy from "./Enemy";
import GameOver from "./GameOver";
import Scene from "phaser";

export default class MainScene extends Phaser.Scene {
  state = {
    boxHP: 100,
    playerHP: 100,
  };

  constructor(scene) {
    super("MainScene");
    this.player = null;
    this.box = null;
    this.swordHitbox = null;
    this.speed = 100; // скорость движения бота
  }
  preload() {
    this.load.image("sky", "/images/bluesky.jpeg");
    this.load.image("ground", "/images/ground.png");
    this.load.atlas(
      "player",
      "/player/knight_texture.png",
      "/player/knight_texture.json",
      { frameWidth: 300, frameHeight: 100 }
    );
    this.load.atlas(
      "enemyBot",
      "/enemyBot/skeleton_sheet.png",
      "/enemyBot/skeleton_atlas.json",
      { frameWidth: 300, frameHeight: 100 }
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
      loop: false,
      callback: this.addEnemy,
      callbackScope: this, // контекст функции
    });

    this.add.image("961", "320", "sky");

    this.ground = this.physics.add.staticGroup();

    this.ground.create("961", "620", "ground");
    this.ground.create("300", "620", "ground");
    this.ground.create("1500", "620", "ground");

    this.player = this.physics.add.sprite(100, 400, "player", "idle_1.png");
    this.player.setScale(2);
    this.player.setBodySize(50, 50, 0.5, 0.5);
    this.player.body.setOffset(120, 79);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.box = this.add.rectangle(400, 550, 100, 100, 0xffffff);
    this.physics.add.existing(this.box, true);
    this.physics.add.collider(this.player, this.box);
    this.hpText = this.add
      .text(this.box.x, this.box.y - 90, `HP: ${this.state.boxHP}`)
      .setOrigin(0.5)
      .setVisible(true);

    this.swordHitbox = this.add.rectangle(130, 130, 100, 150, "0xfqqfff", 0);
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.remove(this.swordHitbox.body);
    console.log(this.swordHitbox.body);

    console.log(this.swordHitbox.body);

    this.physics.add.collider(this.swordHitbox, this.box);
    this.physics.add.overlap(
      this.swordHitbox,
      this.box,
      this.overlapping,
      null,
      this
    );

    this.physics.add.collider(this.enemies, this.ground);
    // this.enemies = this.physics.add.sprite(800, 580, "enemyBot");
    // this.enemies = this.physics.add.staticGroup();

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
    }
    if (this.hpText.text <= 0) {
      this.box.destroy();
      this.hpText.setVisible(false);
      this.time.delayedCall(1000, () => {
        this.scene.start("GameOver");
      });
    }
  }
  update(time, delta) {
    this.hpText.text = `${this.state.boxHP}`;
    this.criticalHP();
    this.swordHitbox.x = this.player.x + 80;
    this.swordHitbox.y = this.player.y + 60;

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
      this.swordHitbox.body.enable = true;
      this.physics.world.add(this.swordHitbox.body);
      setTimeout(() => {
        this.swordHitbox.body.enable = false;
        this.physics.world.remove(this.swordHitbox.body);
      }, 20);
    }

    //* Можно прыгать в воздухе
    //   if(this.cursor.up.isDown && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {

    //     this.player.setVelocityY(-300);

    //     this.anims.play('jumpup', this.player);

    // }
  }
}
