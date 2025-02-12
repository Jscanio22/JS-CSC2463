let cyclops;
let hat;
let yellow;
let character1;
let character2;
let character3;

function preload() { 
  cyclops = loadImage("media/cyclops.png"); 
  hat = loadImage("media/HatGuy.png"); 
  yellow = loadImage("media/Yellow.png"); 
} 

function setup() { 
  createCanvas(400, 400); 
  character1 = new Character(0, 0, cyclops);
  character2 = new Character(0, 160, hat);
  character3 = new Character(0, 320, yellow);
  
  character1.addAnimation("right", new SpriteAnimation(cyclops, 0, 0, 9)); 
  character1.addAnimation("left", new SpriteAnimation(cyclops, 0, 0, 9)); 
  character1.addAnimation("stand", new SpriteAnimation(cyclops, 0, 0, 1)); 
  character1.currentAnimation = "stand";

  character2.addAnimation("right", new SpriteAnimation(hat, 0, 0, 9)); 
  character2.addAnimation("left", new SpriteAnimation(hat, 0, 0, 9)); 
  character2.addAnimation("stand", new SpriteAnimation(hat, 0, 0, 1)); 
  character2.currentAnimation = "stand";

  character3.addAnimation("right", new SpriteAnimation(yellow, 0, 0, 9)); 
  character3.addAnimation("left", new SpriteAnimation(yellow, 0, 0, 9)); 
  character3.addAnimation("stand", new SpriteAnimation(yellow, 0, 0, 1)); 
  character3.currentAnimation = "stand";
  
} 

function draw() { 
  background(220); 
  character1.draw();
  character2.draw();
  character3.draw();
} 

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      character1.currentAnimation = "left";
      character2.currentAnimation = "left";
      character3.currentAnimation = "left";
      break;
    case RIGHT_ARROW:
      character1.currentAnimation = "right";
      character2.currentAnimation = "right";
      character3.currentAnimation = "right";
      break;
  }
}

function keyReleased() {
  character1.currentAnimation = "stand"; 
  character2.currentAnimation = "stand"; 
  character3.currentAnimation = "stand"; 
}

class Character {
  constructor(x, y, sprite){
    this.sprite = sprite; 
    this.x = x; 
    this.y = y; 
    this.currentAnimation = null;
    this.animations = {}; 
    this.flip = false;
  }
  
  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation]; 
    if(animation){
      switch(this.currentAnimation)
      {
        case "left":
           this.x -=2;
           this.flip = false;
           break;
        case "right":
           this.x +=2;
           this.flip = true;
           break;
      }
      push();
      if (!this.flip) {
        scale(-1, 1);
        animation.draw(-this.x - 80, this.y);
      } else {
        animation.draw(this.x, this.y);
      }
      translate(this.x, this.y);
      pop();

    }
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