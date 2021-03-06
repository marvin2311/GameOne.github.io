
function preload() {
 this.load.image("bombe","./bilder/bombe.png");
 this.load.image("spieler","./bilder/spieler.png");
 this.load.image("untergrund","./bilder/untergrund.png");
 this.load.image("hintergrund", "./bilder/background.png")

}

 const gameState = {};

function create () {

  gameState.cursors = this.input.keyboard.createCursorKeys();
  const backG = this.add.image(220,270, "hintergrund");

  gameState.player = this.physics.add.sprite(225, 400,"spieler").setScale(.6);

  const platform = this.physics.add.staticGroup();
  platform.create(225, 510,"untergrund");

  gameState.player.setCollideWorldBounds(true);

  this.physics.add.collider(platform, gameState.player);

  const bombs = this.physics.add.group();

  function bombGen(){
    const xCoord = Math.random() * 450;
    bombs.create(xCoord, 10, "bombe").setScale(.025);
  }

  const bombLoop = this.time.addEvent({
    delay: 100,
    callback: bombGen,
    calbackScope: this,
    loop: true
  });

  gameState.scoreText = this.add.text(185, 480,"Score: 0", {fontSize: "15px", fill: "#ae0800"});
  gameState.score = 0;

  this.physics.add.collider(bombs, platform, (bomb)=>{
    bomb.destroy();
    gameState.score += 10;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
  });


  this.physics.add.collider(gameState.player, bombs, ()=>{
    bombLoop.destroy();
    this.physics.pause();
    this.add.text(170, 250, "Game Over", {fontSize: "20px", fill: "#0404B4"});
    this.add.text(150, 270, 'Click to Restart', { fontSize: '15px', fill: '#0404B4' });
  });

  this.input.on("pointerup", ()=>{
    gameState.score = 0;
    this.scene.restart();
  });

}

function update () {

  if(gameState.cursors.left.isDown){
    gameState.player.setVelocityX(-160);
  } else if (gameState.cursors.right.isDown){
    gameState.player.setVelocityX(160);
  } else {
    gameState.player.setVelocityX(0);
  }

}



const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 500,
  backgroundColor: "b9eaff",

  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 200},
      enableBody: true
    }
  },

  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
