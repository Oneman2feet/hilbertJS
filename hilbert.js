var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

if (AudioContext){
  var audioCtx = new AudioContext();
  var gainNode = audioCtx.createGain();
  var analyser = audioCtx.createAnalyser();
  //confusing, gain on oscilloscope, different for gain affecting input
  // gainNode.gain.value = ui.gain.value;
  gainNode.gain.value = 3;
  analyser.smoothingTimeConstant = .9;
  // analyser.fftSize = 512;
  // analyser.fftSize = 1024;
  analyser.fftSize = 4096;
  gainNode.connect(analyser);
  // frequencyBinCount is readonly and set to fftSize/2;
  var timeDomain = new Uint8Array(analyser.frequencyBinCount);
  var streaming = false;
  var sampleRate = audioCtx.sampleRate;
  var numSamples = analyser.frequencyBinCount;
} else {
  var analyser = {};
  analyser.frequencyBinCount = 512;
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