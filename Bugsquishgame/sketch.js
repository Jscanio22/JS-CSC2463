let bugs = [];
let squishedCockroach;
let cockroachSpritesheet;
let score = 0;
let timeLeft = 30;
let gameOver = false;

function preload() {
  cockroachSpritesheet = loadImage("media/cockroach.png"); 
  squishedCockroach = loadImage("media/bug_squished.png"); 
} 

function setup() { 
  createCanvas(400, 400); 

  for (let i = 0; i < 5; i++) {
    bugs.push(new Character(random(width), random(height), cockroachSpritesheet));
  }
  
  setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      gameOver = true;
    }
  }, 1000);
} 

function draw() { 
  background(220); 

  if (!gameOver) {
    textSize(16);
    fill(0);
    text(`Time Left: ${timeLeft}`, 20, 20);
    text(`Score: ${score}`, 20, 40);

    // Update and display bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
      bugs[i].move();
      bugs[i].draw();
    }
  } else {
    textSize(24);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text('GameOver!', width / 2, height / 2 - 20);
    text(`FinalScore: ${score}`, width / 2, height / 2 + 20);
  }
}

function mousePressed() {
  if (!gameOver) {
    for (let i = bugs.length - 1; i >= 0; i--) {
      if (bugs[i].isClicked(mouseX, mouseY)) {
        bugs[i].squish();
        score++;
        increaseBugSpeed();
        break;
      }
    }
  }
}

function increaseBugSpeed() {
  for (let bug of bugs) {
    bug.speed *= 1.1;
  }
}

// Character Class (Bug)
class Character {
  constructor(x, y, sprite) {
    this.sprite = sprite; 
    this.x = x; 
    this.y = y; 
    this.speed = 2;
    this.angle = random(TWO_PI);
    this.squished = false;
    this.animations = {
      right: new SpriteAnimation(sprite, 0, 0, 5),
      left: new SpriteAnimation(sprite, 0, 0, 5),
      stand: new SpriteAnimation(sprite, 0, 0, 1)
    };
    this.currentAnimation = "stand";
  }

  move() {
    if (!this.squished) {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);

      if (this.x < 0 || this.x > width) this.angle = PI - this.angle;
      if (this.y < 0 || this.y > height) this.angle = -this.angle;
      
      if (cos(this.angle) > 0) {
        this.currentAnimation = "right";
      } else {
        this.currentAnimation = "left";
      }
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    
    if (this.squished) {
      image(squishedCockroach, -25, -25, 50, 50);
    } else {
      rotate(this.angle + HALF_PI); 
      this.animations[this.currentAnimation].draw(0, 0);
    }
    
    pop();
  }

  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < 25; 
  }

  squish() {
    this.squished = true;
    setTimeout(() => {
      let index = bugs.indexOf(this);
      if (index > -1) {
        bugs.splice(index, 1); 
      }
    }, 200); 
  }
}

class SpriteAnimation { 
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet; 
    this.u = startU; 
    this.v = startV; 
    this.duration = duration; 
    this.startU = startU; 
    this.frameCount = 0;
  }

  draw(x, y) { 
    image(this.spritesheet, x, y, 80, 80, this.u * 80, this.v * 80, 80, 80); 
    if (this.frameCount++ % 10 == 0) {
      this.u++;
    }
    if (this.u >= this.startU + this.duration) { 
      this.u = this.startU; 
    }
  }
}