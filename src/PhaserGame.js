import React from 'react';
import Phaser from 'phaser';
import configs from './configs'

function GameComponent() {
    const game = new Phaser.Game({
        ...configs,
        parent: 'game-content',
    });

    return <div id="game-content" />;
};

export default GameComponent;