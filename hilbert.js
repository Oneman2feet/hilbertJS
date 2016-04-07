var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

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