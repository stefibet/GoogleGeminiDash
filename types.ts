
export type GameState = 'idle' | 'playing' | 'crashed' | 'finished';

export type ObstacleType = 'spike' | 'block';

export interface ObstacleData {
    type: ObstacleType;
    x: number; // position in grid units, not pixels
}
