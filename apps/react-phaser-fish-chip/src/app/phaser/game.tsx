
import styled from 'styled-components';
import React, { useEffect, useRef } from 'react';


import Phaser from 'phaser';

import GridEngine from 'grid-engine';

import { CreditsScene } from './scenes/CreditsScene';
import { FishChipScene } from './scenes/FishChipScene';
import {FishScene} from './scenes/FishScene';
import {GameOver} from './scenes/GameOver';
import {Preloader} from './scenes/Preloader';
import {TownScene} from './scenes/TownScene';





const StyledApp = styled.div`
    // Your style here
`;


export function Game() {
    const gameRef = useRef(null); 

    useEffect(() => {


        if (gameRef.current) {


            const gameParent = gameRef.current;


            const config = {
                title: "TownEngine",
                render: {
                    antialias: false,
                },

                scale: {

                    mode: Phaser.Scale.RESIZE,
                    //mode: Phaser.Scale.FIT,
                    //autoCenter: Phaser.Scale.CENTER_BOTH,

                    min: {
                        width: 1024,
                        height: 768,
                    },

                    max: {
                        width: 1600,
                        height: 1200,
                    },

                    zoom: 1

                },

                type: Phaser.AUTO,
                transparent: true,
                width: 800,
                height: 600,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 0 }, // TownScene seems to be a top-down game, so no gravity
                        debug: false
                    }
                },
                plugins: {
                    scene: [
                        {
                        key: "gridEngine",
                        plugin: GridEngine,
                        mapping: "gridEngine",
                        },
                   ],
                },
                /// TownScene, CreditsScene, FishScene, GameOver, 
                scene: [Preloader, TownScene, FishChipScene, GameOver, FishScene, CreditsScene], // Add other scenes as needed

                input: {
                    mouse: {
                        preventDefaultWheel: false
                    },
                    touch: {
                        capture: false
                    }
                },

            };

            const gameConfig = { ...config, parent: gameParent };
            const game = new Phaser.Game(gameConfig);
        

                    
            return () => {
                // Cleanup the game when the component is unmounted
                game.destroy(true);
            };
        }
    }, []);

    return (
        <StyledApp>
             <div ref={gameRef} />
        </StyledApp>
    )
}

export default Game;