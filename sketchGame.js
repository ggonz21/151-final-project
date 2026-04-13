new p5(function(p) {
  p.setup = function() {
    let cnv = p.createCanvas(document.getElementById('game-canvas').offsetWidth, 500);
    cnv.parent('game-canvas');
  }
  p.draw = function() {
    p.background(255);
  }
  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('game-canvas').offsetWidth, 500);
  }
});