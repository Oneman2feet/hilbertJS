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