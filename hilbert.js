var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
var analyser;
var bufferLength;

var canvas = document.getElementById("canvas");
var canvasCtx = canvas.getContext("2d");
var WIDTH=canvas.width, HEIGHT=canvas.height;

if (AudioContext){
  audioCtx = new AudioContext();
  var gainNode = audioCtx.createGain();
  analyser = audioCtx.createAnalyser();
  gainNode.gain.value = 3;
  analyser.smoothingTimeConstant = .9;
  analyser.fftSize = 4096;
  gainNode.connect(analyser);
  var dataArray = new Uint8Array(analyser.frequencyBinCount);
  var sampleRate = audioCtx.sampleRate;
  bufferLength = analyser.frequencyBinCount;
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
  // Create an AudioNode from the stream.
  window.mediaStreamSource = audioCtx.createMediaStreamSource(stream);
  window.mediaStreamSource.connect(gainNode);
}

function draw() {
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // FFT
  var fft = new FFT(2048, 44100);
  fft.forward(dataArray);
  var spectrum = fft.spectrum;

  drawSpectrum(spectrum);
};

draw();

function drawSpectrum(spectrum) {
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = '#000';

  var sliceWidth = WIDTH * 1.0 / spectrum.length;
  var x = 0;

  for(var i=0; i<spectrum.length; i++) {
    var v = spectrum[i];
    var y = v * HEIGHT/2;

    canvasCtx.moveTo(x, HEIGHT/2);
    canvasCtx.lineTo(x, y);
    canvasCtx.stroke();

    x += sliceWidth;
  }
}

function drawOscilloscope() {
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = '#000';
  canvasCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for(var i=0; i<bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT/2;

    if(i===0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}
