new p5(function(p) {

  // My assets 
  let fionaImg, toyImg, nathanImg, arrowImg;
  let bedroomImg, outsideImg, sleepImg, basementImg;
  let barkSound, meowSound, squeakSound;
  let fionaPhotos = [];
  let photoSprites = [];
  let photosPerScene = 3;
  let imagePaths = [
    "media/fiona/f1.jpeg", "media/fiona/f2.jpeg", "media/fiona/f3.jpeg", "media/fiona/f4.jpeg",
    "media/fiona/f5.jpeg", "media/fiona/f6.jpeg", "media/fiona/f7.jpeg", "media/fiona/f8.jpeg",
    "media/fiona/f9.jpeg", "media/fiona/f10.jpeg", "media/fiona/f11.jpeg", "media/fiona/f12.jpeg",
    "media/fiona/f13.jpeg", "media/fiona/f14.jpeg", "media/fiona/f15.jpeg", "media/fiona/f16.jpeg",
    "media/fiona/f17.jpeg", "media/fiona/f18.jpeg", "media/fiona/f19.jpeg", "media/fiona/f20.jpeg",
    "media/fiona/f21.jpeg", "media/fiona/f22.jpeg", "media/fiona/f23.jpeg", "media/fiona/f24.jpeg",
    "media/fiona/f25.jpeg", "media/fiona/f26.jpeg", "media/fiona/f27.jpeg", "media/fiona/f28.jpeg"
  ];

  // Scenes: 'start', 'bedroom', 'window_intro', 'window_game', toy_intro', 'toy_game', 'sleep', 'basement', 'end'
  let scene = 'start';
  let player = { x: 300, y: 350, speed: 3, w: 100, h: 120 };

  // Minigame states
  let windowDone = false;
  let toyDone = false;
  let bothDoneTextShown = false;

  // Interaction zones
  let windowZone = { x: 330, y: 60,  w: 120, h: 130 };
  let toyZone = { x: 80,  y: 300, w: 70,  h: 70  };
  let bedZone = { x: 0,   y: 340, w: 80,  h: 70  };
  let basementDoor = { x: 130, y: 50,  w: 150, h: 320 };

  // Textboxes
  let textboxVisible = false;
  let textboxLines = [];
  let textboxIndex = 0;

  // Window minigame
  let nathan = { x: 200, y: 150, w: 80, h: 40 };
  let nathanClicks = 0;
  let nathanNeeded = 10;
  let windowTimer = 15;
  let windowTimerStart = 0;
  let windowResult = '';

  // Toy minigame
  let toyMoving = { x: 200, y: 200, w: 60, h: 60 };
  let toySpeed = { x: 2.5, y: 2 };
  let toyCatches = 0;
  let toyNeeded = 5;
  let toyTimer = 15;
  let toyTimerStart = 0;
  let toyResult = '';

  // Sleep animation
  let sleepProgress = 0;
  let sleepDone = false;
  let sleepTextVisible = false;
  let arrowVisible = false;

  let arrow = { x: 0, y: 0, w: 70, h: 50 };
  let basementIntroShown = false;

  let meowPlayed = false;
  let basementArrow = false;


  // PRELOAD
  p.preload = function() {
    fionaImg = p.loadImage('media/game/fiona.png');
    toyImg = p.loadImage('media/game/toy.png');
    nathanImg = p.loadImage('media/game/nathan.png');
    arrowImg = p.loadImage('media/game/arrow.png');
    bedroomImg = p.loadImage('media/game/bedroom.jpeg');
    outsideImg = p.loadImage('media/game/outside.jpeg');
    sleepImg = p.loadImage('media/game/sleep.jpeg');
    basementImg = p.loadImage('media/game/basement.jpeg');

    barkSound = p.loadSound('media/game/bark.mp3');
    meowSound = p.loadSound('media/game/meow.mp3');
    squeakSound = p.loadSound('media/game/squeak.mp3');

    for (let i = 0; i < imagePaths.length; i++) {
      fionaPhotos.push(p.loadImage(imagePaths[i]));
    }
  }


  // SETUP
  p.setup = function() {
    let cnv = p.createCanvas(document.getElementById('game-canvas').offsetWidth, 500);
    cnv.parent('game-canvas');
  }


  // MAIN DRAW
  p.draw = function() {
    if (scene === 'start') drawStart();
    else if (scene === 'bedroom') drawBedroom();
    else if (scene === 'window_intro') drawWindowIntro();
    else if (scene === 'window_game') drawWindowGame();
    else if (scene === 'toy_intro') drawToyIntro();
    else if (scene === 'toy_game') drawToyGame();
    else if (scene === 'sleep') drawSleepAnim();
    else if (scene === 'basement') drawBasement();
    else if (scene === 'end') drawEnd();
  }


  // SCENE: START
  function drawStart() {
    p.background(184, 224, 252);
    p.textAlign(p.CENTER);
    p.textStyle(p.NORMAL);

    p.textFont('Brush Script MT');
    p.textSize(54);
    p.fill(247, 197, 213);
    p.stroke(0);
    p.text("A Day in the Life of Fiona", p.width / 2, 170);

    p.image(fionaImg, p.width / 2 - 40, 200, 80, 80);

    p.textFont('Georgia');
    p.textSize(15);
    p.fill(43, 74, 122);
    p.noStroke();
    p.text("click to start", p.width / 2, 340);
    textboxIndex = 0;
  }


  // SCENE: BEDROOM
  function drawBedroom() {
    p.image(bedroomImg, 0, 0, p.width, p.height);
    drawGhostPhotos();
    handleMovement();

    if (!windowDone) {
      p.noFill(); 
      p.noStroke();
      p.rect(windowZone.x, windowZone.y, windowZone.w, windowZone.h);
    }
    if (!toyDone) {
      p.noFill(); 
      p.noStroke();
      p.rect(toyZone.x, toyZone.y, toyZone.w, toyZone.h);
      p.image(toyImg, toyZone.x, toyZone.y, toyZone.w, toyZone.h);
    }
    if (windowDone && toyDone) {
      p.noFill(); 
      p.noStroke();
      p.rect(bedZone.x, bedZone.y, bedZone.w, bedZone.h);
    }
    
    p.image(fionaImg, player.x, player.y, player.w, player.h);

    if (!windowDone && overlaps(player, windowZone)) {
      scene = 'window_intro';
      return;
    }
    if (!toyDone && overlaps(player, toyZone)) {
      scene = 'toy_intro';
      return;
    }

    if (windowDone && toyDone) {
      if (!bothDoneTextShown) {
        bothDoneTextShown = true;
        textboxVisible = true;
        textboxLines = [
          "Fiona feels as though she has done a wonderful job.",
          "She is quite tired, after all, she's on call 24/7",
          "Maybe a nap in her bed would do her good before her next shift"
        ];
        textboxIndex = 0;
      }
      if (!textboxVisible && overlaps(player, bedZone)) {
        scene = 'sleep';
        sleepProgress = 0;
        sleepDone = false;
        sleepTextVisible = false;
        arrowVisible = false;
        return;
      }
    }

    if (textboxVisible) drawTextbox(textboxLines);
  }


  // SCENE: WINDOW INTRO
  function drawWindowIntro() {
    p.image(outsideImg, 0, 0, p.width, p.height);

    p.noStroke();
    p.fill(0, 0, 0, 150);
    p.rect(0, 0, p.width, p.height);

    p.textAlign(p.CENTER);
    p.noStroke();

    p.textFont('Brush Script MT');
    p.textSize(36);
    p.fill(247, 197, 213);
    p.text("Bark at the Strangers!", p.width / 2, 130);

    p.textFont('Georgia');
    p.textSize(14);
    p.fill(255);

    let lines = [
      "Strangers are lurking outside the window!",
      "Click on Nathan to bark at him — he'll move each time.",
      `Bark ${nathanNeeded} times before the ${windowTimer} second timer runs out.`
    ];

    for (let i = 0; i < lines.length; i++) {
      p.text(lines[i], p.width / 2, 200 + i * 30);
    }

    p.fill(184, 224, 252);
    p.textSize(13);
    p.text("click anywhere to start", p.width / 2, 340);
  }


  // SCENE: TOY INTRO
  function drawToyIntro() {
    p.image(bedroomImg, 0, 0, p.width, p.height);

    p.noStroke();
    p.fill(0, 0, 0, 150);
    p.rect(0, 0, p.width, p.height);

    p.textAlign(p.CENTER);
    p.noStroke();

    p.textFont('Brush Script MT');
    p.textSize(36);
    p.fill(247, 197, 213);
    p.text("Toy Training Time!", p.width / 2, 130);

    p.textFont('Georgia');
    p.textSize(14);
    p.fill(255);

    let lines = [
      "Fiona's toy is bouncing around the room!",
      "Use W A S D to move Fiona and chase it down.",
      `Catch it 5 times before the 15 second timer runs out.`
    ];

    for (let i = 0; i < lines.length; i++) {
      p.text(lines[i], p.width / 2, 200 + i * 30);
    }

    p.fill(184, 224, 252);
    p.textSize(13);
    p.text("click anywhere to start", p.width / 2, 340);
  }


  // SCENE: WINDOW MINIGAME
  function startWindowGame() {
    scene = 'window_game';
    nathanClicks = 0;
    windowResult = '';
    windowTimerStart = p.millis();
    randomizeNathan();
    textboxVisible = false;
  }

  function drawWindowGame() {
    p.image(outsideImg, 0, 0, p.width, p.height);

    let elapsed = (p.millis() - windowTimerStart) / 1000;
    let remaining = p.max(0, windowTimer - elapsed);

    if (remaining <= 0 && windowResult === '') windowResult = 'fail';
    if (windowResult === '') p.image(nathanImg, nathan.x, nathan.y, nathan.w, nathan.h);

    p.noStroke();
    p.fill(255);
    p.rect(0, 0, 140, 60);
    p.fill(237, 119, 192);
    p.textSize(20);
    p.textAlign(p.LEFT);
    p.text("Barks: " + nathanClicks + " / " + nathanNeeded, 12, 24);
    p.text("Time: " + p.nf(remaining, 1, 1) + "s", 12, 44);

    if (windowResult === 'fail') drawOverlay("Fiona missed them! Try again?", true);
    else if (windowResult === 'win') drawOverlay("Fiona did amazing! Click to continue.", false);
  }

  function randomizeNathan() {
    nathan.x = p.random(20, p.width - nathan.w - 20);
    nathan.y = p.random(20, p.height - nathan.h - 100);
  }


  // SCENE: TOY MINIGAME
  function startToyGame() {
    scene = 'toy_game';
    toyCatches = 0;
    toyResult = '';
    toyTimerStart = p.millis();
    toyMoving.x = p.random(50, p.width - 100);
    toyMoving.y = p.random(50, p.height - 150);
    textboxVisible = false;
  }

  function drawToyGame() {
    p.image(bedroomImg, 0, 0, p.width, p.height);

    let elapsed = (p.millis() - toyTimerStart) / 1000;
    let remaining = p.max(0, toyTimer - elapsed);

    if (remaining <= 0 && toyResult === '') toyResult = 'fail';

    if (toyResult === '') {
      toyMoving.x += toySpeed.x;
      toyMoving.y += toySpeed.y;
      if (toyMoving.x < 0 || toyMoving.x > p.width - toyMoving.w) toySpeed.x *= -1;
      if (toyMoving.y < 0 || toyMoving.y > p.height - toyMoving.h - 60) toySpeed.y *= -1;

      p.noFill(); p.noStroke();
      p.rect(toyMoving.x, toyMoving.y, toyMoving.w, toyMoving.h);
      p.image(toyImg, toyMoving.x, toyMoving.y, toyMoving.w, toyMoving.h);

      handleMovement();
      p.image(fionaImg, player.x, player.y, player.w, player.h);

      if (overlaps(player, toyMoving)) {
        toyCatches++;
        squeakSound.play();
        if (toyCatches >= toyNeeded) toyResult = 'win';
        else {
          toyMoving.x = p.random(50, p.width - 100);
          toyMoving.y = p.random(50, p.height - 150);
        }
      }
    }

    p.noStroke();
    p.fill(255);
    p.rect(0, 0, 140, 60);
    p.fill(237, 119, 192);
    p.textSize(20);
    p.textAlign(p.LEFT);
    p.text("Catches: " + toyCatches + " / " + toyNeeded, 12, 24);
    p.text("Time: " + p.nf(remaining, 1, 1) + "s", 12, 44);

    if (toyResult === 'fail') drawOverlay("Fiona didn't complete her training...", true);
    else if (toyResult === 'win') drawOverlay("Fiona got it done! Click to continue.", false);
  }


  // SCENE: SLEEP
  function drawSleepAnim() {
    p.image(sleepImg, 0, 0, p.width, p.height);

    if (!sleepDone) {
      sleepProgress = p.min(sleepProgress + 0.008, 1);
      let barH = (p.height / 2) * sleepProgress;
      p.noStroke();
      p.fill(0);
      p.rect(0, 0, p.width, barH);
      p.rect(0, p.height - barH, p.width, barH);
      if (sleepProgress >= 1) {
        sleepDone = true;
        sleepTextVisible = true;
      }
    } 
    else {
      p.background(0);
      if (sleepTextVisible) {
        p.textAlign(p.CENTER);
        p.noStroke();
        p.fill(255);
        p.textSize(16);
        p.text("Fiona drifts off to sleep...", p.width / 2, p.height / 2 - 30);
        p.text("But there is a smell in the air she doesn't recognize. An intruder?!", p.width / 2, p.height / 2);
        if (!arrowVisible) {
          arrowVisible = true;
          arrow.x = p.width / 2 - 35;
          arrow.y = p.height / 2 + 40;
        }
      }
    }

    if (arrowVisible) p.image(arrowImg, arrow.x, arrow.y, arrow.w, arrow.h);
  }


  // SCENE: BASEMENT
  function drawBasement() {
    p.image(basementImg, 0, 0, p.width, p.height);
    drawGhostPhotos();

    if (!basementIntroShown) {
      basementIntroShown = true;
      textboxVisible = true;
      textboxLines = ["Fiona smells the intruder in the basement."];
      textboxIndex = 0;
    }

    handleMovement();

    p.noFill(); p.noStroke();
    p.rect(basementDoor.x, basementDoor.y, basementDoor.w, basementDoor.h);

    p.image(fionaImg, player.x, player.y, player.w, player.h);

    if (!meowPlayed && !textboxVisible && overlaps(player, basementDoor)) {
      meowPlayed = true;
      meowSound.play();
      arrow.x = p.width - 90;
      arrow.y = p.height / 2 - 25;
      textboxVisible = true;
      textboxLines = ["Fiona's feeder human spoke to her: 'Fiona, did you find Penny already?'"];
      textboxIndex = 0;
    }

    if (!textboxVisible && meowPlayed) p.image(arrowImg, arrow.x, arrow.y, arrow.w, arrow.h);
    if (textboxVisible) drawTextbox(textboxLines);
  }


  // SCENE: END
  function drawEnd() {
    p.background(0);
    p.textAlign(p.CENTER);
    p.noStroke();

    p.textFont('Brush Script MT');
    p.textSize(80);
    p.fill(247, 197, 213);
    p.text("Fiona did not know what a Penny was", p.width / 2, p.height / 2 - 20);

    p.textFont('Georgia');
    p.textSize(13);
    p.fill(180);
    p.text("click to play again", p.width / 2, p.height / 2 + 50);
  }


  // GHOST PHOTOS
  function spawnGhostPhotos() {
    photoSprites = [];
    for (let i = 0; i < photosPerScene; i++) {
      photoSprites.push({
        img: fionaPhotos[Math.floor(Math.random() * fionaPhotos.length)],
        x:   p.random(10, p.width  - 90),
        y:   p.random(10, p.height - 190)
      });
    }
  }

  function drawGhostPhotos() {
    p.tint(255, 30);
    for (let s of photoSprites) {
      p.image(s.img, s.x, s.y, 80, 80);
    }
    p.noTint();
  }


  // HELPERS
  function handleMovement() {
    if (p.keyIsDown(65)) player.x -= player.speed;
    if (p.keyIsDown(68)) player.x += player.speed;
    if (p.keyIsDown(87)) player.y -= player.speed;
    if (p.keyIsDown(83)) player.y += player.speed;

    player.x = p.constrain(player.x, 0, p.width - player.w);
    player.y = p.constrain(player.y, 0, p.height - player.h);
  }

  function overlaps(a, b) {
    return a.x < b.x + b.w && 
           a.x + a.w > b.x &&
           a.y < b.y + b.h && 
           a.y + a.h > b.y;
  }

  function drawTextbox(lines) {
    p.noStroke();
    p.fill(0, 0, 0, 170);
    p.rect(0, p.height - 90, p.width, 90);
    p.fill(255);
    p.textSize(13);
    p.textAlign(p.LEFT);
    p.text(lines[textboxIndex], 16, p.height - 68);
    p.fill(180);
    p.textSize(11);
    p.text("[ space to continue ]", 16, p.height - 18);
  }

  function drawOverlay(msg, canRetry) {
    p.noStroke();
    p.fill(0, 0, 0, 180);
    p.rect(0, 0, p.width, p.height);
    p.fill(255);
    p.textAlign(p.CENTER);
    p.textSize(18);
    p.text(msg, p.width / 2, p.height / 2 - 20);
    p.textSize(14);
    p.fill(canRetry ? p.color(247, 197, 213) : p.color(184, 224, 252));
    p.text("[ click to " + (canRetry ? "try again" : "continue") + " ]",
      p.width / 2, p.height / 2 + 20);
  }

  function resetPlayer() {
    player.x = 300;
    player.y = 350;
  }

  function resetGame() {
    scene = 'start';
    windowDone = false;
    toyDone = false;
    meowPlayed = false;
    basementArrow = false;
    arrowVisible = false;
    textboxVisible = false;
    sleepProgress = 0;
    sleepDone = false;
    basementIntroShown = false;
    bothDoneTextShown = false;
    photoSprites = [];
    resetPlayer();
  }


  // INPUT
  p.mousePressed = function() {

    if (scene === 'start') {
      scene = 'bedroom';
      resetPlayer();
      spawnGhostPhotos();
      textboxVisible = true;
      textboxLines = [
        "Fiona wakes up in the bedroom.",
        "She contemplates on what to do first. Bark at the strangers who are lurking outside, waiting to break into her home",
        "or play with her toys because she needs to train?",
        "Use WASD to move."
      ];
      textboxIndex = 0;
      return false;
    }

    if (scene === 'end') {
      resetGame();
      return false;
    }
    if (scene === 'window_intro') {
      startWindowGame();
      return false;
    }
    if (scene === 'toy_intro') {
      startToyGame();
      return false;
    }

    if (scene === 'window_game' && windowResult === '') {
      if (p.mouseX > nathan.x && p.mouseX < nathan.x + nathan.w &&
          p.mouseY > nathan.y && p.mouseY < nathan.y + nathan.h) {
        barkSound.play();
        nathanClicks++;
        if (nathanClicks >= nathanNeeded) windowResult = 'win';
        else randomizeNathan();
      }
      return false;
    }

    if (scene === 'window_game' && windowResult !== '') {
      if (windowResult === 'fail') startWindowGame();
      else {
        windowDone = true;
        scene = 'bedroom';
        resetPlayer();
        textboxVisible = true;
        textboxLines = ["Fiona barked at every stranger outside! No one is breaking in today, especially not Nathan"];
        textboxIndex = 0;
      }
      return false;
    }

    if (scene === 'toy_game' && toyResult !== '') {
      if (toyResult === 'fail') startToyGame();
      else {
        toyDone = true;
        scene = 'bedroom';
        resetPlayer();
        textboxVisible = true;
        textboxLines = [
          "Fiona had a great time playing, err, she meant training",
          "She was for sure training.",
          "What is there next to do?"
        ];
        textboxIndex = 0;
      }
      return false;
    }

    if (scene === 'sleep' && arrowVisible) {
      if (p.mouseX > arrow.x && p.mouseX < arrow.x + arrow.w &&
          p.mouseY > arrow.y && p.mouseY < arrow.y + arrow.h) {
        scene = 'basement';
        meowPlayed = false;
        basementArrow = false;
        spawnGhostPhotos();
        resetPlayer();
      }
      return false;
    }

    if (scene === 'basement' && meowPlayed && !textboxVisible) {
      if (p.mouseX > arrow.x && p.mouseX < arrow.x + arrow.w &&
          p.mouseY > arrow.y && p.mouseY < arrow.y + arrow.h) {
        scene = 'end';
      }
      return false;
    }

    return false;
  }

  p.keyPressed = function() {
    if (p.key === ' ' && textboxVisible) {
      textboxIndex++;
      if (textboxIndex >= textboxLines.length) {
        textboxVisible = false;
        textboxIndex = 0;
      }
      return false;
    }
  }

  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('game-canvas').offsetWidth, 500);
  }

});