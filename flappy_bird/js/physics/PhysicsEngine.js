export class PhysicsEngine {
    applyGravity(entity, gravity, deltaTime = 1) {
        entity.velocity += gravity * deltaTime;
        entity.y += entity.velocity;
    }

    updatePosition(entity, deltaTime = 1) {
        entity.y += entity.velocity * deltaTime;
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    isOutOfBounds(entity, bounds) {
        return entity.y < bounds.top ||
               entity.y + entity.height > bounds.bottom;
    }

    checkPipeCollision(bird, pipe) {
        const birdBounds = bird.getBounds();
        const pipeBounds = pipe.getBounds();

        // Проверяем столкновение с верхней и нижней трубой
        for (const pipePart of pipeBounds) {
            if (this.checkCollision(birdBounds, pipePart)) {
                return true;
            }
        }

        return false;
    }

    isBirdInGap(bird, pipe) {
        const birdBounds = bird.getBounds();
        const gapBounds = pipe.getGapBounds();

        // Проверяем, находится ли птица в промежутке между трубами
        return birdBounds.x + birdBounds.width > gapBounds.x &&
               birdBounds.x < gapBounds.x + gapBounds.width &&
               birdBounds.y > gapBounds.y &&
               birdBounds.y + birdBounds.height < gapBounds.y + gapBounds.height;
    }
}