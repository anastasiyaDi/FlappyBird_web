import { CONFIG } from '../config/constants.js';
import { Bird } from '../entities/Bird.js';
import { Pipe } from '../entities/Pipe.js';
import { PhysicsEngine } from '../physics/PhysicsEngine.js';
import { Renderer } from '../render/Renderer.js';
import { AudioManager } from '../audio/AudioManager.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = new Renderer(this.ctx);
        this.physics = new PhysicsEngine();
        this.audio = new AudioManager();

        this.bird = null;
        this.pipes = [];

        this.score = 0;
        this.bestScore = 0;
        this.isRunning = false;
        this.gameOver = false;

        this.lastPipeTime = 0;
        this.animationId = null;
        this.lastTimestamp = 0;
        this.groundOffset = 0;

        this.bounds = {
            top: 0,
            bottom: CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.GROUND_HEIGHT
        };

        this.ground = {
            x: 0,
            y: CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.GROUND_HEIGHT,
            width: CONFIG.CANVAS.WIDTH,
            height: CONFIG.ENVIRONMENT.GROUND_HEIGHT
        };

        this.loadBestScore();
        this.init();
    }

    loadBestScore() {
        const savedScore = localStorage.getItem('flappyBirdBestScore');
        this.bestScore = savedScore ? parseInt(savedScore) : 0;
        this.updateScoreDisplay();
    }

    init() {
        const startX = Math.floor(CONFIG.CANVAS.WIDTH / 2 - CONFIG.BIRD.WIDTH / 2);
        const startY = Math.floor(
            (CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.GROUND_HEIGHT) / 2
            - CONFIG.BIRD.HEIGHT / 2
            + 30
        );

        this.bird = new Bird(startX, startY);
        this.bird.velocity = 0;

        this.pipes = [];
        this.score = 0;
        this.isRunning = false;
        this.gameOver = false;
        this.lastPipeTime = 0;
        this.groundOffset = 0;

        this.updateScoreDisplay();
        console.log('Game initialized - Bird at:', startX, startY);
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.gameOver = false;
        this.lastTimestamp = performance.now();
        this.gameLoop(this.lastTimestamp);

        console.log('Game started');
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.update(deltaTime);
        this.draw();

        this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    update(deltaTime) {
        const normalizedDelta = deltaTime / 16.67;

        this.bird.update(this.physics, normalizedDelta);

        this.groundOffset = (this.groundOffset - CONFIG.GAME.SCROLL_SPEED * normalizedDelta) % 50;

        this.updatePipes(normalizedDelta);

        if (!this.gameOver) {
            this.checkCollisions();
            this.checkBounds();
        }
    }

    updatePipes(deltaTime) {
        const currentTime = Date.now();

        if (currentTime - this.lastPipeTime > CONFIG.GAME.PIPE_SPAWN_RATE) {
            this.createPipe();
            this.lastPipeTime = currentTime;
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update(deltaTime);

            if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
                pipe.passed = true;
                this.addScore();
            }

            if (pipe.isOffScreen()) {
                this.pipes.splice(i, 1);
            }
        }
    }

    createPipe() {
        const minGapY = 100;
        const maxGapY = CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.GROUND_HEIGHT - CONFIG.PIPE.GAP - 100;
        const gapY = minGapY + Math.random() * (maxGapY - minGapY);

        const pipe = new Pipe(CONFIG.CANVAS.WIDTH, gapY);
        this.pipes.push(pipe);

        console.log('New pipe created at y:', gapY);
    }

    checkCollisions() {
        const birdBounds = this.bird.getBounds();

        if (this.physics.checkCollision(birdBounds, this.ground)) {
            console.log('Collision with ground!');
            this.endGame();
            return;
        }

        for (const pipe of this.pipes) {
            if (this.physics.checkPipeCollision(this.bird, pipe)) {
                console.log('Collision with pipe!');
                this.endGame();
                return;
            }
        }
    }

    checkBounds() {
        if (this.bird.y < this.bounds.top) {
            this.bird.y = this.bounds.top;
            this.bird.velocity = Math.max(0, this.bird.velocity);
        }

        if (this.bird.y + this.bird.height > this.bounds.bottom) {
            this.bird.y = this.bounds.bottom - this.bird.height;
        }
    }

    addScore() {
        this.score++;
        this.audio.play('point');
        this.updateScoreDisplay();
        console.log('Score increased to:', this.score);
    }

    endGame() {
        this.audio.play('hit');
        this.gameOver = true;
        this.isRunning = false;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappyBirdBestScore', this.bestScore.toString());
            this.updateScoreDisplay();
        }

        console.log('Game over! Score:', this.score, 'Best:', this.bestScore);
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawBackground();
        this.pipes.forEach(pipe => pipe.draw(this.renderer));
        this.renderer.drawGround(this.groundOffset);
        this.bird.draw(this.renderer);
        this.drawUI();
    }

    drawUI() {
        if (this.isRunning || this.score > 0) {
            this.renderer.drawText(
                this.score.toString(),
                CONFIG.CANVAS.WIDTH / 2,
                80,
                CONFIG.UI.TEXT_COLOR,
                CONFIG.UI.SCORE_SIZE
            );
        }

        if (!this.isRunning && this.score === 0 && !this.gameOver) {
            this.drawStartScreen();
        }

        if (this.gameOver) {
            this.drawGameOverScreen();
        }
    }

    drawStartScreen() {
        this.renderer.drawText(
            'FLAPPY BIRD',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 - 60,
            CONFIG.UI.TEXT_COLOR,
            36
        );

        this.renderer.drawText(
            'Кликни или нажми ПРОБЕЛ',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2,
            CONFIG.UI.TEXT_COLOR,
            CONFIG.UI.TEXT_SIZE
        );

        this.renderer.drawText(
            `Лучший: ${this.bestScore}`,
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 + 40,
            CONFIG.UI.TEXT_COLOR,
            CONFIG.UI.SMALL_TEXT_SIZE
        );
    }

    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);

        this.renderer.drawText(
            'ИГРА ОКОНЧЕНА',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 - 60,
            '#ff6b6b',
            32
        );

        this.renderer.drawText(
            `Счет: ${this.score}`,
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 - 20,
            CONFIG.UI.TEXT_COLOR,
            CONFIG.UI.TEXT_SIZE
        );

        this.renderer.drawText(
            `Лучший: ${this.bestScore}`,
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 + 10,
            CONFIG.UI.TEXT_COLOR,
            CONFIG.UI.TEXT_SIZE
        );

        this.renderer.drawText(
            'Кликни для рестарта',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 + 50,
            CONFIG.UI.TEXT_COLOR,
            CONFIG.UI.SMALL_TEXT_SIZE
        );
    }

    updateScoreDisplay() {
        const currentScoreElement = document.getElementById('current-score');
        const bestScoreElement = document.getElementById('best-score');

        if (currentScoreElement) {
            currentScoreElement.textContent = this.score;
        }
        if (bestScoreElement) {
            bestScoreElement.textContent = this.bestScore;
        }
    }

    handleClick() {
        if (this.gameOver) {
            this.init();
            this.start();
        } else if (!this.isRunning) {
            this.start();
        }

        this.bird.jump();
        this.audio.play('flap');

        console.log('Bird jump! Velocity:', this.bird.velocity);
    }

    restart() {
        this.stop();
        this.init();
    }

    toggleSound() {
        const enabled = this.audio.toggle();
        return enabled;
    }
}