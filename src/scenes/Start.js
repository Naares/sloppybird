export class Start extends Phaser.Scene {

    //frame width: 960
    //frame Height : 640

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.spritesheet('player','assets/spring.png', {frameWidth:160,frameHeight:160});
        this.load.image('pole','assets/pole.png');
    }

    create() {
        //Setup of some props we will need in gameplay
        this.score = 0;
        this.isGameOver = false;
        this.isGameStarted = false;

        //Create world        
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        //Player
        this.player = this.physics.add.sprite(240,270,'player',0);
        this.player.setCollideWorldBounds(true);
        this.player.body.setVelocityX(0);
        this.player.body.setMaxVelocity(0,1000);
        this.player.body.setSize(80,100);
        this.player.body.setOffset(40,60);
        this.player.anims.create({
            key:'jump',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
            frameRate: 15,
            repeat: 0
        });

        //Score
        this.scoreLabel = this.add.text(0,0, 'SCORE: ' + this.score, {fontFamily: 'Roboto', fontSize:20});

        //Start notification
        this.startLabel = this.add.text(280,270, 'PRESS SPACE TO START', {fontFamily: 'Roboto',fontSize:40});


        //Platform physics
        this.poles = this.physics.add.group();


        //Register keyboard input
        this.input.keyboard.on('keydown-SPACE',()=>{this.jump()},this);
        this.physics.world.on('worldbounds', (body) => {
            body.gameObject === this.player && this.gameOver();
        });

        //Infinite generation of pillars
        this.time.addEvent({
            delay: 3000,
            callback: ()=>{
                this.generatePillars();
            },
            loop:true
        });
    }

    update() {
    }

    jump(){
        if(!this.isGameStarted){
            this.startGame();
            return;
        }

        if(this.isGameOver){
            this.scene.restart();
            return;
        }
        this.player.body.setVelocityY(-300);
        this.player.anims.play('jump');
    }

    startGame(){
        this.startLabel.destroy();
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;
        this.player.setGravity(400);
        this.isGameStarted = true;

        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.setScore(++this.score);
            },
            loop:true,
        })
    }

    setScore(value){
        this.scoreLabel.setText('SCORE: ' + value);
    }

    gameOver(){
        this.time.removeAllEvents();
        this.startLabel = this.add.text(200,240, 'GAME OVER\n YOUR SCORE IS: ' + this.score.toString() + '\n PRESS SPACE TO START AGAIN', {fontFamily: 'Roboto',fontSize:40,align:'center'});
        this.isGameOver = true;
    }

    generatePillars(){
        const SCREEN_HEIGHT = 640;
        const SCREEN_WIDTH = 940;
        const POLE_WIDTH = 200;
        const POLE_HEIGHT = 1800;
        const GAP = 260;
        const MARGIN = 20;


        const centerGapY = Phaser.Math.Between(MARGIN + GAP/2,SCREEN_HEIGHT - MARGIN - GAP / 2);
        const newPoleTop = this.physics.add.sprite(900,centerGapY - GAP/2,'pole').setOrigin(.5,1).setFlipY(true).setImmovable(true).setVelocityX(-200).setMaxVelocity(200,0);
        const newPoleBottom = this.physics.add.sprite(900,centerGapY + GAP /2,'pole').setOrigin(.5,0).setImmovable(true).setVelocityX(-200).setMaxVelocity(200,0);

        this.physics.add.collider(this.player,newPoleTop,()=>{
            this.gameOver();
        });
        this.physics.add.collider(this.player,newPoleBottom,()=>{
            this.gameOver();
        });
    }
    
}
