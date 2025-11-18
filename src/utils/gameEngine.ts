import { GAME_CONFIG } from './constants';

// ============================================
// GAME STATE TYPES
// ============================================

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  size: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
  width: number;
}

export interface GameEngineState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  frameCount: number;
}

// ============================================
// INITIALIZATION
// ============================================

export const createBird = (): Bird => ({
  x: GAME_CONFIG.BIRD_X_POSITION,
  y: GAME_CONFIG.CANVAS_HEIGHT / 2,
  velocity: 0,
  rotation: 0,
  size: GAME_CONFIG.BIRD_SIZE,
});

export const createPipe = (x: number): Pipe => {
  const minHeight = 50;
  const maxHeight = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - 50;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

  return {
    x,
    topHeight,
    bottomY: topHeight + GAME_CONFIG.PIPE_GAP,
    passed: false,
    width: GAME_CONFIG.PIPE_WIDTH,
  };
};

export const initializeGameState = (): GameEngineState => ({
  bird: createBird(),
  pipes: [
    createPipe(GAME_CONFIG.CANVAS_WIDTH + 100),
    createPipe(GAME_CONFIG.CANVAS_WIDTH + 400),
    createPipe(GAME_CONFIG.CANVAS_WIDTH + 700),
  ],
  score: 0,
  isRunning: true,
  isPaused: false,
  isGameOver: false,
  frameCount: 0,
});

// ============================================
// PHYSICS
// ============================================

export const applyGravity = (bird: Bird): Bird => {
  const newVelocity = Math.min(
    bird.velocity + GAME_CONFIG.GRAVITY,
    GAME_CONFIG.MAX_VELOCITY
  );

  const newY = bird.y + newVelocity;

  // Calculate rotation based on velocity (-45° to 90°)
  const rotation = Math.min(Math.max(newVelocity * 3, -45), 90);

  return {
    ...bird,
    y: newY,
    velocity: newVelocity,
    rotation,
  };
};

export const jump = (bird: Bird): Bird => ({
  ...bird,
  velocity: GAME_CONFIG.JUMP_VELOCITY,
  rotation: -45,
});

// Calculate progressive speed based on score
export const calculateSpeed = (score: number): number => {
  // Speed increases every 5 points
  const speedBoost = Math.floor(score / 5) * GAME_CONFIG.PIPE_SPEED_INCREMENT;
  const currentSpeed = GAME_CONFIG.PIPE_SPEED + speedBoost;

  // Cap at maximum speed
  return Math.min(currentSpeed, GAME_CONFIG.PIPE_SPEED_MAX);
};

export const movePipes = (pipes: Pipe[], score: number): Pipe[] => {
  const speed = calculateSpeed(score);
  return pipes.map((pipe) => ({
    ...pipe,
    x: pipe.x - speed,
  }));
};

// ============================================
// PIPE MANAGEMENT
// ============================================

export const shouldAddNewPipe = (pipes: Pipe[]): boolean => {
  if (pipes.length === 0) return true;

  const lastPipe = pipes[pipes.length - 1];
  // Wider spacing between pipes for the wider canvas
  return lastPipe.x < GAME_CONFIG.CANVAS_WIDTH - 300;
};

export const removeOffscreenPipes = (pipes: Pipe[]): Pipe[] => {
  return pipes.filter((pipe) => pipe.x + pipe.width > -50);
};

export const addNewPipe = (pipes: Pipe[]): Pipe[] => {
  const newPipe = createPipe(GAME_CONFIG.CANVAS_WIDTH);
  return [...pipes, newPipe];
};

// ============================================
// SCORING
// ============================================

export const updateScore = (
  bird: Bird,
  pipes: Pipe[],
  currentScore: number
): { pipes: Pipe[]; score: number } => {
  let newScore = currentScore;
  const updatedPipes = pipes.map((pipe) => {
    // Check if bird has passed the pipe
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      newScore += 1;
      return { ...pipe, passed: true };
    }
    return pipe;
  });

  return { pipes: updatedPipes, score: newScore };
};

// ============================================
// COLLISION DETECTION
// ============================================

export const checkCollision = (bird: Bird, pipes: Pipe[]): boolean => {
  // Check if bird hit the ground or ceiling
  if (bird.y + bird.size > GAME_CONFIG.CANVAS_HEIGHT || bird.y < 0) {
    return true;
  }

  // Check collision with pipes
  for (const pipe of pipes) {
    // Check if bird is within pipe's horizontal range
    if (
      bird.x + bird.size > pipe.x &&
      bird.x < pipe.x + pipe.width
    ) {
      // Check if bird hit top pipe
      if (bird.y < pipe.topHeight) {
        return true;
      }

      // Check if bird hit bottom pipe
      if (bird.y + bird.size > pipe.bottomY) {
        return true;
      }
    }
  }

  return false;
};

// ============================================
// GAME LOOP UPDATE
// ============================================

export const updateGameState = (
  state: GameEngineState,
  action?: 'jump' | 'pause' | 'resume'
): GameEngineState => {
  // Handle paused state
  if (state.isPaused) {
    if (action === 'resume') {
      return { ...state, isPaused: false };
    }
    return state;
  }

  // Handle pause action
  if (action === 'pause') {
    return { ...state, isPaused: true };
  }

  // Handle game over state
  if (state.isGameOver || !state.isRunning) {
    return state;
  }

  // Apply jump if action is jump
  let bird = state.bird;
  if (action === 'jump') {
    bird = jump(bird);
  }

  // Apply physics
  bird = applyGravity(bird);

  // Move pipes (speed increases with score)
  let pipes = movePipes(state.pipes, state.score);

  // Remove offscreen pipes
  pipes = removeOffscreenPipes(pipes);

  // Add new pipes
  if (shouldAddNewPipe(pipes)) {
    pipes = addNewPipe(pipes);
  }

  // Update score
  const { pipes: scoredPipes, score } = updateScore(bird, pipes, state.score);

  // Check collisions
  const collision = checkCollision(bird, scoredPipes);

  return {
    bird,
    pipes: scoredPipes,
    score,
    isRunning: !collision,
    isPaused: false,
    isGameOver: collision,
    frameCount: state.frameCount + 1,
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const resetGame = (): GameEngineState => {
  return initializeGameState();
};

export const calculateReward = (score: number): number => {
  return score * GAME_CONFIG.REWARD_RATE;
};

export const canMintNFT = (score: number): boolean => {
  return score >= GAME_CONFIG.MIN_SCORE_FOR_NFT && GAME_CONFIG.NFT_MINTING_ENABLED;
};
