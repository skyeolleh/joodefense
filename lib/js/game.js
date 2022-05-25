// JavaScript Document
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, "phaser-example", {
//   preload: preload,
//   create: create,
//   render: render,
// });

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    extend: {
      player: null,
      reticle: null,
      moveKeys: null,
      bullets: null,
      time: 0,
    },
  },
};

var game = new Phaser.Game(config);

var player = null;

function preload() {
  // this.load.image('penguin', './resources/sprites/Penguin.png')
  this.load.spritesheet("penguin", "./resources/sprites/Penguin.png", 50, 56);

  // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  // this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  // this.stage.backgroundColor = "#9addf3";
}

function create() {
  player = game.add.sprite(100, 10, "penguin");
  player.animations.add("Walk", [0, 1, 2, 3, 4, 5, 6, 7], 8, true);

  this.physics.world.setBounds(0, 0, 1600, 1200);
  moveKeys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  // Enables movement of player with WASD keys
  this.input.keyboard.on("keydown_W", function (event) {
    player.setAccelerationY(-800);
  });
  this.input.keyboard.on("keydown_S", function (event) {
    player.setAccelerationY(800);
  });
  this.input.keyboard.on("keydown_A", function (event) {
    player.setAccelerationX(-800);
  });
  this.input.keyboard.on("keydown_D", function (event) {
    player.setAccelerationX(800);
  });

  // Stops player acceleration on uppress of WASD keys
  this.input.keyboard.on("keyup_W", function (event) {
    if (moveKeys["down"].isUp) player.setAccelerationY(0);
  });
  this.input.keyboard.on("keyup_S", function (event) {
    if (moveKeys["up"].isUp) player.setAccelerationY(0);
  });
  this.input.keyboard.on("keyup_A", function (event) {
    if (moveKeys["right"].isUp) player.setAccelerationX(0);
  });
  this.input.keyboard.on("keyup_D", function (event) {
    if (moveKeys["left"].isUp) player.setAccelerationX(0);
  });
}

function render() {}

function update(time, delta) {
  // Rotates player to face towards reticle
  player.rotation = Phaser.Math.Angle.Between(
    player.x,
    player.y,
    reticle.x,
    reticle.y
  );

  // Camera follows player ( can be set in create )
  this.cameras.main.startFollow(player);

  // Makes reticle move with player
  reticle.body.velocity.x = player.body.velocity.x;
  reticle.body.velocity.y = player.body.velocity.y;

  // Constrain velocity of player
  constrainVelocity(player, 500);

  // Constrain position of reticle
  constrainReticle(reticle);
}
