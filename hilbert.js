var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
var analyser;

var canvas = document.getElementById("canvas");
var canvasCtx = canvas.getContext("2d");

if (AudioContext){
  audioCtx = new AudioContext();
  var gainNode = audioCtx.createGain();
  analyser = audioCtx.createAnalyser();
  //confusing, gain on oscilloscope, different for gain affecting input
  // gainNode.gain.value = ui.gain.value;
  gainNode.gain.value = 3;
  analyser.smoothingTimeConstant = .9;
  // analyser.fftSize = 512;
  // analyser.fftSize = 1024;
  analyser.fftSize = 4096;
  gainNode.connect(analyser);
  // frequencyBinCount is readonly and set to fftSize/2;
  var dataArray = new Uint8Array(analyser.frequencyBinCount);
  var streaming = false;
  var sampleRate = audioCtx.sampleRate;
  var numSamples = analyser.frequencyBinCount;
  analyser.getByteTimeDomainData(dataArray);
} else {
  console.log("no audio context");
}

if (navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
  navigator.getUserMedia({audio:true}, gotStream, function(error) {
    console.log("Capture error: ", error.code);
  });
} else {
  console.log('you need a better browser');
};

function gotStream(stream) {
  console.log('got stream');
  // Create an AudioNode from the stream.
  window.mediaStreamSource = audioCtx.createMediaStreamSource(stream);
  //for testing
  var osc = audioCtx.createOscillator();
  osc.frequency.value = 200;
  osc.start(0);
  // switch these lines
  window.mediaStreamSource.connect(gainNode);
  // osc.connect(gainNode);
  streaming = true;
}

// draw an oscilloscope of the current audio source
function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT/2;

    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
};

draw();
