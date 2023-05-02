
import Phaser from 'phaser'
import MainScene from './scenes/MainScene'

 const config={
        type: Phaser.WEBGL,
        width: 1920,
        height: 640,
        backgroundColor: "grey",
        physics: {
          default: "arcade",
          arcade: {
            gravity: {y: 300 },
            debug:false
          }
          
        },
        scene: [MainScene],
        pixelArt: true,
        roundPixels: true
}
export default config