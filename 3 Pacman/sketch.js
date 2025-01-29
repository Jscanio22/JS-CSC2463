function setup() {
  createCanvas(200, 100);
}

function draw() {
  background('#000000');
  fill('yellow');
  arc(53, 50, 80, 80, 3.9, 8.6);

  noStroke()
  fill('#FF0000');
  ellipse(149, 48, 80, 75);

  noStroke();
  fill('#FF0000');
  rect(109, 46, 80, 42);

  noStroke();
  fill('#FFFFFF');
  circle(170, 47, 26);

  noStroke();
  fill('#FFFFFF');
  circle(127, 47, 26);

  noStroke();
  fill('blue');
  circle(127, 47, 14);

  noStroke();
  fill('blue');
  circle(170, 47, 14);
}
