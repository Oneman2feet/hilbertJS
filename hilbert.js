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