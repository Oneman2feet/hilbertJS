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
  analyser.getByteTimeDomainData(dataArray); // waveform
  //analyser.getByteFrequencyData(dataArray); // frequencies
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // FFT
  /*
  var fft = new FFT(2048, 44100);
  fft.forward(dataArray);
  var spectrum = fft.spectrum;
  drawSpectrum(spectrum);
  fft.inverse(spectrum);
  drawXY(fft.real,fft.imag);
  */

  var hil = hilbertTransform(dataArray);
  console.log(hil);
  //drawWave(hil.imag, 100);
  //drawXY(hil.real, hil.real, 100);

};

draw();

function hilbertTransform(signal) {
  var lfilt = bufferLength;
  var npt = signal.length;
  var hilb = [];
  for (i=1; i<=lfilt; i++) hilb[i]=1/((i-lfilt/2)-0.5)/Math.PI;
  return convolve(signal, hilb, npt, lfilt);
}

// adapted from [http://www.physionet.org/physiotools/apdet/apdet-1.0/ht.c]
function convolve(source, filt, npt, lfilt) {
  var i, l, yt;
  var target = [];

  for (l=1; l<=npt-lfilt+1; l++) {
    yt = 0.0;
    for (i=1; i<=lfilt; i++) 
        yt = yt+source[l+i-1]*filt[lfilt+1-i];
    target[l] = yt;
  }

  /* shifting lfilt/1+1/2 points */
  for (i=1; i<=npt-lfilt; i++) {
      target[i] = 0.5*(target[i]+target[i+1]);
  }
  for (i=npt-lfilt; i>=1; i--)
      target[i+lfilt/2]=target[i];

  /* writing zeros */
  for (i=1; i<=lfilt/2; i++) {
      target[i] = 0.0;
      target[npt+1-i] = 0.0;
  }

  return target;
}

function hilbert(signal) {
  var fft = new FFT(2048, 44100);
  fft.forward(signal);
  var spectrum = fft.spectrum;
  var N = spectrum.length;
  var h = spectrum.map(function(el,i){
    var half = ~~(N/2) + 1
    if (i===1 || i===half) return el;
    return (i<half) ? 2.0 * el: 0;
  });
  fft.inverse(h);
  return fft;
}

function drawWave(signal, scale) {
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = '#000';
  canvasCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / signal.length;
  var x = 0;

  for(var i=0; i<signal.length; i++) {
    var v = signal[i] / scale;
    var y = v + HEIGHT/2;

    if(i===0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(WIDTH, HEIGHT/2);
  canvasCtx.stroke();
}

function drawXY(real, imaginary, scale) {
  canvasCtx.moveTo(WIDTH * 0.5, HEIGHT * 0.5);
  canvasCtx.beginPath();
  for(var i=0; i<real.length; i++) {
    var x = real[i] / scale;
    var y = imaginary[i] / scale;
    canvasCtx.lineTo(x + WIDTH * 0.5, y + HEIGHT * 0.5);
  }
  canvasCtx.stroke();
}

function drawSpectrum(spectrum) {
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = '#000';

  var sliceWidth = WIDTH * 1.0 / spectrum.length;
  var x = 0;

  for(var i=0; i<spectrum.length; i++) {
    var v = spectrum[i] / 20;
    var y = v * HEIGHT/2;

    canvasCtx.beginPath();
    canvasCtx.moveTo(x, HEIGHT);
    canvasCtx.lineTo(x, HEIGHT - y);
    canvasCtx.stroke();

    x += sliceWidth;
  }
}

function drawFrequencies() {
  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]/2;

    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

    x += barWidth + 1;
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
