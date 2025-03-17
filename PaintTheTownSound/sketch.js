let isDrawing = false;
let DrawingColor;
let backgroundMusic, startPaintingSynth, interactionSynth, blockSound, speed;
let filt, rev, del, Envelope1, lfo;
let loop, musicPattern, melodyNotes, popSound;
let melody = false;
let toneInitialized = false;
let musicPatternStarted = false;
let block = false;
let newMelody = ["F4", "A4", "C5"];

function setup() {
  canvas = createCanvas(600, 350);
  background(255);
  DrawingColor = color(0, 255, 0, 255);
}

function draw() {
  if (isDrawing) {
    stroke(DrawingColor);
    strokeWeight(5);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

  fill(0);
  textSize(16);
  text("Press C to clear!", 420, 340);

//red
  push();
  noStroke();
  fill(255, 0, 0, 255);
  square(13, 10, 31);
  pop();
//orange
  push();
  noStroke();
  fill(255, 175, 56, 255);
  square(13, 43, 31);
  pop();
//yellow
  push();
  noStroke();
  fill(255, 248, 56, 255);
  square(13, 77, 31);
  pop();
//green
  push();
  noStroke();
  fill(62, 249, 0, 255);
  square(13, 110, 31);
  pop();
//cyan
  push();
  noStroke();
  fill(56, 222, 255, 255);
  square(13, 143, 31);
  pop();
//blue
  push();
  noStroke();
  fill(51, 0, 255, 255);
  square(13, 176, 31);
  pop();
//purple
  push();
  noStroke();
  fill(255, 0, 255, 255);
  square(13, 210, 31);
  pop();
//brown
  push();
  noStroke();
  fill(139, 76, 49, 255);
  square(13, 243, 31);
  pop();
//white
  push();
  stroke(214, 214, 214, 255);
  strokeWeight(1);
  fill(255, 255, 255, 255);
  square(13, 276, 31);
  pop();
//black
  push();
  noStroke();
  fill(0, 0, 0, 255);
  square(13, 309, 31);
  pop();
}

function initializeSound() {

  setTimeout(() => {
    filt = new Tone.Filter(2000, "highpass").toDestination();
    rev = new Tone.Reverb(1).toDestination();
    del = new Tone.FeedbackDelay("8n", 0.4).toDestination();
    del.connect(rev);
    rev.connect(filt);
  
    // Syth for start painting
    startPaintingSynth = new Tone.MembraneSynth().connect(del);
    startPaintingSynth.volume.value = -10;
  
    backgroundMusic = new Tone.PolySynth().toDestination();
    toneInitialized = true;

    blockSound = new Tone.FMSynth({
      modulationIndex: 20,
      oscillator: { type: 'sine' },
      modulation: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.1,
        release: 0.05,
      },
    }).toDestination();
    
    let reverb = new Tone.Reverb(1).toDestination();
    blockSound.connect(reverb);

    popSound = new Tone.MembraneSynth({
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      },
      pitchDecay: 0.05,
      octaves: 2
    }).toDestination();
  }, 100); 
}


function mousePressed() {
  initializeSound();
  isDrawing = true;

//Red is Choosen
  if (mouseX > 13 && mouseX < 13 + 31 && 
    mouseY > 10 && mouseY < 10 + 31) {
      DrawingColor = color(255, 0, 0, 255);
      newMelody = ["C4", "E4", "G4"];
      blockSound.triggerAttackRelease("C3", "8n");
      block = true;
    }
//Orange is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 43 && mouseY < 43 + 31) {
    DrawingColor = color(255, 175, 56, 255);
    newMelody = ["D4", "F4", "A4"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Yellow is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 77 && mouseY < 77 + 31) {
    DrawingColor = color(255, 248, 56, 255);
    newMelody = ["F5", "A5", "C6"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Green is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 110 && mouseY < 110 + 31) {
    DrawingColor = color(62, 249, 0, 255);
    newMelody = ["F4", "A4", "C5"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Cyan is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 143 && mouseY < 143 + 31) {
    DrawingColor = color(56, 222, 255, 255);
    newMelody = ["D3", "F3", "A3"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Blue is Choosen
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 176 && mouseY < 176 + 31) {
    DrawingColor = color(51, 0, 255, 255);
    newMelody = ["C3", "E3", "G3"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Purple is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 210 && mouseY < 210 + 31) {
    DrawingColor = color(255, 0, 255, 255);
    newMelody = ["E3", "G3", "B3"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Brown is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 243 && mouseY < 243 + 31) {
    DrawingColor = color(139, 76, 49, 255);
    newMelody = ["F2", "A2", "C3"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//White is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 276 && mouseY < 276 + 31) {
    DrawingColor = color(255, 255, 255, 255);
    newMelody = ["F5", "A5", "C6"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
//Black is Choosen 
if (mouseX > 13 && mouseX < 13 + 31 && 
  mouseY > 309 && mouseY < 309 + 31) {
    DrawingColor = color(0, 0, 0, 255);
    newMelody = ["F6", "A6", "C7"];
    blockSound.triggerAttackRelease("C3", "8n");
    block = true;
  }
 if (!block){
  let freq = map(mouseY, 0, height, 1000, 100);
  startPaintingSynth.triggerAttackRelease(freq, "8n");
  block = false; }

}

function mouseDragged() {
  block = true;
  isDrawing = true
  melodyNotes = newMelody;

  if (!musicPatternStarted) {
    musicPattern = new Tone.Pattern((time, note) => {
      backgroundMusic.triggerAttackRelease(note, "8n", time);
    }, melodyNotes, "random");

    musicPattern.interval = "4n";
    musicPattern.start(0);
    Tone.Transport.start();
    musicPatternStarted = true;
  } else {
    // Smoothly change notes if color changed
    musicPattern.values = melodyNotes;
}
}

function mouseReleased() {
  isDrawing = false;

  if (musicPattern) {
    musicPattern.stop();
    musicPattern.dispose();
    musicPattern = null;
  }
  Tone.Transport.stop();
  musicPatternStarted = false;
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    popSound.triggerAttackRelease("G5", "16n");
    clear();
    background(255);
  }
}