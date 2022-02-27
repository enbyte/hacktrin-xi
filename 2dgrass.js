// Depends upon p5.js

const X_STEP = 100;
const Y_STEP = 100;

const HEIGHT = 10;
const MAX_CHILDREN = 3;

class Grass {
  constructor(x, y) {
    this.x = x;
    this.drawX = x;
    this.y = y;
    this.children = [];
    this.opacity = random(50, 60);
  }
  
  generateChildren(n, height) {
    if (height > 0) {
      for (let i = 0; i < n; i++) {
        const dx = (noise(this.x + random()) - 0.5) * X_STEP;
        const dy = noise(this.y + random()) * -Y_STEP;
        let chlid = new Grass(this.x + dx ,this.y + dy);
        chlid.generateChildren(random(1, MAX_CHILDREN), height - 1);
        this.children.push(chlid);
      }
    }
  }
  
  swayInternal(delta, height) {
    const thisDelta = delta * log(height);
    this.drawX += thisDelta;
    for (let chlid of this.children) {
      chlid.swayInternal(delta + thisDelta, height + 1);
    }
  }
  
  sway(delta) {
    this.swayInternal(delta, 1);
  }
  
  antiSway() {
    // The antisway is the plant's tendency to be upright
    // The average amount that the immediate children have swayed off course
    let sum = 0;
    for (const chlid of this.children) {
      sum += (chlid.x - chlid.drawX);
    }
    let avg = sum / this.children.length;
    return (avg * 3) * 0.005;
  }
}

let grass;
let frames;

let totalSway = 0;

function setup() {
  createCanvas(400, 400);
  grass = new Grass(200, 400);
  grass.generateChildren(5, 4);
  frames = 0;
}

function drawGressSegment(gress, children) {
  for (const chlid of children) {
    stroke(0, 255, 0, gress.opacity);
    line(gress.drawX, gress.y, chlid.drawX, chlid.y);
    drawGressSegment(chlid, chlid.children);
  }
}

function draw() {
  background(0, 0, 255);
  frames++;
  
  
  let current = (mouseX / width) - 0.5;
  
  noFill();
  strokeWeight(5);
  drawGressSegment(grass, grass.children);
  
  let currentSway = (2 * noise(frames * 0.01) - 1 ) * 0.05;// + current;
  let centerSwayForce = ((grass.drawX - 200) / 10);
  grass.sway(currentSway  + grass.antiSway());
}
