let sampler, button1, button2, button3, button4, samples, delTimeSlider, feedbackSlider;

let del = new Tone.FeedbackDelay( 0, 0).toDestination();

function preload() {
  //sampler = new Tone.Player("media/angelicalpad.mp3").toDestination();
  samples = new Tone.Players({
    angelica: "media/angelicalpad.mp3",
    bang: "media/bang.mp3",
    epic: "media/epiclogo.mp3",
    glitch: "media/glitch.mp3"
  });
  
  samples.connect(del);
}
function setup() {
  canvas = createCanvas(500, 500);
  button1 = createButton("Play Angelical Sound");
  button1.position(10,30);
  button1.mousePressed(() => {samples.player("angelica").start()});

  button2 = createButton("Play Bang Sound");
  button2.position(200,30);
  button2.mousePressed(() => {samples.player("bang").start()});

  button3 = createButton("Play Epic Sound");
  button3.position(10,200);
  button3.mousePressed(() => {samples.player("epic").start()});

  button4 = createButton("Play Glitch Sound");
  button4.position(200,200);
  button4.mousePressed(() => {samples.player("glitch").start()});

  delTimeSlider = createSlider(0,1, 0 ,0.01);
  delTimeSlider.position(10, 120);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});

  feedbackSlider = createSlider(0,0.99, 0 ,0.01);
  feedbackSlider.position(200 , 120);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 10, 105);
  text("Feedback: " + feedbackSlider.value(), 200, 105);
}

//function playSample(){
 // sampler.start();}
  