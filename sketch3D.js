new p5(function(p) {
  let bgTexture, bgTextureMain;
  let textures = [];
  let currentIndex = 0;
  let imagePaths = [
    "media/fiona/f1.jpeg", "media/fiona/f2.jpeg", "media/fiona/f3.jpeg", "media/fiona/f4.jpeg",
    "media/fiona/f5.jpeg", "media/fiona/f6.jpeg", "media/fiona/f7.jpeg", "media/fiona/f8.jpeg",
    "media/fiona/f9.jpeg", "media/fiona/f10.jpeg", "media/fiona/f11.jpeg", "media/fiona/f12.jpeg",
    "media/fiona/f13.jpeg", "media/fiona/f14.jpeg", "media/fiona/f15.jpeg", "media/fiona/f16.jpeg",
    "media/fiona/f17.jpeg", "media/fiona/f18.jpeg", "media/fiona/f19.jpeg", "media/fiona/f20.jpeg",
    "media/fiona/f21.jpeg", "media/fiona/f22.jpeg", "media/fiona/f23.jpeg", "media/fiona/f24.jpeg",
    "media/fiona/f25.jpeg", "media/fiona/f26.jpeg", "media/fiona/f27.jpeg", "media/fiona/f28.jpeg"
  ];
  let texturesTata = [];
  let imagePathsTata = [
    "media/other/tata1.jpeg", "media/other/tata2.jpeg",
    "media/other/tata3.jpeg", "media/other/tata4.jpeg",
    "media/other/tata5.jpeg"
  ];
  let texturesOther = [];
  let imagePathsOther = [
    "media/other/birthdayToy.jpeg", "media/other/firstToy.jpeg",
    "media/other/smokeAlarm.jpeg", "media/other/treats.jpeg",
    "media/other/food.jpeg"
  ];
  let rotY = 0;
  let font;
  
  p.preload = function(){
    bgTexture = p.loadImage("media/other/p.jpeg");
    bgTextureMain = p.loadImage("media/other/hearts.jpeg");
    font = p.loadFont("media/other/PlayfairDisplay-VariableFont_wght.ttf")
    
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

    // Hearts BG (smaller sphere)
    p.push();
      p.scale(-1, 1, -1);
      p.texture(bgTextureMain);
      p.sphere(2000);
    p.pop();
    
    // Penny BG (Bigger sphere)
    p.push();
      p.scale(-1, 1, -1);
      p.texture(bgTexture);
      p.sphere(3000);
    p.pop();

    p.textFont(font);
    p.textSize(300);
    p.text('Meet Penny!', -3700, -2000, 500);
    
    // Fiona Images
    p.push();
      p.rotateY(rotY / 2);
      p.texture(textures[currentIndex]);
      p.plane(180, 180);
    p.pop();

    // Tata Images
    p.push();
      p.rotateY(rotY); 
      p.translate(900, 0, 0); 
      p.rotateY(rotY);
      p.texture(texturesTata[0]);
      p.plane(150, 150);
    p.pop();

    p.push();
      p.rotateY(rotY / 2); 
      p.translate(-900, 200, 0); 
      p.rotateY(rotY / 2);
      p.texture(texturesTata[1]);
      p.plane(150, 150);
    p.pop();

    p.push();
      p.rotateY(rotY / 3); 
      p.translate(900, -200, 0); 
      p.rotateY(rotY / 3);
      p.texture(texturesTata[2]);
      p.plane(150, 150);
    p.pop();

    p.push();
      p.rotateY(rotY / 4); 
      p.translate(-900, 400, 0); 
      p.rotateY(rotY / 4);
      p.texture(texturesTata[3]);
      p.plane(150, 150);
    p.pop();

    p.push();
      p.rotateY(rotY / 2); 
      p.translate(900, -400, 0); 
      p.rotateY(rotY / 2);
      p.texture(texturesTata[4]);
      p.plane(150, 150);
    p.pop();

    // Fiona Item Images
    p.push();
      p.translate(-700, 500, -1700); 
      p.rotateY(rotY * 2);
      p.texture(texturesOther[4]);
      p.box(150, 150);
      // p.sphere(100, 10, 10);
    p.pop();

    p.push();
      p.translate(-700, -500, -1700); 
      p.rotateY(rotY * 2);
      p.texture(texturesOther[3]);
      p.box(150, 150);
      // p.sphere(100, 10, 10);
    p.pop();

    p.push();
      p.translate(0, -500, -1700); 
      p.rotateY(rotY * 2);
      p.texture(texturesOther[2]);
      p.box(150, 150);
      // p.sphere(100, 10, 10);
    p.pop();
    
    p.push();
      p.translate(700, -500, -1700); 
      p.rotateY(rotY * 2);
      p.texture(texturesOther[1]);
      p.box(150, 150);
      // p.sphere(100, 10, 10);
    p.pop();
    
    p.push();
      p.translate(700, 500, -1700); 
      p.rotateY(rotY * 2);
      p.texture(texturesOther[0]);
      p.box(150, 150);
      // p.sphere(100, 10, 10);
    p.pop();
    
    rotY += 0.02;
  }

  p.keyPressed = function(){
    if(p.keyCode === p.RIGHT_ARROW) currentIndex = (currentIndex + 1) % textures.length;
    if (p.keyCode === p.LEFT_ARROW) currentIndex = (currentIndex - 1 + textures.length) % textures.length;
  }

  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('sketch3D-canvas').offsetWidth, 500);
  }
  
});