var Game = this.Game = function () {

};

var musicTrack = null;

Game.createRoom = function () {
  window._room = new Game.Room().start();
};

Game.playMusic = function (track) {
  if (musicTrack) {
    musicTrack.pause();
  }

  musicTrack = document.getElementById(track);

  musicTrack.play();
};

Game.setPosition = function (object, x, y, z) {
  if (object.position) {
      object.position.x = x;
      object.position.y = y;
      object.position.z = z;
  }
};

Game.load3DTexture = function (geometryPath, material, cb) {
  // var loader = new THREE.JSONLoader();
  // instantiate a loader
  var loader = new THREE.JSONLoader();

  return loader.load(geometryPath, function (geometry) {
    var object3D = new THREE.Mesh(geometry, material);
    if (typeof cb === 'function') {
      cb(object3D);
    }
  });

};
