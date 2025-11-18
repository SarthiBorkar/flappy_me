import type { Bird, Pipe } from './gameEngine';

// ============================================
// COLLISION DETECTION UTILITIES
// ============================================

/**
 * Check if bird collides with a single pipe
 */
export const checkPipeCollision = (bird: Bird, pipe: Pipe): boolean => {
  // Check if bird is within pipe's horizontal range
  const birdRight = bird.x + bird.size;
  const birdBottom = bird.y + bird.size;
  const pipeRight = pipe.x + pipe.width;

  const horizontalOverlap = birdRight > pipe.x && bird.x < pipeRight;

  if (!horizontalOverlap) {
    return false;
  }

  // Check if bird hit top pipe or bottom pipe
  const hitTopPipe = bird.y < pipe.topHeight;
  const hitBottomPipe = birdBottom > pipe.bottomY;

  return hitTopPipe || hitBottomPipe;
};

/**
 * Check if bird is out of bounds (top or bottom)
 */
export const checkBoundaryCollision = (bird: Bird, canvasHeight: number): boolean => {
  return bird.y < 0 || bird.y + bird.size > canvasHeight;
};

/**
 * Get collision details for debugging
 */
export interface CollisionDetails {
  type: 'none' | 'pipe' | 'ceiling' | 'ground';
  pipeIndex?: number;
  position?: { x: number; y: number };
}

export const getCollisionDetails = (
  bird: Bird,
  pipes: Pipe[],
  canvasHeight: number
): CollisionDetails => {
  // Check ceiling
  if (bird.y < 0) {
    return {
      type: 'ceiling',
      position: { x: bird.x, y: bird.y },
    };
  }

  // Check ground
  if (bird.y + bird.size > canvasHeight) {
    return {
      type: 'ground',
      position: { x: bird.x, y: bird.y + bird.size },
    };
  }

  // Check pipes
  for (let i = 0; i < pipes.length; i++) {
    if (checkPipeCollision(bird, pipes[i])) {
      return {
        type: 'pipe',
        pipeIndex: i,
        position: { x: pipes[i].x, y: bird.y },
      };
    }
  }

  return { type: 'none' };
};

/**
 * Circle-rectangle collision (more accurate)
 */
export const circleRectCollision = (
  circle: { x: number; y: number; radius: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean => {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.radius) return false;
  if (distY > rect.height / 2 + circle.radius) return false;

  if (distX <= rect.width / 2) return true;
  if (distY <= rect.height / 2) return true;

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;

  return dx * dx + dy * dy <= circle.radius * circle.radius;
};

/**
 * Advanced collision detection using circular bird hitbox
 */
export const checkPipeCollisionCircular = (bird: Bird, pipe: Pipe): boolean => {
  const birdCircle = {
    x: bird.x + bird.size / 2,
    y: bird.y + bird.size / 2,
    radius: bird.size / 2,
  };

  // Top pipe rectangle
  const topPipe = {
    x: pipe.x,
    y: 0,
    width: pipe.width,
    height: pipe.topHeight,
  };

  // Bottom pipe rectangle
  const bottomPipe = {
    x: pipe.x,
    y: pipe.bottomY,
    width: pipe.width,
    height: 1000, // Large height for bottom pipe
  };

  return (
    circleRectCollision(birdCircle, topPipe) ||
    circleRectCollision(birdCircle, bottomPipe)
  );
};
