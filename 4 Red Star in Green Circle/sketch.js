function setup() {
  createCanvas(200, 200);
}

function draw() {
  background('#00007F');

  fill('green');
  stroke('white');
  strokeWeight(2);
  circle(101, 98, 100);
  
  fill('red');
  stroke('white');
  strokeWeight(2);
  beginShape();
  vertex(101, 45);
  vertex(89, 82);
  vertex(51, 82);
  vertex(82, 104);
  vertex(71, 141);
  vertex(102, 118);
  vertex(132, 141);
  vertex(120, 104);
  vertex(151, 82);
  vertex(113, 82);
  endShape(CLOSE);
}