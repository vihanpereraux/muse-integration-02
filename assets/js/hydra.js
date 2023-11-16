var hydra = new Hydra({ detectAudio: false })

let elec1 = 0;
let elec2 = 0;
let elec3 = 0;
let elec4 = 0;

let getDataButtonClicked = false;
let getRequestInterval;


// mouse coordiantes
let mouseXCord = 0;
document.body.addEventListener('mousemove', function(e){
  mouseXCord = e.clientX;
});


// microphone input
let envVolume;
document.getElementById('access-button').addEventListener('click', function(){
  getLocalStream();
});

function getLocalStream() {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

    audioSource.connect(scriptNode);
    scriptNode.connect(audioContext.destination);

    // Function to calculate volume level
    function calculateVolume(buffer) {
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += Math.abs(buffer[i]);
      }
      return sum / buffer.length;
    }

    scriptNode.onaudioprocess = function(event) {
      const inputData = event.inputBuffer.getChannelData(0);
      const volume = calculateVolume(inputData);

      // Log the volume level to the console
      let multiplier = 1000;
      console.log('Volume level:', volume * multiplier);
      envVolume = volume * multiplier;
    };
  })
  .catch(function(err) {
    console.error('Error accessing the microphone:', err);
  });
}


// fetching the OSC stream via the flask local server
document.getElementById('get-data').addEventListener('click', function(){
  if(!getDataButtonClicked){
    getDataButtonClicked = true;
    getRequestInterval = setInterval(async () => {
      const response = await fetch('http://127.0.0.1:5000/');
      const myJson = await response.json(); //extract JSON from the http response

      elec1 = myJson.elec1;
      elec2 = myJson.elec2;
      elec3 = myJson.elec3;
      elec4 = myJson.elec4;
      console.log(elec1, elec2, elec3, elec4);
    }, 100);
  }
  else{
    getDataButtonClicked = false;
    clearInterval(getRequestInterval);
  }
});


// animation
osc(7, () => elec1 * 1, () => elec1 * .001)
    .kaleid(() => elec4 * 0.1)
    // add EEG data here
    .color(.5, .6, .2)
    .colorama(() => elec1 * 1.2)
    .rotate(() => elec3 * 0.2)
    .modulateRotate(o0, () => elec2 * 1.2, 0.1)
    .modulate(o0, 1)
.out(o0)