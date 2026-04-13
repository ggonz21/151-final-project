let rotX = 0;
let rotY = 0;
let rotZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  orbitControl();

  push();
    fill(40, 50, 70);
    rotateX(rotX);
    rotateY(rotY);
    rotateZ(rotZ);
    box(100);
  pop();

  rotX += 2;
  rotY += 1;
  rotZ += 0.5;
}