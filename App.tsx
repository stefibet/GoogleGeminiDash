import React, { useState, useEffect, useRef, useCallback } from 'react';
import Player from './components/Player';
import Obstacle from './components/Obstacle';
import GameUI from './components/GameUI';
import { GAME_CONFIG, ALL_LEVELS } from './constants';
import type { GameState, ObstacleData } from './types';

// Define interface for player state stored in useRef
interface PlayerState {
    y: number;
    vy: number;
    rotation: number;
    isGrounded: boolean;
}

// Define interface for level state stored in useRef
interface LevelState {
    scrollX: number;
}

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [progress, setProgress] = useState(0);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // New state for current level

    const playerRef = useRef<HTMLDivElement>(null);
    const levelContainerRef = useRef<HTMLDivElement>(null);

    const gameLoopRef = useRef<number | null>(null);
    const playerState = useRef<PlayerState>({ y: 0, vy: 0, rotation: 0, isGrounded: true });
    const levelState = useRef<LevelState>({ scrollX: 0 });
    const jumpBufferTimerRef = useRef<number | null>(null);
    const isJumpKeyPressedRef = useRef(false);

    const {
        GRAVITY, JUMP_FORCE, PLAYER_SIZE, GAME_SPEED, ROTATION_SPEED,
        LEVEL_WIDTH, LEVEL_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, COLLISION_PADDING,
        JUMP_BUFFER_TIME
    } = GAME_CONFIG;

    const currentLevelData = ALL_LEVELS[currentLevelIndex]; // Dynamically get current level data
    // Calculate level length based on the last obstacle's x position plus one screen width.
    // Ensure `currentLevelData` is not empty before accessing its last element.
    const levelLength = currentLevelData.length > 0 
        ? currentLevelData[currentLevelData.length - 1].x * OBSTACLE_WIDTH + LEVEL_WIDTH 
        : LEVEL_WIDTH; // Default to one screen width if no obstacles


    const resetGame = useCallback((startPlaying: boolean = false) => {
        playerState.current = { y: 0, vy: 0, rotation: 0, isGrounded: true };
        levelState.current = { scrollX: 0 };
        jumpBufferTimerRef.current = null;
        isJumpKeyPressedRef.current = false;
        if (playerRef.current) {
            playerRef.current.style.transform = `translateY(0px) rotate(0deg)`;
        }
        if (levelContainerRef.current) {
            levelContainerRef.current.style.transform = `translateX(0px)`;
        }
        setProgress(0);
        setGameState(startPlaying ? 'playing' : 'idle');
        
        // Removed auto-jump logic here. Jumps should only be triggered by actual input.
    }, [LEVEL_WIDTH]); // Removed JUMP_FORCE from dependencies, as it's not used here anymore

    const handleInputPress = useCallback(() => {
        // If button is already pressed (e.g., auto-repeat), do nothing unless it's for buffering while airborne
        if (isJumpKeyPressedRef.current) {
            if (gameState === 'playing' && !playerState.current.isGrounded) {
                jumpBufferTimerRef.current = Date.now();
            }
            return;
        }

        isJumpKeyPressedRef.current = true; // Mark key as pressed

        if (gameState === 'playing') {
            // Player is in game, handle jump or buffer
            if (playerState.current.isGrounded) {
                // If grounded, immediately jump
                playerState.current.vy = JUMP_FORCE;
                playerState.current.isGrounded = false;
                jumpBufferTimerRef.current = null; // Clear any existing buffer
            } else {
                // If airborne, buffer the jump
                jumpBufferTimerRef.current = Date.now();
            }
        } else { 
            // Game is not playing (idle, crashed, or finished)
            if (gameState === 'crashed') {
                resetGame(true); // Restart current level and play (starts grounded)
            } else if (gameState === 'finished') { 
                if (currentLevelIndex < ALL_LEVELS.length - 1) {
                    setCurrentLevelIndex(prev => prev + 1);
                    resetGame(true); // Start next level and play (starts grounded)
                } else {
                    setCurrentLevelIndex(0);
                    resetGame(false); // All levels finished, reset to first level and go to idle (starts grounded)
                }
            } else { // gameState === 'idle' (first start)
                resetGame(true); // Simply start the game, player begins grounded.
            }
        }
    }, [gameState, JUMP_FORCE, resetGame, currentLevelIndex, ALL_LEVELS.length]);

    const handleInputRelease = useCallback(() => {
        isJumpKeyPressedRef.current = false;
        jumpBufferTimerRef.current = null;
    }, []);

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        // Update level scroll
        levelState.current.scrollX -= GAME_SPEED;
        
        // Player physics
        playerState.current.vy += GRAVITY;
        playerState.current.y += playerState.current.vy;

        // Ground collision
        if (playerState.current.y < 0) { 
            playerState.current.y = 0;
            playerState.current.vy = 0;
            
            let jumpTriggeredThisFrame = false;

            // 1. Check for buffered jump (pre-press before landing)
            if (!playerState.current.isGrounded && jumpBufferTimerRef.current && (Date.now() - jumpBufferTimerRef.current) < JUMP_BUFFER_TIME) {
                playerState.current.vy = JUMP_FORCE;
                playerState.current.isGrounded = false;
                jumpTriggeredThisFrame = true;
                jumpBufferTimerRef.current = null; // Consume the buffered jump
            }
            // 2. Auto-jump logic: If button is held down continuously upon landing
            else if (isJumpKeyPressedRef.current) {
                playerState.current.vy = JUMP_FORCE;
                playerState.current.isGrounded = false; // Player immediately un-grounded to jump
                jumpTriggeredThisFrame = true;
                jumpBufferTimerRef.current = null; // Clear buffer just in case
            }
            
            // If no jump was triggered by either mechanism, then the player truly lands and remains grounded.
            if (!jumpTriggeredThisFrame) {
                playerState.current.isGrounded = true;
            } else {
                playerState.current.isGrounded = false; // If a jump was triggered, player is not grounded
            }
            
            // If the player is now grounded, ensure the jump buffer is cleared
            if (playerState.current.isGrounded) {
                jumpBufferTimerRef.current = null;
            }

            // Snap rotation to nearest 90 degrees when grounded for a more 'Geometry Dash' feel
            if (playerState.current.isGrounded) { // Only snap if actually grounded after buffer/auto-jump check
                playerState.current.rotation = Math.round(playerState.current.rotation / 90) * 90;
            }
        } else {
            // If not grounded, it means player is airborne, clear buffer if it exists and button is no longer pressed.
            if (!playerState.current.isGrounded && !isJumpKeyPressedRef.current) {
                jumpBufferTimerRef.current = null;
            }
            playerState.current.rotation += ROTATION_SPEED;
        }


        // Apply transforms directly to DOM for performance
        if (playerRef.current) {
            playerRef.current.style.transform = `translateY(${-playerState.current.y}px) rotate(${playerState.current.rotation}deg)`;
        }
        if (levelContainerRef.current) {
            levelContainerRef.current.style.transform = `translateX(${levelState.current.scrollX}px)`;
        }
        
        // Collision Detection - Using screen-relative coordinates
        const playerScreenX = LEVEL_WIDTH / 4; // Player's fixed X position on screen

        const playerRect = {
            x: playerScreenX + COLLISION_PADDING,
            y: LEVEL_HEIGHT - PLAYER_SIZE - playerState.current.y + COLLISION_PADDING, // Player's Y is relative to ground (0 is ground)
            width: PLAYER_SIZE - (2 * COLLISION_PADDING),
            height: PLAYER_SIZE - (2 * COLLISION_PADDING),
        };

        for (const obstacle of currentLevelData) { // Use currentLevelData
            const obsAbsoluteX = obstacle.x * OBSTACLE_WIDTH; // Obstacle's absolute X in the full level

            // Calculate obstacle's screen-relative X position
            const obsScreenX = obsAbsoluteX + levelState.current.scrollX;

            // Only consider obstacles that are potentially on screen
            // If the obstacle is entirely off the right side of the screen OR entirely off the left side of the screen
            if (obsScreenX > LEVEL_WIDTH || obsScreenX + OBSTACLE_WIDTH < 0) {
                continue; 
            }

            const obstacleRect = {
                x: obsScreenX + COLLISION_PADDING,
                y: LEVEL_HEIGHT - OBSTACLE_HEIGHT + COLLISION_PADDING, // Obstacles are always on the ground
                width: OBSTACLE_WIDTH - (2 * COLLISION_PADDING),
                height: OBSTACLE_HEIGHT - (2 * COLLISION_PADDING)
            };

            // AABB Collision check
            if (
                playerRect.x < obstacleRect.x + obstacleRect.width &&
                playerRect.x + playerRect.width > obstacleRect.x &&
                playerRect.y < obstacleRect.y + obstacleRect.height &&
                playerRect.y + playerRect.height > obstacleRect.y
            ) {
                setGameState('crashed');
                return;
            }
        }
        
        // Progress and win condition
        // Adjust the calculation to ensure it doesn't try to divide by zero or negative if levelLength is too short
        const maxScroll = levelLength - LEVEL_WIDTH * 1.2;
        const currentProgress = maxScroll > 0 ? Math.min(100, (-levelState.current.scrollX / maxScroll) * 100) : 100;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
            // Check if there are more levels
            if (currentLevelIndex < ALL_LEVELS.length - 1) {
                setGameState('finished'); // Level finished, but not entire game
            } else {
                setGameState('finished'); // All levels finished
            }
            return;
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, GRAVITY, JUMP_FORCE, PLAYER_SIZE, GAME_SPEED, ROTATION_SPEED, LEVEL_HEIGHT, LEVEL_WIDTH, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, COLLISION_PADDING, JUMP_BUFFER_TIME, levelLength, currentLevelData, currentLevelIndex, ALL_LEVELS.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                handleInputPress();
            }
        };
        
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                handleInputRelease();
            }
        };

        const handleMouseDown = () => {
             handleInputPress();
        };

        const handleMouseUp = () => {
             handleInputRelease();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleInputPress, handleInputRelease]);


    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if(gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState, gameLoop]);


    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white select-none overflow-hidden">
            <div 
                className="relative bg-gray-900 overflow-hidden border-4 border-cyan-400 geo-shadow-cyan"
                style={{ width: LEVEL_WIDTH, height: LEVEL_HEIGHT }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black animate-pulse"></div>
                
                {/* Game Area */}
                <div className="absolute bottom-0 left-0 w-full h-full">
                    <div 
                        ref={levelContainerRef} 
                        className="absolute bottom-0 h-full" 
                        style={{ width: levelLength, transform: `translateX(${levelState.current.scrollX}px)` }}
                    >
                        {currentLevelData.map((obs, index) => ( // Use currentLevelData
                            <Obstacle key={`${currentLevelIndex}-${index}`} obstacleData={obs} /> // Unique key for each obstacle across levels
                        ))}
                    </div>
                    <Player ref={playerRef} />
                </div>

                {/* Floor and Ceiling */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-cyan-400 geo-shadow-cyan"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-cyan-400 geo-shadow-cyan"></div>

                {/* Progress Bar */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-gray-700/50 rounded-full border border-cyan-500/50">
                    <div className="h-full bg-pink-500 rounded-full transition-all duration-100 ease-linear" style={{width: `${progress}%`}}></div>
                </div>

                <GameUI 
                    gameState={gameState} 
                    onRestart={handleInputPress} 
                    currentLevelIndex={currentLevelIndex} // Pass current level index
                    totalLevels={ALL_LEVELS.length} // Pass total number of levels
                />
            </div>
        </div>
    );
};

export default App;