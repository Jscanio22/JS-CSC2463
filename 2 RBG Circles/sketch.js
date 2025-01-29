function setup() {
  createCanvas(200, 200);
}

function draw() {
background(255);
colorMode(HSB);
let blue = color(229 , 75, 100, 0.5);
let green = color(120, 62, 100, 0.5);
let red = color(0, 72, 100, 0.5);

  push();
  fill(green);
  noStroke();
  translate(132, 128);
  circle(0, 0, 100);
  pop();  

  push();
  fill(red);
  noStroke();
  translate(100, 72);
  circle(0, 0, 100);
  pop();

  push();
  fill(blue);
  noStroke();
  translate(64, 128);
  circle(0, 0, 100);
  pop();

}
