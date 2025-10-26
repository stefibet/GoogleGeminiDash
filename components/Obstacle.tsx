
import React from 'react';
import type { ObstacleData } from '../types';
import { GAME_CONFIG } from '../constants';

interface ObstacleProps {
    obstacleData: ObstacleData;
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacleData }) => {
    const { type, x } = obstacleData;
    const { OBSTACLE_WIDTH, OBSTACLE_HEIGHT } = GAME_CONFIG;

    const commonStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: `${x * OBSTACLE_WIDTH}px`,
        width: `${OBSTACLE_WIDTH}px`,
        height: `${OBSTACLE_HEIGHT}px`,
    };

    if (type === 'spike') {
        return (
            <div style={commonStyle}>
                <div 
                  className="w-0 h-0"
                  style={{
                    borderLeft: `${OBSTACLE_WIDTH/2}px solid transparent`,
                    borderRight: `${OBSTACLE_WIDTH/2}px solid transparent`,
                    borderBottom: `${OBSTACLE_HEIGHT}px solid #ec4899`,
                    filter: `drop-shadow(0 -2px 5px #ec4899)`
                  }}
                ></div>
            </div>
        );
    }
    
    // Add other obstacle types here
    // if (type === 'block') { ... }

    return null;
};

export default Obstacle;
