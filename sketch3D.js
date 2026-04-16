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

  let texturesTata = [];
  let currentIndexTata = 0;
  let imagePathsTata = [
    "media/other/tata1.jpeg", "media/other/tata2.jpeg",
    "media/other/tata3.jpeg", "media/other/tata4.jpeg",
    "media/other/tata5.jpeg"
  ];

  let texturesOther = [];
  let currentIndexOther = 0;
  let imagePathsOther = [
    "media/other/birthdayToy.jpeg", "media/other/firstToy.jpeg",
    "media/other/smokeAlarm.jpeg", "media/other/treats.jpeg",
    "media/other/food.jpeg"
  ];
  
  p.preload = function(){
    bgTexture = p.loadImage("media/other/p.jpeg");
    
    for(let i = 0; i < imagePaths.length; i++){
      textures.push(p.loadImage(imagePaths[i]));
    }

    for(let i = 0; i < imagePathsTata.length; i++){ // Tata and other have same length
      texturesTata.push(p.loadImage(imagePathsTata[i]));
      texturesOther.push(p.loadImage(imagePathsOther[i]));
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

  p.keyPressed = function(){
    if(p.keyCode === p.RIGHT_ARROW) {
      currentIndex = (currentIndex + 1) % textures.length;
    }

    if (p.keyCode === p.LEFT_ARROW) {
      currentIndex = (currentIndex - 1 + textures.length) % textures.length;
    }
  }

  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('sketch3D-canvas').offsetWidth, 500);
  }
  
});