import Phaser from 'phaser'
import config from '../configs';

class Foe extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "foe");
    }
  
  }

  class FoeGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
      super(scene.physics.world, scene);
    }
     create(){
        
        let enemiesGroup = this.add.group({
            defaultKey: 'enemy',
            maxSize: 10
        });
        
        let maxEnemiesToShow = 10
        for(let idx = 0; idx < maxEnemiesToShow; idx++){
          // here the function is used to spawn enemies randomly on screen
          const x = Phaser.Math.Between(20, config.width - 20);
          const y = Phaser.Math.Between(40, config.height /2 );
    
          let enemy = enemiesGroup.get(x, y);
          
          enemy.setInteractive()
            .on('pointerdown', () => {
                // 1 in 5 
                if(Phaser.Math.Between(1, 5) === 5){
                    // Drop object
                    this.add.rectangle(enemy.x, enemy.y, 10, 10, 0xFFFF00);
                }
              enemy.destroy();
            })
    
        }
  }
}