import Graphics from "./graphics"; 
import ParticleSystem from "./particle-system";

interface IPosition {
   x: number, 
   y: number, 
}

export default class Spaceship {
   private image: HTMLImageElement;
   private graphics: Graphics;
   private position: IPosition;
   private size: IPosition;
   private canvasSize: number;
   private missileArray: SpaceshipMissile[];
   private particleSystem: ParticleSystem;
   private scoreHandler: any; 
   private alive: boolean;
   private constructionTime: number; 
   private lives: number; 
   private notifyEnemyHandler: any;
   private missileFireSound: HTMLAudioElement; 
   private deathCry: HTMLAudioElement;
   private newFighter: HTMLAudioElement;
   private newLifeScores: number[]; 
   private mediator: any; 

   constructor(graphics: Graphics, spaceshipImage: HTMLImageElement, position:IPosition, size: IPosition, particleSystem: ParticleSystem, scores, mediator){
      this.graphics = graphics;
      this.image = spaceshipImage;
      this.position = position;
      this.size = size;
      this.canvasSize = 1024
      this.missileArray = [];
      this.particleSystem = particleSystem;
      this.scoreHandler = scores;
      this.alive = true; 
      this.constructionTime = 0; 
      this.lives = 2;
      this.mediator = mediator; 

      this.missileFireSound = new Audio();
      this.missileFireSound.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/missileFire.mp3";
      this.deathCry = new Audio();
      this.deathCry.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/enemyExplosion.mp3";
      this.newFighter = new Audio();
      this.newFighter.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/success.mp3"
      this.newLifeScores = [10000, 50000, 100000, 300000, 500000, 1000000]; 
   }

   public render(){
      if(this.alive) this.graphics.drawTexture(this.image, this.position, 0, this.size);
      for(let i = 0; i < this.lives; i++){
         this.graphics.drawTexture(this.image, {x: this.size.x + (i * (this.size.x + 10)), y: this.canvasSize - (this.size.y)}, 0, this.size);
      }
      this.missileArray.forEach(missle=>missle.render())
   }

   public update(elapsedTime: number){
      if(!this.alive){
         this.constructionTime += elapsedTime;
         if(this.constructionTime > 5000 && this.lives > 0){
            this.lives--;
            this.constructNewSpaceShip();
            this.notifyEnemyHandler();
            this.mediator.publishEvent('resumeAttacking', []);
            this.constructionTime = 0;
         }
      }
      const updateArray = this.missileArray.filter(missile=>missile.isAlive())
      updateArray.forEach(missile=>missile.update(elapsedTime));
      this.missileArray = updateArray;
      let score = this.scoreHandler.getScore() 
      if(this.newLifeScores.length && score > this.newLifeScores[0]){
         this.lives++;
         this.newLifeScores.shift();
         this.newFighter.play();
         this.particleSystem.explodeEnemy(this.position, 300, {mean: 0.5, stdev: 0.2}, {mean: 1, stdev: 0.2})
      }
   }

   public constructNewSpaceShip(){
      console.log(this.lives)
      this.position = {
         x: this.canvasSize / 2,
         y: this.canvasSize - 100,
      }
      this.alive = true; 
   }

   // For the future, I want to create a notification service that handles communication between enemies and spaceship
   // this is quick and dirty because I need it to work. 
   public registerEnemyNotification(handler){
      this.notifyEnemyHandler = handler; 
   }

   public getLives = () =>{
      return this.lives; 
   }

   public fire = () =>{
      if(this.missileArray.length < 2 && this.alive){
         const missile = new SpaceshipMissile({x: this.position.x, y: this.position.y - 10}, this.graphics, this.particleSystem);
         this.missileArray.push(missile)
         this.scoreHandler.shotFired();
         this.mediator.publishEvent("shotFired", [])
         this.missileFireSound.volume = 0.1;
         this.missileFireSound.currentTime = 0;
         this.missileFireSound.play();
      }
   }

   public getCollisionInfo(){
      return {
         center: this.position,
         radius: this.size.x / 2,
      }
   }

   public getPosition = ()=>{
      return this.position; 
   }

   public receiveCollisionInfo(missilesToDestroy: number[]){
      missilesToDestroy.forEach(missileIndex=>this.missileArray[missileIndex].destroyMissile());
   }

   public destroySpaceship(){
      this.particleSystem.explodeEnemy(this.position, 1000, {mean: 2, stdev: 1}, {mean: 3, stdev: 1})
      this.alive = false; 
      this.position = {x: 0, y: 0}
      this.deathCry.play();
   }

   public getMissileCollisionInfo(){
      return this.missileArray.map(missile=>missile.getCollisionInfo());
   }

   public moveRight = (elapsedTime: number)=>{
      if(this.position.x + (this.size.x / 2) < this.canvasSize){
         this.position.x += 300 * (elapsedTime / 1000)
      }
   }

   public moveLeft = (elapsedTime: number)=>{
      if(this.position.x - (this.size.x / 2) > 0){
         this.position.x -= 300 * (elapsedTime / 1000)
      }
   }
}



/***********************************/



class SpaceshipMissile {
   private position: IPosition;
   private graphics: Graphics; 
   private particleSystem: ParticleSystem;
   private size: IPosition;
   private alive: boolean; 

   constructor(pos: IPosition, graphics: Graphics, particleSystem: ParticleSystem){
      this.position = pos; 
      this.graphics = graphics; 
      this.particleSystem = particleSystem;
      this.size = {
         x: 2,
         y: 10,
      } 
      this.alive = true; 
   }

   public destroyMissile(){
      this.alive = false; 
   }

   public getCollisionInfo(){
      return {
         pt1: {
            x: this.position.x,
            y: this.position.y - (this.size.y / 2),
         },
         pt2: {
            x: this.position.x,
            y: this.position.y + (this.size.y / 2),
         }
      }
   }

   public update = (elapsedTime: number)=> {
      this.particleSystem.missileThrust(this.position, 0, 1000, {mean: 1, stdev: 0.5}, {mean: 0.8, stdev: 0.3})
      this.position.y -= 600 * (elapsedTime / 1000);
   }

   public render(){
      if(this.position.y > 0) this.graphics.drawRect({center: this.position, size: this.size, rotation: 0, fill: "rgb(255,0, 0)", stroke: "rgb(255, 0, 0)"});
   }

   public isAlive(){
      if(!this.alive) return false; 
      this.alive = this.position.y > 0; 
      return this.alive;
   }

}