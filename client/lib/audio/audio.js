Audio = function() {
  this._started = false;
  this._stream = null;
  this._audioContext = null;
  this._mediaStreamSource = null;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
};

Audio.prototype._getUserMedia = function(stream) {
  this._stream = stream;
  this._started = true;

  this._audioContext = new AudioContext();

  this._mediaStreamSource = this._audioContext.createMediaStreamSource(stream);
  this._scriptProcessor = this._audioContext.createScriptProcessor(4096, 1, 1);

  var distortion = this._audioContext.createWaveShaper(stream);
  var biquad = this._audioContext.createBiquadFilter();

  biquad.gain.value = 0.8;

  function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for (; i < n_samples; ++i) {
      x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }

    return curve;
  }

  distortion.curve = makeDistortionCurve(400);
  distortion.oversample = '4x';

  //
  // distortion.connect(this._audioContext.destination);

  // this._gainNode = this._audioContext.createGain();
  //
  // this._gainNode.value = 0.1;

  this._scriptProcessor.onaudioprocess = this._processAudio;

  // this._mediaStreamSource.connect(this._scriptProcessor);
  this._mediaStreamSource.connect(distortion);
  distortion.connect(biquad);
  var remote = this._audioContext.createMediaStreamDestination();
  biquad.connect(remote);
  return stream;

  // biquad.connect(this._audioContext.destination);

  // this._mediaStreamSource.connect(this._audioContext.destination);
  // this._scriptProcessor.connect(this._audioContext.destination);
};

Audio.prototype._processAudio = function(e) {
  var input = e.inputBuffer,
      output = e.outputBuffer;

  for (var channel = 0; channel < output.numberOfChannels; channel++) {
    var inputData = input.getChannelData(channel);
    var outputData = output.getChannelData(channel);

    // Loop through the 4096 samples
    for (var sample = 0; sample < input.length; sample++) {
      // make output equal to the same as the input
      outputData[sample] = inputData[sample];
    }
  }
};

// Audio.prototype._gainSound = function () {
//
// }

Audio.prototype.start = function(cb) {
  var self = this;

  navigator.getUserMedia({ audio: true }, function(stream) {
    stream = self._getUserMedia(stream);

    if (cb) {
      cb(stream);
    }
  },

  function(err) {
    throw new Error('Cant use audio api.', err);
  });
};
