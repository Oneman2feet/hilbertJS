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
