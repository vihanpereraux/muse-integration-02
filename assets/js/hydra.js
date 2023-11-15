var hydra = new Hydra({ detectAudio: false })


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


// animation
osc(10, 0.5, 0.001)
    .kaleid(() => envVolume * 2)
    // add EEG data here
    .color(.5, .5, 0.2)
    .colorama(() => envVolume * .01)
    .rotate(() => mouseXCord * 0.001)
    .modulateRotate(o0, () => envVolume, 0.001)
    .modulate(o0, 1)
.out(o0)