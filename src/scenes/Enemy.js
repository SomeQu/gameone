import Phaser from "phaser";

class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.speed = 100; // скорость движения бота
    this.player = null; // цель, к которой бот будет двигаться

    // добавляем спрайт бота на сцену и включаем физику
    scene.physics.add.existing(this);
  }

  setTarget(player) {
    this.player = player;
  }

  preload() {
    this.add.image("961", "320", "sky");
    this.ground = this.physics.add.staticGroup();
    this.ground.create("961", "620", "ground");
    this.ground.create("300", "620", "ground");
    this.ground.create("1500", "620", "ground");
    this.load.image(
      "enemyBot",
      "/enemyBot/skeleton_sheet.png",
      "/enemyBot/skeleton_atlas.json",
      {
        frameWidth: 300,
        frameHeight: 100,
      }
    );
  }

  create() {
    this.enemies = this.physics.add.sprite(800, 580, "enemy");

    this.bot = this.physics.add.staticGroup();
    this.physics.add.collider(this.bot, this.ground);
    this.bot.setBodySize(40, 50);
    this.bot.setCollideWorldBounds(true);
    this.physics.add.existing(this.bot, true);
  }

  update(time, delta) {
    // проверяем, есть ли у бота цель
    if (this.player) {
      // вычисляем расстояние до цели
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.player.x,
        this.player.y
      );

      // если расстояние меньше, чем допустимый порог, останавливаем бота
      if (distance < 10) {
        // this.body.setVelocity(0, 0);
        return;
      }

      // вычисляем вектор направления движения к цели
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.player.x,
        this.player.y
      );
      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;

      // устанавливаем скорость движения бота
      //   this.body.setVelocity(vx, vy);
    }
  }
}

export default Enemy;
