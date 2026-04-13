/**
 * Flappy Bird Game
 * A simple canvas-based game using modern JavaScript
 */

'use strict';

// Game configuration constants
const CONFIG = {
  GRAVITY: 1.5,
  JUMP_STRENGTH: 25,
  PIPE_GAP: 100,
  PIPE_SPAWN_X: 125,
  PIPE_SPEED: 1,
  BIRD_START_X: 10,
  BIRD_START_Y: 150,
  SCORE_X: 5
};

// Image paths
const IMAGES = {
  bird: 'img/char.png',
  background: 'img/bg.png',
  ground: 'img/lg.png',
  pipeTop: 'img/top.png',
  pipeBottom: 'img/bot.png'
};

/**
 * Game class that manages the entire game state and rendering
 */
class Game {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.images = {};
    this.score = 0;
    this.pipes = [];
    this.bird = {
      x: CONFIG.BIRD_START_X,
      y: CONFIG.BIRD_START_Y
    };
    
    this.isGameLoaded = false;
    
    this.init();
  }
  
  /**
   * Initialize the game by loading images and setting up event listeners
   */
  init() {
    this.loadImages();
    this.setupEventListeners();
    this.initializePipes();
  }
  
  /**
   * Load all game images
   */
  loadImages() {
    const imagePromises = Object.entries(IMAGES).map(([key, src]) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.images[key] = img;
          resolve(img);
        };
        img.onerror = reject;
      });
    });
    
    Promise.all(imagePromises)
      .then(() => {
        this.isGameLoaded = true;
        this.start();
      })
      .catch(error => {
        console.error('Failed to load images:', error);
      });
  }
  
  /**
   * Set up keyboard event listeners
   */
  setupEventListeners() {
    document.addEventListener('keydown', (event) => this.handleInput(event));
  }
  
  /**
   * Handle player input
   */
  handleInput() {
    this.bird.y -= CONFIG.JUMP_STRENGTH;
  }
  
  /**
   * Initialize the first pipe
   */
  initializePipes() {
    this.pipes = [{
      x: this.canvas.width,
      y: this.getRandomPipeY(),
      spawned: false
    }];
  }
  
  /**
   * Generate a random Y position for pipes
   * @returns {number} Random Y position
   */
  getRandomPipeY() {
    const pipeHeight = this.images.pipeTop.height;
    return Math.floor(Math.random() * pipeHeight) - pipeHeight;
  }
  
  /**
   * Start the game loop
   */
  start() {
    this.gameLoop();
  }
  
  /**
   * Main game loop
   */
  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
  
  /**
   * Update game state
   */
  update() {
    // Apply gravity to bird
    this.bird.y += CONFIG.GRAVITY;
    
    // Update pipes
    this.pipes.forEach((pipe, index) => {
      pipe.x -= CONFIG.PIPE_SPEED;
      
      // Spawn new pipe when current pipe reaches spawn position
      if (pipe.x <= CONFIG.PIPE_SPAWN_X && !pipe.spawned) {
        pipe.spawned = true;
        this.pipes.push({
          x: this.canvas.width,
          y: this.getRandomPipeY(),
          spawned: false
        });
      }
      
      // Check for collisions
      if (this.checkCollision(pipe)) {
        this.restartGame();
      }
      
      // Increment score when pipe passes bird
      if (pipe.x === CONFIG.SCORE_X) {
        this.score++;
      }
    });
    
    // Remove off-screen pipes
    this.pipes = this.pipes.filter(pipe => pipe.x + this.images.pipeTop.width > 0);
    
    // Check if bird hit the ground
    if (this.bird.y + this.images.bird.height >= this.canvas.height - this.images.ground.height) {
      this.restartGame();
    }
  }
  
  /**
   * Check collision between bird and a pipe
   * @param {Object} pipe - Pipe object with x, y coordinates
   * @returns {boolean} True if collision detected
   */
  checkCollision(pipe) {
    const birdRight = this.bird.x + this.images.bird.width;
    const birdBottom = this.bird.y + this.images.bird.height;
    const pipeRight = pipe.x + this.images.pipeTop.width;
    const pipeBottomY = pipe.y + this.images.pipeTop.height;
    const pipeTopOfBottomPipe = pipe.y + this.images.pipeTop.height + CONFIG.PIPE_GAP;
    
    // Check horizontal overlap
    const horizontallyOverlaps = birdRight >= pipe.x && this.bird.x <= pipeRight;
    
    // Check vertical collision (hit top pipe OR hit bottom pipe)
    const hitsTopPipe = this.bird.y <= pipeBottomY;
    const hitsBottomPipe = birdBottom >= pipeTopOfBottomPipe;
    
    return horizontallyOverlaps && (hitsTopPipe || hitsBottomPipe);
  }
  
  /**
   * Restart the game
   */
  restartGame() {
    location.reload();
  }
  
  /**
   * Render all game elements
   */
  render() {
    // Clear canvas and draw background
    this.ctx.drawImage(this.images.background, 0, 0);
    
    // Draw pipes
    this.pipes.forEach(pipe => {
      this.ctx.drawImage(this.images.pipeTop, pipe.x, pipe.y);
      this.ctx.drawImage(
        this.images.pipeBottom, 
        pipe.x, 
        pipe.y + this.images.pipeTop.height + CONFIG.PIPE_GAP
      );
    });
    
    // Draw ground
    this.ctx.drawImage(this.images.ground, 0, this.canvas.height - this.images.ground.height);
    
    // Draw bird
    this.ctx.drawImage(this.images.bird, this.bird.x, this.bird.y);
    
    // Draw score
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Verdana';
    this.ctx.fillText(`Score: ${this.score}`, 10, this.canvas.height - 450);
  }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});