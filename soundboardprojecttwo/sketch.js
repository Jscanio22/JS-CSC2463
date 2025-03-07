let synth1, filt, rev, activeKey, polySynth, reverbSlider, del, number; 

let keyNotes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',

  'h': 'G4',
  'j': 'A5',
  'k': 'B5',
  'l': 'C5'
}

function setup() {
  createCanvas(450, 400);
  
  filt = new Tone.Filter(1000, "lowpass").toDestination();
  rev = new Tone.Reverb(2).toDestination();
  del = new Tone.FeedbackDelay("16n", 0);
  del.connect(rev);
  rev.connect(filt);
  filt.toDestination();

  filt.toDestination();
  synth1 = new Tone.Synth({
    oscillator : {
      type : "triangle"
      } ,
    envelope: {
     attack:0.1,
    sustain: 0.9,
    decay: 0.2,
    release:0.5
  }
  }).connect(del)

  synth1.portamento.value = 0.05;

  //polySynth = new Tone.PolySynth(Tone.FMSynth).connect(del);
  //polySynth.set({
  // maxPolyphony: 4,
  // envelope: {
  //   attack:0.1,
  //   decay: 0.2,
  //  sustain: 0.9,
  //    release:0.3
  //}
  //}).connect(del);

  //polySynth.volume.value = -6

  feedbackSlider = createSlider(0, 0.9, 0.3, 0.01);
  feedbackSlider.position(150, 120);
  feedbackSlider.input(() => {
    del.feedback.value = feedbackSlider.value();
  });
}

function draw() {
  background(220);
  textSize(20);
  text("Press a, s, d, f, h, j, k, and l \n to play notes C4 - C5", 100, 50);
  text("Feedback: " + feedbackSlider.value(), 150, 105);
}

function keyPressed() {
  let pitch = keyNotes[key];
  if (pitch && key !== activeKey) {
    synth1.triggerRelease();
    activeKey = key;
    synth1.triggerAttack(pitch);
  }
}

function keyReleased(){
  if (keyNotes[key]) {
    synth1.triggerRelease();
    activeKey = null;
  }
}