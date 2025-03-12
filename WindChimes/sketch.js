let gameSound, filt, rev, del, whitenoise, Envelope1, lfo, notes, randomNotes;
let click = false; 
let windChimes;
let toneInitialized = false;

function preload() { 
  windChimes = loadImage('media/windchimes.png');
}

function setup() {
  createCanvas(450, 400);
  imageMode(CENTER);
}

function draw() {
  background(255); 
  if (click)
  {
    background(255);
    image(windChimes, 225, 200);
  }
  else {
  text("Click here to hear a sound!",225, 200)}
}


// initialization of tone.js would block the image for some reason, so I put it in it's own funciton and delayed it
// This took me so much troubleshooting to fix ;-;

function initializeTone() {

  setTimeout(() => {
    filt = new Tone.Filter(2000, "highpass").toDestination();
    rev = new Tone.Reverb(1).toDestination();
    del = new Tone.FeedbackDelay("8n", 0.5).toDestination();


    del.connect(rev);  
    rev.connect(filt); 

    gameSound = new Tone.FMSynth({
      modulationIndex: 30,
      oscillator: { type: 'sine' },
      modulation: { type: 'sine' },
      envelope: { 
        attack: 0.2, 
        sustain: 0.5, 
        decay: 0.3, 
        release: 0.5 
      }
    }).connect(del); 

    Envelope1 = new Tone.AmplitudeEnvelope({
      attack: 0.05,
      decay: 0.1,
      sustain: 0.1,
      release: 0.3
    }).connect(gameSound);  

    lfo = new Tone.LFO({ frequency: 0.01, min: 1000, max: 2000 }).connect(filt);
    gameSound.portamento = 0.05;

    toneInitialized = true;
  }, 100); 
}

notes = ["G6", "A#6", "C7", "D7", "F7"];


function mousePressed() {
  initializeTone();
  if (gameSound) {
    randomNotes = random(notes);
    gameSound.triggerAttackRelease(randomNotes, "5n");
  }
  click = true; 
}

function mouseReleased() {
  click = false; 
}
