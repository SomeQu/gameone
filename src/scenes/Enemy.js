import Phaser from "phaser";

class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.speed = 100; // скорость движения бота
    this.target = null; // цель, к которой бот будет двигаться

    // добавляем спрайт бота на сцену и включаем физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // устанавливаем размеры тела и смещение спрайта для физики
    this.body.setSize(32, 32);
    this.body.setOffset(0, 0);
  }

  setTarget(target) {
    this.target = target;
  }

  update(time, delta) {
    // проверяем, есть ли у бота цель
    if (this.target) {
      // вычисляем расстояние до цели
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );

      // если расстояние меньше, чем допустимый порог, останавливаем бота
      if (distance < 10) {
        this.body.setVelocity(0, 0);
        return;
      }

      // вычисляем вектор направления движения к цели
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );
      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;

      // устанавливаем скорость движения бота
      this.body.setVelocity(vx, vy);
    }
  }
}

export default Enemy;
