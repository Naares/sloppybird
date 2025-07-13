import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 960,
    height: 640,
    backgroundColor: '#000000',
    pixelArt: true,
    physics:{
        default:'arcade',
        arcade: {
            gravity: {y:0},
            debug: false
        }
    },
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            