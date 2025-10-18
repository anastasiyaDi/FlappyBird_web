import { CONFIG } from '../config/constants.js';

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    }

    drawBackground() {
        // Небо с градиентом
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS.HEIGHT);
        gradient.addColorStop(0, '#70c5ce');
        gradient.addColorStop(1, '#87ceeb');
        this.drawRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT, gradient);

        // Облака
        this.drawClouds();
    }

    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // Облако 1
        this.drawCloud(80, 100, 60);
        // Облако 2
        this.drawCloud(250, 150, 70);
        // Облако 3
        this.drawCloud(150, 70, 50);
    }

    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.6, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.4, y + size * 0.1, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawGround(offset) {
        const groundY = CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.GROUND_HEIGHT;

        // Основная земля
        this.drawRect(0, groundY, CONFIG.CANVAS.WIDTH, CONFIG.ENVIRONMENT.GROUND_HEIGHT, CONFIG.ENVIRONMENT.GROUND_COLOR);

        // Трава (верхний слой)
        this.ctx.fillStyle = '#7cb342';
        this.ctx.fillRect(0, groundY, CONFIG.CANVAS.WIDTH, 8);

        // Текстура земли (простая)
        this.ctx.fillStyle = '#c5b579';
        for (let i = -offset % 20; i < CONFIG.CANVAS.WIDTH; i += 20) {
            this.ctx.fillRect(i, groundY + 15, 15, 3);
        }
    }

    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawText(text, x, y, color = CONFIG.UI.TEXT_COLOR, fontSize = CONFIG.UI.TEXT_SIZE, align = 'center') {
        // Тень текста
        this.ctx.fillStyle = CONFIG.UI.TEXT_SHADOW;
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + 2, y + 2);

        // Основной текст
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    drawRoundedRect(x, y, width, height, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.arcTo(x, y, x + radius, y, radius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}