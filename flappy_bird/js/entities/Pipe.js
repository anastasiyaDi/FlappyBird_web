import { CONFIG } from '../config/constants.js';

export class Pipe {
    constructor(x, gapY) {
        this.x = x;
        this.width = CONFIG.PIPE.WIDTH;
        this.gapY = gapY;
        this.gapHeight = CONFIG.PIPE.GAP;
        this.passed = false;
        this.speed = CONFIG.GAME.PIPE_SPEED;

        // Верхняя труба (от верха до начала промежутка)
        this.topPipe = {
            x: x,
            y: 0,
            width: this.width,
            height: gapY
        };

        // Нижняя труба (от конца промежутка до земли)
        this.bottomPipe = {
            x: x,
            y: gapY + this.gapHeight,
            width: this.width,
            height: CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.GROUND_HEIGHT - (gapY + this.gapHeight)
        };
    }

        _overlap(a, b) {
            return a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y;
        }

    update(deltaTime = 1) {
        this.x -= this.speed * deltaTime;
        this.topPipe.x = this.x;
        this.bottomPipe.x = this.x;
    }

    draw(renderer) {
        const ctx = renderer.ctx;

        // Верхняя труба
        this.drawSinglePipe(ctx, this.topPipe, true);

        // Нижняя труба
        this.drawSinglePipe(ctx, this.bottomPipe, false);
    }

    drawSinglePipe(ctx, pipe, isTop) {
        const { x, y, width, height } = pipe;

        if (height <= 0) return; // Не рисуем если высота 0 или отрицательная

        // Основная часть трубы
        ctx.fillStyle = CONFIG.PIPE.COLOR;
        ctx.fillRect(x, y, width, height);

        // Текстура трубы (вертикальные полосы)
        ctx.strokeStyle = '#5a8a2a';
        ctx.lineWidth = 3;
        for (let i = x + 10; i < x + width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(i, y);
            ctx.lineTo(i, y + height);
            ctx.stroke();
        }

        // Шляпка трубы
        const capHeight = CONFIG.PIPE.CAP_HEIGHT;
        const capY = isTop ? y + height - capHeight : y;

        ctx.fillStyle = CONFIG.PIPE.CAP_COLOR;
        ctx.fillRect(x - 5, capY, width + 10, capHeight);

        // Детали на шляпке
        ctx.fillStyle = '#4a7a29';
        if (isTop) {
            ctx.fillRect(x - 3, capY + capHeight - 8, width + 6, 3);
            ctx.fillRect(x, capY + capHeight - 15, width, 3);
        } else {
            ctx.fillRect(x - 3, capY + 5, width + 6, 3);
            ctx.fillRect(x, capY + 12, width, 3);
        }
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    getBounds() {
        return [this.topPipe, this.bottomPipe];
    }

    getGapCenter() {
        return this.x + this.width / 2;
    }

    getGapBounds() {
        return {
            x: this.x,
            y: this.gapY,
            width: this.width,
            height: this.gapHeight
        };
    }
}