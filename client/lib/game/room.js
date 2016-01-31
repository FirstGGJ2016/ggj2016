/* globals Game */

var Room = Game.Room = function () {
  this.create();
};

Room.BOARD_GEOMETRY_PATH = '/textures/ouija-geometry.json';
Room.BOARD_TEXTURE_PATH = '/textures/ouija-texture.png';

Room.TABLE_GEOMETRY_PATH = '/textures/table-geometry.json';
Room.TABLE_TEXTURE_PATH = '/textures/table-texture.png';

Room.LAMP_GEOMETRY_PATH = '/textures/lamp-geometry.json';

Room.CHIP_GEOMETRY_PATH = '/textures/chip-geometry.json';
Room.CHIP_TEXTURE_PATH = '/textures/chip-texture.png';


Room.WALL_TEXTURE_PATH = '/textures/wall-texture.jpg';
Room.WALL_WIDTH = 60;
Room.WALL_HEIGHT = 20;

Room.WALLS_POSITIONS = [ // Distance between two parallel walls 60
  {x: 0, y: 0, z: - Room.WALL_WIDTH / 2},
  {x: 0, y: 0, z: Room.WALL_WIDTH / 2},
  {x: Room.WALL_WIDTH / 2, y: 0, z: 0},
  {x: - Room.WALL_WIDTH / 2, y: 0, z: 0}
  // {x: -9, y: 10, z: 0}
];

Room.CHIP_MOVEMENT_VELOCITY = 0.01;
Room.CHIP_MOVEMENTS = {
  a: {x: -1, z: -0.8},
  b: {x: -0.68, z: -0.8},
  c: {x: -0.38, z: -0.8},
  d: {x: 0.10, z: -0.8},
  e: {x: 0.2, z: -0.8},
  f: {x: 0.45, z: -0.8},
  g: {x: 0.7, z: -0.8},
  h: {x: 0.95, z: -0.8},
  i: {x: -1.2, z: -0.34},
  j: {x: -1, z: -0.34},
  k: {x: -0.78, z: -0.34},
  l: {x: -0.5, z: -0.34},
  m: {x: -0.18, z: -0.34},
  n: {x: 0.14, z: -0.34},
  o: {x: 0.38, z: -0.34},
  p: {x: 0.66, z: -0.34},
  q: {x: 0.94, z: -0.34},
  r: {x: 1.22, z: -0.34},
  s: {x: -1.05, z: 0.13},
  t: {x: -0.84, z: 0.13},
  u: {x: -0.52, z: 0.13},
  v: {x: -0.20, z: 0.13},
  w: {x: 0.12, z: 0.13},
  x: {x: 0.48, z: 0.13},
  y: {x: 0.76, z: 0.13},
  z: {x: 1.08, z: 0.13},
  1: {x: -0.94, z: 0.73},
  2: {x: -0.72, z: 0.73},
  3: {x: -0.50, z: 0.73},
  4: {x: -0.24, z: 0.73},
  5: {x: -0.02, z: 0.73},
  6: {x: 0.22, z: 0.73},
  7: {x: 0.42, z: 0.73},
  8: {x: 0.64, z: 0.73},
  9: {x: 0.84, z: 0.73},
  0: {x: 1.02, z: 0.73}
};

Room.ROOF_TEXTURE_PATH = '/textures/ceil-texture.png';
Room.FLOOR_TEXTURE_PATH = '/textures/floor-texture.jpg';
Room.ROOF_WIDTH = Room.FLOOR_WIDTH = Room.ROOF_HEIGHT = Room.FLOOR_HEIGHT = 60;

Room.ROOF_POSITION = {x: 0, y: 10, z: 0}; // CEIL POSITION 10Y
Room.FLOOR_POSITION = {x: 0, y: -10, z: 0}; // FLOOR POSITION -10Y
Room.ROOF_ROTATION = Room.FLOOR_ROTATION = {x: 1.5708, y: 0, z: 0};

Room.WALLS_ROTATIONS = [
  {x: 0, y: 0, z: 6.28319},
  {x: 0, y: 0, z: 6.28319},
  {x: 0, y: 1.5708, z: 6.28319},
  {x: 0, y: 1.5708, z: 6.28319}
  // {x: 1,y: 0,z: 1}
];

Room.CAMERA_ROTATION_ANGLE = 1;
Room.CAMERA_MOVEMENT = 0.1;
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

Room.prototype.play = function (player) {
  this._moveCameraOnKeyDown();
  this._rotateCamera();

  var self = this;

  self.blinkIlumination();

  setInterval(function () {
    self.blinkIlumination();
  }, 30000);

  if (player === 'spirit') {
    this._playAsSpirit();
  }
  else {
    this._playAsPerson();
  }

};

Room.prototype.stop = function () {
  // TODO
};

Game.Room.prototype.create = function () {
  window.scene = this.scene = new THREE.Scene();

  this.renderer = this._createRenderer();

  // ----CAMERA----
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  this.camera.position.set(0, 0, 15);


  // ----LIGHT---
  this.globalIlumination = new THREE.PointLight(0x404040, 0.5);
  this.globalIlumination.position.set(0, 0, 0);
  this.globalIlumination.updateMatrix();


  // ----SETUP SCENE---
  this.scene.add(this.globalIlumination);
  this.scene.add(this.lamp);
  this.scene.add(this.camera);


  this._createWalls();
  this._createBoard();
  this._createLamp();
  this._createTable();
  this._createChip();

  this._addEventListeners();

};

Game.Room.prototype._createBoard = function () {
  var self = this;

  Game.load3DTexture(Game.Room.BOARD_GEOMETRY_PATH, new THREE.MeshPhongMaterial( { /*specular: 0x050505,shininess: 100,*/ color: 0xdfdfdf, map: THREE.ImageUtils.loadTexture(Room.BOARD_TEXTURE_PATH) }), function (board) {
    self.board = board;
    board.scale.set(10, 10, 10);
    board.position.set(0, -2.70, 0);
    self.scene.add(board);

    // ----LAMP---
    self.redIlumination = new THREE.PointLight(0xFF0000, 2, 4);
    self.redIlumination.position.set(0, 0, 0);

    // 0xFF0000
    self.iluminationLamp = new THREE.PointLight(0xFFFACD, 2, 6);
    self.iluminationLamp.position.set(0, 0, 0);
    // self.lamp.updateMatrix();
    // self.lamp = new THREE.PointerLight(0xFFFACD, , 1);
    scene.add(self.iluminationLamp);
    scene.add(self.redIlumination);
  });
};

Game.Room.prototype._createChip = function () {
  var self = this;

  Game.load3DTexture(Game.Room.CHIP_GEOMETRY_PATH, new THREE.MeshPhongMaterial( { color: 0x895f5f/* ,map: THREE.ImageUtils.loadTexture(Room.CHIP_TEXTURE_PATH) */}), function (chip) {
    self.chip = chip;
    chip.scale.set(13, 13, 13);
    chip.position.set(0, -2.22, 0);
    self.scene.add(chip);
  });
};


Game.Room.prototype._createLamp = function () {
  var self = this;

  Game.load3DTexture(Game.Room.LAMP_GEOMETRY_PATH, new THREE.MeshPhongMaterial( {color: 0xdfdfdf} ), function (lamp) {
    self.lamp = lamp;
    lamp.scale.set(3, 3, 3);
    lamp.position.set(0, 5, 0);
    self.scene.add(lamp);
  });

};

Game.Room.prototype._createTable = function () {
  var self = this;

  Game.load3DTexture(Game.Room.TABLE_GEOMETRY_PATH, new THREE.MeshPhongMaterial( {color: 0xdfdfdf,/* map: THREE.ImageUtils.loadTexture(Room.TABLE_TEXTURE_PATH)*/ }), function (table) {
    self.table = table;
    table.scale.set(6, 6, 6);
    table.position.set(0, -3.70, 0);
    self.scene.add(table);
  });
};

Game.Room.prototype._createWalls = function () {
  this.walls = [];

  var wall;

  for (var i = 0; i < Game.Room.WALLS_POSITIONS.length; i++) {

  // Game.load3DTexture(Game.Room.WALL_GEOMETRY_PATH, new THREE.MeshBasicMaterial({ color: 0xdfdfdf, map: THREE.ImageUtils.loadTexture('/textures/wall-texture.jpg') }), function (wall) {
    wall = new THREE.Mesh(
      new THREE.PlaneGeometry(Game.Room.WALL_WIDTH, Game.Room.WALL_HEIGHT),
      new THREE.MeshPhongMaterial( {specular: 0x050505,shininess: 100, color: 0xdfdfdf, side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture(Room.WALL_TEXTURE_PATH)} )
    );

    this.scene.add(wall);
    // TODO: Set update matrix to false
    wall.position.set(Game.Room.WALLS_POSITIONS[i].x, Game.Room.WALLS_POSITIONS[i].y, Game.Room.WALLS_POSITIONS[i].z);

    wall.rotation.x = Game.Room.WALLS_ROTATIONS[i].x;
    wall.rotation.y= Game.Room.WALLS_ROTATIONS[i].y;
    wall.rotation.z = Game.Room.WALLS_ROTATIONS[i].z;

    this.walls.push(wall);
  }

  Game.Room.prototype.blinkIlumination = function () {
    if (this._blinking || this.iluminationLamp.intensity === 0){ // semaphore
        return;
    }

    var lampIntensity = this.iluminationLamp.intensity,
        redIntensity = this.redIlumination.intensity,
        self = this;

    var blinks = 7;

    var getRandomBlinkTimer = function () { // return random number between 50 and 100
       var random = String(Math.random()),
           number;

       return parseInt(random * 100);

    };

    var blink = function () {
      --blinks;

      if (!blinks) {
        self._blinking = false;
        return;
      }
      else {
        self.iluminationLamp.intensity = 0;
        self.redIlumination.intensity = 0;

        setTimeout(function () {
          self.iluminationLamp.intensity = lampIntensity;
          self.redIlumination.intensity = redIntensity;
          setTimeout(function () {
            blink();
          }, getRandomBlinkTimer());
        }, getRandomBlinkTimer());
      }
    };

    this._blinking = true;
    blink();

  };

  var roof = this.roof = new THREE.Mesh(
    new THREE.PlaneGeometry(Game.Room.ROOF_WIDTH, Game.Room.ROOF_HEIGHT),
    new THREE.MeshPhongMaterial( {specular: 0x050505,shininess: 100, color: 0xdfdfdf, side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture(Room.ROOF_TEXTURE_PATH)} )
  );

  this.scene.add(roof);

  roof.position.set(Game.Room.ROOF_POSITION.x, Game.Room.ROOF_POSITION.y, Game.Room.ROOF_POSITION.z);

  roof.rotation.x = Game.Room.ROOF_ROTATION.x;
  roof.rotation.y= Game.Room.ROOF_ROTATION.y;
  roof.rotation.z = Game.Room.ROOF_ROTATION.z;

  var floor = this.floor = new THREE.Mesh(
    new THREE.PlaneGeometry(Game.Room.FLOOR_WIDTH, Game.Room.FLOOR_HEIGHT),
    new THREE.MeshPhongMaterial( {specular: 0x050505,shininess: 100, color: 0xdfdfdf, side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture(Room.FLOOR_TEXTURE_PATH)} )
  );

  this.scene.add(floor);

  floor.position.set(Game.Room.FLOOR_POSITION.x, Game.Room.FLOOR_POSITION.y, Game.Room.FLOOR_POSITION.z);

  floor.rotation.x = Game.Room.FLOOR_ROTATION.x;
  floor.rotation.y= Game.Room.FLOOR_ROTATION.y;
  floor.rotation.z = Game.Room.FLOOR_ROTATION.z;

    // TODO: Invoke update matrix

};

Game.Room.prototype.spellWord = function (word) {
  var index = -1,
      self = this;
  var spellLetter = function (){
    if (index < word.length - 1){
      ++index;
      setTimeout(function () {
        self._chipToLetter(word[index], spellLetter);
      }, 1500);
    }
  };

  spellLetter();
};

Game.Room.prototype._chipToLetter = function (letter, cb) {
  this.chipTarget = Room.CHIP_MOVEMENTS[letter];
  this.chipTargetCb = cb;
  this._moveChipTo(this.chipTarget);
};

Game.Room.prototype.render = function () {
  if (this.cameraTarget){
    this._moveCameraTo(this.cameraTarget);
  }

  if (this.chipTarget){
    this._moveChipTo(this.chipTarget);
  }

  // if (this.rotateCamera) {
  //   // TODO
  // }
};

Game.Room.prototype.stop = function () {
  this.stopped = true;
};

Game.Room.prototype._addEventListeners = function () {
  var self = this;

  var onClick = function() {
    self._lockPointer();
    document.body.removeEventListener('click', onClick);
  };

  document.body.addEventListener('click', onClick);

  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    self.renderer.setSize(WIDTH, HEIGHT);
    self.camera.aspect = WIDTH / HEIGHT;
    self.camera.updateProjectionMatrix();
  });

};


Game.Room.prototype.isKeyDownPressed = function () {
  return this.downKeyPressed || this.upKeyPressed;
};

Game.Room.prototype._playAsSpirit = function () {
  var self = this;

  this.blinkIlumination();

  setTimeout(function (){
    //play sound
    var iluminationLamp = self.iluminationLamp.intensity;

    self._blinlking = true;
    self.globalIlumination.intensity = 0;
    self.iluminationLamp.intensity = 0;
    self.redIlumination.intensity = 0;

    setTimeout(function () {
      self.camera.position.set(0, 0, -15);
      self.camera.lookAt(self.board.position);
      setTimeout(function () {
        self.redIlumination.intensity = 5;
      }, 3000);
    }, 300);

  }, 900);

};

Game.Room.prototype._playAsPerson = function () {
  var self = this;

  setTimeout(function () {
    self.blinkIlumination();
    self.globalIlumination.intensity = 0;
    setTimeout(function () {
      self.cameraTarget = {x: 0, y: 0, z: 2};
      self.cameraTargetCb = function (){
        self.camera.lookAt(self.board.position);
      };
    }, 1000);
  }, 500);
};

Game.Room.prototype._moveCameraTo = function (position) {
  var movement = false,
      cameraX = this.camera.position.x,
      cameraY = this.camera.position.y,
      cameraZ = this.camera.position.z;

  if (parseInt(cameraX) !== position.x){
      movement = true;
      if (cameraX > position.x){
        this.camera.position.x -= Room.CAMERA_MOVEMENT;
      }
      else {
        this.camera.position.x += Room.CAMERA_MOVEMENT;
      }
  }

  if (parseInt(cameraY) !== position.y){
      movement = true;
      if (cameraY > position.y){
        this.camera.position.y -= Room.CAMERA_MOVEMENT;
      }
      else {
        this.camera.position.y += Room.CAMERA_MOVEMENT;
      }
  }

  if (parseInt(cameraZ) !== position.z){
      movement = true;
      if (cameraZ > position.z){
        this.camera.position.z -= Room.CAMERA_MOVEMENT;
      }
      else {
        this.camera.position.z += Room.CAMERA_MOVEMENT;
      }
  }

  if (!movement) {
    this.cameraTarget = null;
    if (typeof this.cameraTargetCb === 'function') {
      this.cameraTargetCb();
    }
  }
};


Game.Room.prototype._moveChipTo = function (position) {
  var movement = false,
      chipPositionX = parseFloat(this.chip.position.x.toFixed(2)),
      chipPositionZ = parseFloat(this.chip.position.z.toFixed(2));

  if (chipPositionX !== position.x){
      movement = true;
      if (chipPositionX > position.x){
        this.chip.position.x -= Room.CHIP_MOVEMENT_VELOCITY;
      }
      else {
        this.chip.position.x += Room.CHIP_MOVEMENT_VELOCITY;
      }
  }

  if (chipPositionZ !== position.z){
      movement = true;
      if (chipPositionZ > position.z){
        this.chip.position.z -= Room.CHIP_MOVEMENT_VELOCITY;
      }
      else {
        this.chip.position.z += Room.CHIP_MOVEMENT_VELOCITY;
      }
  }

  if (!movement) {
    this.chipTarget = null;
    if (typeof this.chipTargetCb === 'function') {
      this.chipTargetCb();
    }
  }
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
      var xOffset = Math.abs(e.movementX),
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
