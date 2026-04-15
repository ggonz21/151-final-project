new p5(function(p) {

  // My assets 
  let fionaImg, toyImg, nathanImg, arrowImg;
  let bedroomImg, outsideImg, sleepImg, basementImg;
  let barkSound, meowSound;

  // Scenes will be names instead of numbers (had a hard time last project): 
  // 'start', 'bedroom', 'window_game', 'toy_game', 'sleep', 'basement', 'end'
  let scene = 'start'; // change to start
  let player = {x: 300, y: 350, speed: 3, w: 100, h: 120 }; // Player (AKA Fiona)

  // Minigame states
  let windowDone = false; 
  let toyDone = false; 

  // Interaction zones
  let windowZone = { x: 330, y: 60, w: 120, h: 130 }; // Window
  let toyZone = { x: 80, y: 300, w: 70, h: 70 };
  let bedZone = { x: 0, y: 340, w: 80, h: 70 };

  // Textboxes
  let textboxVisible = false;
  let textboxLines = [];

  // Window minigame: Clicking Nathan 10 times under time limit 
  let nathan = { x: 200, y: 150, w: 80, h: 40 };
  let nathanClicks = 0;
  let nathanNeeded = 10;
  let windowTimer = 15;
  let windowTimerStart = 0;
  let windowResult = '';

  // Toy minigame: Toy randomly moves, catch 5 times under tie limit (adjust?)
  let toyMoving = { x: 200, y: 200, w: 60, h: 60 };
  let toySpeed = { x: 2.5, y: 2 };
  let toyCatches = 0;
  let toyNeeded = 5;
  let toyTimer = 15;
  let toyTimerStart = 0;
  let toyResult = '';

  // Sleep animation after minigames
  let sleepProgress = 0;
  let sleepDone = false;
  let sleepTextVisible = false;
  let arrowVisible = false;
  
  // Arrow for user to go to see basement door
  let arrow = { x: 0, y: 0, w: 70, h: 50 };

  // Basement door after sleep animation
  let basementDoor = { x: 160, y: 80, w: 110, h: 320 };
  let meowPlayed = false;
  let basementArrow = false;

  // PRELOAD
  p.preload = function() {
    fionaImg = p.loadImage("media/game/fiona.png");
    toyImg = p.loadImage('media/game/toy.png');
    nathanImg = p.loadImage('media/game/nathan.png');
    arrowImg = p.loadImage('media/game/arrow.png');
    bedroomImg = p.loadImage('media/game/bedroom.jpeg');
    outsideImg = p.loadImage('media/game/outside.jpeg');
    sleepImg = p.loadImage('media/game/sleep.jpeg');
    basementImg = p.loadImage('media/game/basement.jpeg');

    barkSound = p.loadSound('media/game/bark.mp3');
    meowSound = p.loadSound('media/game/meow.mp3');
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
    else if (scene === 'window_game') drawWindowGame();
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
    p.text("click to start", p.width / 2, 340);
  }

  // SCENE: BEDROOM
    function drawBedroom() {
    p.image(bedroomImg, 0, 0, p.width, p.height);

    handleMovement();

    // Window zone
    if (!windowDone) {
      p.noFill();
      p.noStroke();
      // p.stroke(255, 0, 0);
      // p.strokeWeight(2);
      p.rect(windowZone.x, windowZone.y, windowZone.w, windowZone.h);
    }

    // Toy zone
    if (!toyDone) {
      p.noFill();
      p.noStroke();
      // p.stroke(255, 0, 0);
      // p.strokeWeight(2);
      p.rect(toyZone.x, toyZone.y, toyZone.w, toyZone.h);
      p.image(toyImg, toyZone.x, toyZone.y, toyZone.w, toyZone.h);
    }

    // Bed zone (available only after both minigames have been done)
    if (windowDone && toyDone) {
      p.noFill();
      p.noStroke();
      // p.stroke(255, 0, 0);
      // p.strokeWeight(2);
      p.rect(bedZone.x, bedZone.y, bedZone.w, bedZone.h);
    }

    // Draw Fiona
    p.image(fionaImg, player.x, player.y, player.w, player.h);

    // Check interactions
    if (!windowDone && overlaps(player, windowZone)) {
      startWindowGame();
      return;
    }
    if (!toyDone && overlaps(player, toyZone)) {
      startToyGame();
      return;
    }
    if (windowDone && toyDone && overlaps(player, bedZone)) {
      scene = 'sleep';
      sleepProgress = 0;
      sleepDone = false;
      sleepTextVisible = false;
      arrowVisible = false;
      textboxVisible = false;
      return;
    }

    if (textboxVisible) drawTextbox(textboxLines);
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

    if (remaining <= 0 && windowResult === '') {
      windowResult = 'fail';
    }

    if (windowResult === '') {
      p.image(nathanImg, nathan.x, nathan.y, nathan.w, nathan.h);
    }

    // Time and Score
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
      if (toyMoving.x < 0 || toyMoving.x > p.width - toyMoving.w)  toySpeed.x *= -1;
      if (toyMoving.y < 0 || toyMoving.y > p.height - toyMoving.h - 60) toySpeed.y *= -1;

      // Toy 
      p.noFill();
      p.noStroke();
      p.rect(toyMoving.x, toyMoving.y, toyMoving.w, toyMoving.h);
      p.image(toyImg, toyMoving.x, toyMoving.y, toyMoving.w, toyMoving.h);

      // Player (AKA Fiona)
      handleMovement();
      p.image(fionaImg, player.x, player.y, player.w, player.h);

      // Check catch
      if (overlaps(player, toyMoving)) {
        toyCatches++;
        if (toyCatches >= toyNeeded) toyResult = 'win';
        else {
          toyMoving.x = p.random(50, p.width - 100);
          toyMoving.y = p.random(50, p.height - 150);
        }
      }
    }

    // Time and Score
    p.noStroke();
    p.fill(255);
    p.rect(0, 0, 140, 60);
    p.fill(237, 119, 192);
    p.textSize(20);
    p.textAlign(p.LEFT);
    p.text("Catches: " + toyCatches + " / " + toyNeeded, 12, 24);
    p.text("Time: " + p.nf(remaining, 1, 1) + "s", 12, 44);

    if (toyResult === 'fail') drawOverlay("Fiona missed the toy! Try again?", true);
    else if (toyResult === 'win') drawOverlay("Fiona got it! Click to continue.", false);
  }

  // SCENE: SLEEP CUTSCENE (Mini Animation)
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
    } else {
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

    if (arrowVisible) {
      p.image(arrowImg, arrow.x, arrow.y, arrow.w, arrow.h);
    }
  }

//   // ============================================================
//   // SCENE: BASEMENT
//   // ============================================================
//   function drawBasement() {
//     p.image(basementImg, 0, 0, p.width, p.height);

//     handleMovement();

//     p.noFill();
//     p.stroke(255, 0, 0);
//     p.strokeWeight(2);
//     p.rect(basementDoor.x, basementDoor.y, basementDoor.w, basementDoor.h);

//     p.image(fionaImg, player.x, player.y, player.w, player.h);

//     if (!meowPlayed && overlaps(player, basementDoor)) {
//       meowPlayed = true;
//       meowSound.play();
//       basementArrow = true;
//       arrow.x = p.width - 90;
//       arrow.y = p.height / 2 - 25;
//     }

//     if (basementArrow) {
//       p.image(arrowImg, arrow.x, arrow.y, arrow.w, arrow.h);
//     }
//   }

//   // ============================================================
//   // SCENE: END
//   // ============================================================
//   function drawEnd() {
//     p.background(0);
//     p.textAlign(p.CENTER);
//     p.noStroke();

//     p.textFont('Brush Script MT');
//     p.textSize(80);
//     p.fill(247, 197, 213);
//     // PLACEHOLDER — replace with your final screen text
//     p.text("Penny", p.width / 2, p.height / 2 - 20);

//     p.textFont('Georgia');
//     p.textSize(13);
//     p.fill(180);
//     p.text("click to play again", p.width / 2, p.height / 2 + 50);
//   }

//   // ============================================================
//   // HELPERS
//   // ============================================================

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
    for (let i = 0; i < lines.length; i++) {
      p.text(lines[i], 16, p.height - 68 + i * 22);
    }
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
    resetPlayer();
  }

  // INPUT
  p.mousePressed = function() {

    // START
    if (scene === 'start') {
      scene = 'bedroom';
      resetPlayer();
      textboxVisible = true;
      // PLACEHOLDER — bedroom intro text
      textboxLines = [
        "Fiona wakes up in the bedroom.",
        "She contemplates on what to do first. Bark at the strangers who are lurking outside, waiting to break into her home, or play with her toys because she deserves the break?",
        "Use WASD to move."
      ];
      return false;
    }

    // END — restart
    if (scene === 'end') {
      resetGame();
      return false;
    }

    // WINDOW MINIGAME — click Nathan
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

    // WINDOW MINIGAME — retry or continue
    if (scene === 'window_game' && windowResult !== '') {
      if (windowResult === 'fail') {startWindowGame();} else {
        windowDone = true;
        scene = 'bedroom';
        resetPlayer();
        textboxVisible = true;
        textboxLines = [
          "Fiona barked at every stranger outside! No one is breaking in today, especially not Nathan",
        ];
      }
      return false;
    }

    // TOY MINIGAME — retry or continue
    if (scene === 'toy_game' && toyResult !== '') {
      if (toyResult === 'fail') startToyGame();
      else {
        toyDone = true;
        scene = 'bedroom';
        resetPlayer();
        textboxVisible = true;
        textboxLines = [
          "Fiona had a great time playing, nothing beats the thrill of the chase."
        ];
      }
      return false;
    }

    // SLEEP ANIMATION — click arrow
    if (scene === 'sleep_anim' && arrowVisible) {
      if (p.mouseX > arrow.x && p.mouseX < arrow.x + arrow.w &&
          p.mouseY > arrow.y && p.mouseY < arrow.y + arrow.h) {
        scene = 'basement';
        meowPlayed = false;
        basementArrow = false;
        resetPlayer();
      }
      return false;
    }

    // BASEMENT — click arrow to end
    if (scene === 'basement' && basementArrow) {
      if (p.mouseX > arrow.x && p.mouseX < arrow.x + arrow.w &&
          p.mouseY > arrow.y && p.mouseY < arrow.y + arrow.h) {
        scene = 'end';
      }
      return false;
    }

    return false;
  }

  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('game-canvas').offsetWidth, 500);
  }

});