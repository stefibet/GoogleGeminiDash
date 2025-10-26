
import React, { forwardRef } from 'react';
import { GAME_CONFIG } from '../constants';

const Player = forwardRef<HTMLDivElement>((props, ref) => {
    const { PLAYER_SIZE } = GAME_CONFIG;

    return (
        <div
            ref={ref}
            className="absolute z-10"
            style={{
                left: `${GAME_CONFIG.LEVEL_WIDTH / 4}px`,
                bottom: `0px`,
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
            }}
        >
            <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-cyan-400 border-2 border-white geo-shadow-cyan rounded-md transform transition-transform duration-100 ease-in-out"></div>
                <div className="absolute inset-2 bg-cyan-200 rounded-sm"></div>
            </div>
        </div>
    );
});

Player.displayName = 'Player';

export default Player;
