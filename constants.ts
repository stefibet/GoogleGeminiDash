
import { ObstacleData } from './types';

export const GAME_CONFIG = {
    GRAVITY: -1.2, // Increased magnitude for less floaty jumps
    JUMP_FORCE: 16, // Further increased for better jump height to clear obstacles
    GAME_SPEED: 6, // Decreased slightly for better pacing and jump timing
    ROTATION_SPEED: 7,
    PLAYER_SIZE: 40,
    OBSTACLE_WIDTH: 40,
    OBSTACLE_HEIGHT: 40,
    LEVEL_WIDTH: 1024,
    LEVEL_HEIGHT: 576,
    COLLISION_PADDING: 8, // Increased for more forgiving hitboxes
    JUMP_BUFFER_TIME: 100, // New: Time in ms to buffer a jump input before landing
};

export const LEVEL_1_DATA: ObstacleData[] = [
    { type: 'spike', x: 15 },
    { type: 'spike', x: 25 },
    { type: 'spike', x: 26 },
    { type: 'spike', x: 29 }, // Changed from x: 27 to x: 29 to ease triple spike
    { type: 'spike', x: 36 },
    { type: 'spike', x: 37 },
    { type: 'spike', x: 50 },
    { type: 'spike', x: 55 },
    { type: 'spike', x: 60 },
    { type: 'spike', x: 61 },
    { type: 'spike', x: 64 }, // Changed from x: 62 to x: 64 to ease quadruple spike
    { type: 'spike', x: 65 }, // Changed from x: 63 to x: 65 to ease quadruple spike
    { type: 'spike', x: 75 },
    { type: 'spike', x: 76 },
    { type: 'spike', x: 85 },
    { type: 'spike', x: 95 },
    { type: 'spike', x: 96 },
    { type: 'spike', x: 99 }, // Changed from x: 97 to x: 99 to stretch this triple spike
    { type: 'spike', x: 110 },
    { type: 'spike', x: 115 },
    { type: 'spike', x: 116 },
    { type: 'spike', x: 119 }, // Changed from x: 117 to x: 119 to stretch this triple spike
    { type: 'spike', x: 125 },
    // Removed the quadruple spike jump at x: 135, 136, 137, 138
    { type: 'spike', x: 150 },
];

export const LEVEL_2_DATA: ObstacleData[] = [
    { type: 'spike', x: 10 },
    { type: 'spike', x: 15 }, // Gap 4 from 10
    { type: 'spike', x: 19 }, // Gap 3 from 15
    { type: 'spike', x: 24 }, // Gap 4 from 19
    { type: 'spike', x: 28 }, // Gap 3 from 24
    { type: 'spike', x: 32 }, // Gap 3 from 28
    { type: 'spike', x: 37 }, // Gap 4 from 32
    { type: 'spike', x: 41 }, // Gap 3 from 37
    { type: 'spike', x: 45 }, // Gap 3 from 41
    { type: 'spike', x: 50 }, // Gap 4 from 45
    { type: 'spike', x: 54 }, // Gap 3 from 50
    { type: 'spike', x: 58 }, // Gap 3 from 54
    { type: 'spike', x: 63 }, // Gap 4 from 58
    { type: 'spike', x: 67 }, // Gap 3 from 63
    { type: 'spike', x: 71 }, // Gap 3 from 67
    { type: 'spike', x: 76 }, // Gap 4 from 71
    { type: 'spike', x: 80 }, // Gap 3 from 76
    { type: 'spike', x: 84 }, // Gap 3 from 80
    { type: 'spike', x: 89 }, // Gap 4 from 84
    { type: 'spike', x: 93 }, // Gap 3 from 89
    { type: 'spike', x: 97 }, // Gap 3 from 93
    { type: 'spike', x: 102 }, // Gap 4 from 97
    { type: 'spike', x: 106 }, // Gap 3 from 102
    { type: 'spike', x: 110 }, // Gap 3 from 106
    { type: 'spike', x: 115 }, // Gap 4 from 110
    { type: 'spike', x: 119 }, // Gap 3 from 115
    { type: 'spike', x: 123 }, // Gap 3 from 119
];

export const LEVEL_3_DATA: ObstacleData[] = [
    { type: 'spike', x: 10 },
    { type: 'spike', x: 11 },
    { type: 'spike', x: 12 }, // Contiguous triple
    { type: 'spike', x: 16 },
    { type: 'spike', x: 17 },
    { type: 'spike', x: 20 },
    { type: 'spike', x: 21 }, // Double then single
    { type: 'spike', x: 25 },
    { type: 'spike', x: 26 },
    { type: 'spike', x: 27 }, // Contiguous triple
    { type: 'spike', x: 30 },
    { type: 'spike', x: 31 },
    { type: 'spike', x: 35 },
    { type: 'spike', x: 36 },
    { type: 'spike', x: 37 }, // Contiguous triple
    { type: 'spike', x: 40 },
    { type: 'spike', x: 41 },
    { type: 'spike', x: 45 },
    { type: 'spike', x: 46 },
    { type: 'spike', x: 47 },
    { type: 'spike', x: 50 },
    { type: 'spike', x: 51 }, // Double jump + small gap + double jump
    { type: 'spike', x: 55 },
    { type: 'spike', x: 56 },
    { type: 'spike', x: 57 },
    { type: 'spike', x: 60 },
    { type: 'spike', x: 61 },
    { type: 'spike', x: 62 },
    { type: 'spike', x: 63 }, // Continuous quad (very hard!)
    { type: 'spike', x: 70 },
    { type: 'spike', x: 71 },
    { type: 'spike', x: 75 },
    { type: 'spike', x: 76 },
    { type: 'spike', x: 80 },
    { type: 'spike', x: 81 },
    { type: 'spike', x: 85 },
    { type: 'spike', x: 86 },
    { type: 'spike', x: 90 },
    { type: 'spike', x: 91 },
    { type: 'spike', x: 95 },
    { type: 'spike', x: 96 },
    { type: 'spike', x: 97 },
    { type: 'spike', x: 100 },
    { type: 'spike', x: 101 },
    { type: 'spike', x: 102 },
    { type: 'spike', x: 105 },
    { type: 'spike', x: 106 },
    { type: 'spike', x: 110 },
    { type: 'spike', x: 111 },
    { type: 'spike', x: 115 },
    { type: 'spike', x: 116 },
    { type: 'spike', x: 117 },
    { type: 'spike', x: 120 },
    { type: 'spike', x: 121 },
    { type: 'spike', x: 122 },
    { type: 'spike', x: 125 },
    { type: 'spike', x: 126 },
    { type: 'spike', x: 130 },
    { type: 'spike', x: 131 },
    { type: 'spike', x: 135 },
    { type: 'spike', x: 136 },
    { type: 'spike', x: 140 },
    { type: 'spike', x: 141 },
    { type: 'spike', x: 150 },
    { type: 'spike', x: 160 },
];

export const ALL_LEVELS = [LEVEL_1_DATA, LEVEL_2_DATA, LEVEL_3_DATA];
