let isDrawing = false;
let DrawingColor;

function setup() {
  canvas = createCanvas(600, 350);
  background(255);
  DrawingColor = color(0, 255, 0, 255);
}

function mousePressed() {
//Red is Choosen
  if (mouseX > 13 && mouseX < 13 + 31 && 
    mouseY > 10 && mouseY < 10 + 31) {
      DrawingColor = color(255, 0, 0, 255);
    }
//Orange is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 43 && mouseY < 43 + 31) {
    DrawingColor = color(255, 175, 56, 255);
  }
//Yellow is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 77 && mouseY < 77 + 31) {
    DrawingColor = color(255, 248, 56, 255);
  }
//Green is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 110 && mouseY < 110 + 31) {
    DrawingColor = color(62, 249, 0, 255);
  }
//Cyan is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 143 && mouseY < 143 + 31) {
    DrawingColor = color(56, 222, 255, 255);
  }
//Blue is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 176 && mouseY < 176 + 31) {
    DrawingColor = color(51, 0, 255, 255);
  }
//Purple is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 210 && mouseY < 210 + 31) {
    DrawingColor = color(255, 0, 255, 255);
  }
//Brown is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 243 && mouseY < 243 + 31) {
    DrawingColor = color(139, 76, 49, 255);
  }
//White is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 276 && mouseY < 276 + 31) {
    DrawingColor = color(255, 255, 255, 255);
  }
//Black is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 309 && mouseY < 309 + 31) {
    DrawingColor = color(0, 0, 0, 255);
  }

//Draw when pressed
  console.log()
  isDrawing = true; 
}

function mouseReleased() {

  isDrawing = false; 
}

function draw() {
  if (isDrawing) {
    stroke(DrawingColor);
    strokeWeight(5);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
//red
  push();
  noStroke();
  fill(255, 0, 0, 255);
  square(13, 10, 31);
  pop();
//orange
  push();
  noStroke();
  fill(255, 175, 56, 255);
  square(13, 43, 31);
  pop();
//yellow
  push();
  noStroke();
  fill(255, 248, 56, 255);
  square(13, 77, 31);
  pop();
//green
  push();
  noStroke();
  fill(62, 249, 0, 255);
  square(13, 110, 31);
  pop();
//cyan
  push();
  noStroke();
  fill(56, 222, 255, 255);
  square(13, 143, 31);
  pop();
//blue
  push();
  noStroke();
  fill(51, 0, 255, 255);
  square(13, 176, 31);
  pop();
//purple
  push();
  noStroke();
  fill(255, 0, 255, 255);
  square(13, 210, 31);
  pop();
//brown
  push();
  noStroke();
  fill(139, 76, 49, 255);
  square(13, 243, 31);
  pop();
//white
  push();
  stroke(214, 214, 214, 255);
  strokeWeight(1);
  fill(255, 255, 255, 255);
  square(13, 276, 31);
  pop();
//black
  push();
  noStroke();
  fill(0, 0, 0, 255);
  square(13, 309, 31);
  pop();
}
  