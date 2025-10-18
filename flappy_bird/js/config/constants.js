// Конфигурационные константы для игры
export const CONFIG = {
    CANVAS: {
        WIDTH: 360,
        HEIGHT: 640
    },
    GAME: {
        FPS: 60,
        GRAVITY: 0.5,
        JUMP_FORCE: -10,
        PIPE_SPAWN_RATE: 1500, // мс - новые трубы каждую 1.5 секунды
        PIPE_SPEED: 2,
        SCROLL_SPEED: 1,
        INITIAL_BIRD_X: 80
    },
    BIRD: {
        // Высота птицы = 20% от высоты свободного промежутка
        // Свободный промежуток = 25% от высоты трубы
        // Поэтому: высота птицы = 0.2 * 0.25 * высота_канваса = ~32px
        WIDTH: 34,
        HEIGHT: 24,
        FLAP_ANIMATION_SPEED: 0.2
    },
    PIPE: {
        // Ширина трубы = 2 * ширина птицы
        WIDTH: 68, // 2 * 34
        GAP: 150,  // Свободный промежуток = 25% от высоты трубы
        MIN_GAP_Y: 100,
        DISTANCE_BETWEEN: 204, // 3 * ширина трубы = 3 * 68
        COLOR: '#74bf2e',
        CAP_COLOR: '#5a8a2a',
        CAP_HEIGHT: 20
    },
    ENVIRONMENT: {
        SKY_COLOR: '#70c5ce',
        GROUND_COLOR: '#ded895',
        GROUND_HEIGHT: 80,
        CLOUD_COLORS: ['#ffffff', '#f8f8f8', '#f0f0f0']
    },
    UI: {
        TEXT_COLOR: '#ffffff',
        TEXT_SHADOW: '#000000',
        SCORE_SIZE: 48,
        TEXT_SIZE: 24,
        SMALL_TEXT_SIZE: 18
    },
    AUDIO: {
        VOLUME: 0.3
    }
};