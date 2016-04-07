if (navigator.webkitGetUserMedia) {  
  navigator.webkitGetUserMedia(
    // First parameter - so-called constraints;
    // in this example - preferrable parameters of the requested stream 
    {
      audio: true,  // requesting audio,...
      video: true   // ...and video
    },
    // Second parameter - callback function in case of success
    function(stream) { // as a parameter object LocalMediaStream is passed to function
      console.log('Stream:', stream);
    },
    // Third parameter - callback function, called in case of error
    function(error) { // error object is passing to the function as a parameter
      console.log('Error:', error);
    }
  )
} else {
  console.log('navigator.webkitGetUserMedia not supported. Are you using latest Chrome/Chromium?');
}



/*
// for logging
function fire(e, data) {    
  log.innerHTML += "\n" + e + " " + (data || '');
}

// globals
var audio_context;
var volume;

// one-off initialization
(function init(g){
  try {
    audio_context = new (g.AudioContext || g.webkitAudioContext);
    fire('Audio context OK');
    // shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    fire('navigator.getUserMedia ' + (navigator.getUserMedia ? 'OK' : 'fail'));
    // use
    navigator.getUserMedia(
      {audio:true},
      iCanHazUserMedia, 
      function(e){fire('No live audio input ' + e);}
    );
  } catch (e) {
    alert('No web audio support in this browser');
  }
}(window));
*/

/*

if (navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
  console.log('we have user media');
  navigator.getUserMedia({audio:true}, function(stream) {
    console.log("we have an audio stream!");
  }, function(error) {
    console.log("Capture error: ", error.code);
  });
} else {
  console.log('you need a better browser');
};

*/


/*
function gotStream(stream) {

  console.log('got stream');

    // Create an AudioNode from the stream.
    window.mediaStreamSource = audioContext.createMediaStreamSource( stream );

    //for testing
    var osc = audioContext.createOscillator();
    osc.frequency.value = 200;
    osc.start(0);

    // switch these lines
    window.mediaStreamSource.connect(gainNode);
    // osc.connect(gainNode);

    streaming = true;
    //$('#inputType-interface select').val(1).change();
    animate();
}
*/

//document.addEventListener("DOMContentLoaded", function(event) { 
  //do work

//$(document).on("uiLoaded", function(){
    
//})

//});

//console.log("ready")


/*
var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

if (AudioContext){
  var audioContext = new AudioContext();
  // var gainNode = audioContext.createGain() || audioContext.createGainNode();
  var gainNode = audioContext.createGain();
  var analyser = audioContext.createAnalyser();

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
  var sampleRate = audioContext.sampleRate;
  var numSamples = analyser.frequencyBinCount;
} else {
  var analyser = {};
  analyser.frequencyBinCount = 512;
}
*/