import { CONFIG } from '../config/constants.js';

export class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.BIRD.WIDTH;
        this.height = CONFIG.BIRD.HEIGHT;
        this.velocity = 0;
        this.rotation = 0;
        this.isFlapping = false;

        // Цвета птицы
        this.bodyColor = '#ffeb3b';
        this.wingColor = '#ffc107';
        this.beakColor = '#ff9800';
        this.eyeColor = '#000000';
    }

    update(physics, deltaTime = 1) {
        // Применяем гравитацию
        this.velocity += CONFIG.GAME.GRAVITY * deltaTime;
        this.y += this.velocity;

        // Обновляем вращение
        this.updateRotation();
    }

    jump() {
        this.velocity = CONFIG.GAME.JUMP_FORCE;
        this.isFlapping = true;
        setTimeout(() => {
            this.isFlapping = false;
        }, 200);
    }

    updateRotation() {

        const maxRotation = 0.5;
        const minRotation = -0.3;

        if (this.velocity < 0) {
            // Летит вверх - наклоняем вверх
            this.rotation = Math.max(minRotation, this.velocity * 0.1);
        } else {
            // Падает вниз - наклоняем вниз
            this.rotation = Math.min(maxRotation, this.velocity * 0.05);
        }
    }

    draw(renderer) {
        const ctx = renderer.ctx;
        ctx.save();
        // Перемещаем в позицию птицы и вращаем
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Тело птицы (жёлтый овал)
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Обводка тела
        ctx.strokeStyle = '#f57c00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Крыло (анимируется при взмахе)
        const wingOffset = this.isFlapping ? -5 : 0;
        ctx.fillStyle = this.wingColor;
        ctx.beginPath();
        ctx.ellipse(-this.width / 4, wingOffset, this.width / 3, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Глаз
        ctx.fillStyle = this.eyeColor;
        ctx.beginPath();
        ctx.arc(this.width / 4, -this.height / 6, 3, 0, Math.PI * 2);
        ctx.fill();

        // Блик в глазу
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.width / 4 + 1, -this.height / 6 - 1, 1, 0, Math.PI * 2);
        ctx.fill();

        // Клюв
        ctx.fillStyle = this.beakColor;
        ctx.beginPath();
        ctx.moveTo(this.width / 3, 0);
        ctx.lineTo(this.width / 2 + 4, -2);
        ctx.lineTo(this.width / 2 + 4, 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    getBounds() {
        // Hitbox птицы (немного меньше визуального размера)
        return {
            x: this.x + 2,
            y: this.y + 2,
            width: this.width - 4,
            height: this.height - 4
        };
    }
}