
import React from 'react';
import type { GameState } from '../types';

interface GameUIProps {
    gameState: GameState;
    onRestart: () => void;
    currentLevelIndex: number; // New prop for current level
    totalLevels: number; // New prop for total levels
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onRestart, currentLevelIndex, totalLevels }) => {
    if (gameState === 'playing') return null;

    let title: string;
    let subtitle: string;

    if (gameState === 'idle') {
        title = "Geo-Rush";
        subtitle = `Level ${currentLevelIndex + 1} - Click or Press Space to Start`;
    } else if (gameState === 'crashed') {
        title = "CRASHED";
        subtitle = `Level ${currentLevelIndex + 1} - Click or Press Space to Retry`;
    } else { // gameState === 'finished'
        if (currentLevelIndex === totalLevels - 1) {
            title = "GAME COMPLETE!";
            subtitle = "Congratulations! Click or Press Space to Play Again (Level 1)";
        } else {
            title = `LEVEL ${currentLevelIndex + 1} COMPLETE!`;
            subtitle = "Click or Press Space for Next Level";
        }
    }

    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 animate-fade-in">
            <h1 className="text-6xl font-black text-white text-shadow-cyan mb-4 tracking-widest">{title}</h1>
            <p className="text-xl text-cyan-200 animate-pulse">{subtitle}</p>
        </div>
    );
};

export default GameUI;
