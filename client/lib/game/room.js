/* globals Game */

var Room = Game.Room = function () {
  this.create();
};

Room.WALL_GEOMETRY_PATH = '/textures/wall.js';
Room.WALL_WIDTH = 60;
Room.WALL_HEIGHT = 20;

Room.WALLS_POSITIONS = [
  {x: 0, y: 0, z: - Room.WALL_WIDTH / 2},
  {x: 0, y: 0, z: Room.WALL_WIDTH / 2},
  {x: Room.WALL_WIDTH / 2, y: 0, z: 0},
  {x: - Room.WALL_WIDTH / 2, y: 0, z: 0}
  // {x: -9, y: 10, z: 0}
];

Room.ROOF_WIDTH = Room.FLOOR_WIDTH = Room.ROOF_HEIGHT = Room.FLOOR_HEIGHT = 60;

Room.ROOF_POSITION = {x: 0, y: 10, z: 0};
Room.FLOOR_POSITION = {x: 0, y: -10, z: 0};
Room.ROOF_ROTATION = Room.FLOOR_ROTATION = {x: 1.5708, y: 0, z: 0};

Room.WALLS_ROTATIONS = [
  {x: 0, y: 0, z: 3.14159},
  {x: 0, y: 0, z: 3.14159},
  {x: 0, y: 1.5708, z: 3.14159},
  {x: 0, y: 1.5708, z: 3.14159}
  // {x: 1,y: 0,z: 1}
];

Room.CAMERA_ROTATION_ANGLE = 1;
Room.CAMERA_MOVEMENT = 5;
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

  this._createWalls();

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

Game.Room.prototype._createWalls = function () {
  this.walls = [];

  var wall;

  for (var i = 0; i < Game.Room.WALLS_POSITIONS.length; i++) {

  // Game.load3DTexture(Game.Room.WALL_GEOMETRY_PATH, new THREE.MeshBasicMaterial({ color: 0xdfdfdf, map: THREE.ImageUtils.loadTexture('/textures/wall-texture.jpg') }), function (wall) {
    wall = new THREE.Mesh(
      new THREE.PlaneGeometry(Game.Room.WALL_WIDTH, Game.Room.WALL_HEIGHT),
      new THREE.MeshBasicMaterial( {color: 0xdfdfdf, side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('/textures/wall-texture.jpg')} )
    );

    this.scene.add(wall);
    // TODO: Set update matrix to false
    wall.position.set(Game.Room.WALLS_POSITIONS[i].x, Game.Room.WALLS_POSITIONS[i].y, Game.Room.WALLS_POSITIONS[i].z);

    wall.rotation.x = Game.Room.WALLS_ROTATIONS[i].x;
    wall.rotation.y= Game.Room.WALLS_ROTATIONS[i].y;
    wall.rotation.z = Game.Room.WALLS_ROTATIONS[i].z;

    this.walls.push(wall);
  }

  var roof = this.roof = new THREE.Mesh(
    new THREE.PlaneGeometry(Game.Room.ROOF_WIDTH, Game.Room.ROOF_HEIGHT),
    new THREE.MeshBasicMaterial( {color: 0xdfdfdf, side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('/textures/ceil-texture.jpg')} )
  );

  this.scene.add(roof);

  roof.position.set(Game.Room.ROOF_POSITION.x, Game.Room.ROOF_POSITION.y, Game.Room.ROOF_POSITION.z);

  roof.rotation.x = Game.Room.ROOF_ROTATION.x;
  roof.rotation.y= Game.Room.ROOF_ROTATION.y;
  roof.rotation.z = Game.Room.ROOF_ROTATION.z;

  var floor = this.floor = new THREE.Mesh(
    new THREE.PlaneGeometry(Game.Room.FLOOR_WIDTH, Game.Room.FLOOR_HEIGHT),
    new THREE.MeshBasicMaterial( {color: 0xdfdfdf, side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('/textures/floor-texture.jpg')} )
  );

  this.scene.add(floor);

  floor.position.set(Game.Room.FLOOR_POSITION.x, Game.Room.FLOOR_POSITION.y, Game.Room.FLOOR_POSITION.z);

  floor.rotation.x = Game.Room.FLOOR_ROTATION.x;
  floor.rotation.y= Game.Room.FLOOR_ROTATION.y;
  floor.rotation.z = Game.Room.FLOOR_ROTATION.z;

    // TODO: Invoke update matrix

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
