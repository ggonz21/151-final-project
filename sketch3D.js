new p5(function(p) {
  let bgTexture;
  let textures = [];
  let currentIndex = 0;
  let imagePaths = [
    "media/fiona/f1.jpeg", "media/fiona/f2.jpeg",
    "media/fiona/f3.jpeg", "media/fiona/f4.jpeg",
    "media/fiona/f5.jpeg", "media/fiona/f6.jpeg",
    "media/fiona/f7.jpeg", "media/fiona/f8.jpeg",
    "media/fiona/f9.jpeg", "media/fiona/f10.jpeg",
    "media/fiona/f11.jpeg", "media/fiona/f12.jpeg",
    "media/fiona/f13.jpeg", "media/fiona/f14.jpeg",
    "media/fiona/f15.jpeg", "media/fiona/f16.jpeg",
    "media/fiona/f17.jpeg", "media/fiona/f18.jpeg",
    "media/fiona/f19.jpeg", "media/fiona/f20.jpeg",
    "media/fiona/f21.jpeg", "media/fiona/f22.jpeg",
    "media/fiona/f23.jpeg", "media/fiona/f24.jpeg",
    "media/fiona/f25.jpeg", "media/fiona/f26.jpeg",
    "media/fiona/f27.jpeg", "media/fiona/f28.jpeg"
  ];
  
  p.preload = function(){
    bgTexture = p.loadImage("media/other/p.jpeg");
    
    for(let i = 0; i < imagePaths.length; i++){
      textures.push(p.loadImage(imagePaths[i]));
    }
  }
  
  p.setup = function() {
    let cnv = p.createCanvas(document.getElementById('sketch3D-canvas').offsetWidth, 500, p.WEBGL);
    cnv.parent('sketch3D-canvas');
  }
  
  p.draw = function() {
    p.orbitControl(1,1,0.5);
    
    p.background(0);
    p.noStroke();
    
    p.push();
      p.scale(-1, 1, -1);
      p.texture(bgTexture);
      p.sphere(2000);
    p.pop();
    
    p.texture(textures[currentIndex]);
    p.plane(350, 350);
  }
  
  // Change to left and right arrow keys
  p.mousePressed = function(){
    if (unlocked == false) return;
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      currentIndex = (currentIndex + 1) % textures.length;
      updateCounter();
    }
    return false;
  }

  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('sketch3D-canvas').offsetWidth, 500);
  }
  
  function updateCounter() {
    document.getElementById('sketch3D-counter').textContent =
      (currentIndex + 1) + " / " + textures.length;
  }
  
});