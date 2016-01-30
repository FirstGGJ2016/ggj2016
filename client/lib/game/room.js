/* globals Game */

var Room = Game.Room = function () {
  this.create();
};

Room.WALL_GEOMETRY_PATH = '/textures/wall.js';
Room.WALLS_POSITIONS = [
  {x: 0, y: 0, z: 0}
  // {x: 1,y: 0,z: 1}
];

Room.CAMERA_ROTATION_ANGLE = 1;
Room.CAMERA_MOVEMENT = 1;
Room.MOUSE_SENSIBILITY = 0.05;

Room.prototype.start = function () {
  var self = this;

  var cycle = function () {
    requestAnimationFrame(cycle);

    if (typeof self.render === 'function' && !self.stopped) {
      self.render();
      self.renderer.render(self.scene, self.camera);
    }
  };

  requestAnimationFrame(cycle);

  return this;
};

Game.Room.prototype.create = function () {
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

  window.scene = this.scene = new THREE.Scene();

  this.renderer = this._createRenderer();

  this.box = new THREE.Object3D();

  this.box.add(new THREE.Mesh(
    new THREE.BoxGeometry( 1, 1, 1 ),
    // new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshPhongMaterial({color: 0x31B404, vertexColors: THREE.VertexColors})
  ));

  // this.ambientLight = new THREE.AmbientLight(0xffffff);
  // this.scene.add(this.ambientLight);
  //
  this.light = new THREE.DirectionalLight(0xffffff, 1);
  this.light.position.set(-10, -10, -10);
  this.light.updateMatrix();

  this.scene.add(this.light);
  this.scene.add(this.box);
  this.scene.add(this.camera);

  this.camera.position.set(0, 0, 0);
  this.box.position.set(0, 0, 10);
  this.camera.updateProjectionMatrix();

  this.camera.lookAt(this.box.position);

  // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

  // this._createWalls();

  this._moveCameraOnKeyDown();
  this._rotateCamera();

  var self = this;

  var onClick = function() {
    self._lockPointer();
    document.body.removeEventListener('click', onClick);
  };

  document.body.addEventListener('click', onClick);
};

Game.Room.prototype.render = function () {
  // this.controls.update();
  // this.camera.lookAt(this.scene.position);
  // if (this.isKeyDownPressed()) {
  //   this.rotateCamera();
  // }

};

Game.Room.prototype.stop = function () {
  this.stopped = true;
};

Game.Room.prototype._createWalls = function (wallIndex) {
  wallIndex = wallIndex || ( this.walls = [] ) && 0;

  var self = this;


  Game.load3DTexture(Game.Room.WALL_GEOMETRY_PATH, new THREE.MeshBasicMaterial(0xCC0000), function (wall) {
    // TODO: Add texture to the wall
    self.scene.add(wall);
    // TODO: Set update matrix to false
    Game.setPosition(wall, Game.Room.WALLS_POSITIONS[wallIndex].x, Game.Room.WALLS_POSITIONS[wallIndex].y, Game.Room.WALLS_POSITIONS[wallIndex].z);
    // TODO: Invoke update matrix
    self.walls.push(wall);

    self.camera.lookAt(wall);
  });

  if (wallIndex < Game.Room.WALLS_POSITIONS.length - 1) {
    this._createWalls(wallIndex + 1);
  }

};

Game.Room.prototype.isKeyDownPressed = function () {
  return this.downKeyPressed || this.upKeyPressed;
};

Game.Room.prototype._lockPointer = function () {
  document.body.requestPointerLock = document.body.requestPointerLock ||
			     document.body.mozRequestPointerLock ||
			     document.body.webkitRequestPointerLock;

  // Ask the browser to lock the pointer
  document.body.requestPointerLock();
};

Game.Room.prototype._rotateCamera = function () {
  var self = this;

  this._lockPointer();

  document.body.addEventListener('mousemove', function (e) {
    if (e.movementX){
      var xOffset = Math.abs(e.movementX);
      yDegrees = xOffset * Room.MOUSE_SENSIBILITY,
      yRadians = (yDegrees * Math.PI / 180);

      if (e.movementX > 0) { // go right
        self.camera.rotation.y += yRadians;
      }
      else { // go left
        self.camera.rotation.y -= yRadians;
      }
    }

    if (e.movementY){
      var yOffset = Math.abs(e.movementY),
      xDegrees = yOffset * Room.MOUSE_SENSIBILITY,
      xRadians = (xDegrees * Math.PI / 180);

      if (e.movementY > 0) { // go up
        self.camera.rotation.x += xRadians;
      }
      else { // go down
        self.camera.rotation.x -= xRadians;
      }
    }
  });
};

Game.Room.prototype._moveCameraOnKeyDown = function () {
  var self = this;

  keyboardJS.bind('right', function(e) {
    var z = self.camera.position.z;

    // self.camera.position.y = (Game.Room.CAMERA_ROTATION_ANGLE * Math.PI / 180) - y;
    self.camera.position.z = z + Game.Room.CAMERA_MOVEMENT;
  });

  keyboardJS.bind('up', function(e) {
    var z = self.camera.position.z;

    // self.camera.position.y = (Game.Room.CAMERA_ROTATION_ANGLE * Math.PI / 180) - y;
    self.camera.position.z = z + Game.Room.CAMERA_MOVEMENT;
  });

  keyboardJS.bind('up + left', function(e) {
    var z = self.camera.position.z,
        x = self.camera.position.x;

    self.camera.position.z = z + Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
    self.camera.position.x = x - Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
  });

  keyboardJS.bind('up + right', function(e) {
    var z = self.camera.position.z,
        x = self.camera.position.x;

    self.camera.position.z =  z + Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
    self.camera.position.x = x + Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
  });

  keyboardJS.bind('down', function(e) {
    var z = self.camera.position.z;
    self.camera.position.z =  z - Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera

  });

  keyboardJS.bind('down + right', function(e) {
    var z = self.camera.position.z,
        x = self.camera.position.x;

    self.camera.position.z =  z - Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
    self.camera.position.x = x + Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
  });

  keyboardJS.bind('down + left', function(e) {
    var z = self.camera.position.z,
        x = self.camera.position.x;

    self.camera.position.z =  z - Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
    self.camera.position.x = x - Game.Room.CAMERA_MOVEMENT; // TODO: Depends on the rotation of the camera
  });

  window.addEventListener('keyup', function () {
    self.downKeyPressed = self.upKeyPressed = false;
  });
};

Game.Room.prototype._createRenderer = function () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Set the background color of the scene.
  renderer.setClearColor(0x333F47, 1);

  return renderer;
};
