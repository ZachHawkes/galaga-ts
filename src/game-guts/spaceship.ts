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

   constructor(graphics: Graphics, spaceshipImage: HTMLImageElement, position:IPosition, size: IPosition, particleSystem: ParticleSystem){
      this.graphics = graphics;
      this.image = spaceshipImage;
      this.position = position;
      this.size = size;
      this.canvasSize = 1024
      this.missileArray = [];
      this.particleSystem = particleSystem;
   }

   public render(){
      this.graphics.drawTexture(this.image, this.position, 0, this.size);
      this.missileArray.forEach(missle=>missle.render())
   }

   public update(elapsedTime: number){
      const updateArray = this.missileArray.filter(missile=>missile.isAlive())
      updateArray.forEach(missile=>missile.update(elapsedTime));
      this.missileArray = updateArray;
   }

   public fire = () =>{
      if(this.missileArray.length < 2){
         const missile = new SpaceshipMissile({x: this.position.x, y: this.position.y - 10}, this.graphics, this.particleSystem);
         this.missileArray.push(missile)
      }
   }

   public getCollisionInfo(){
      return {
         position: this.position,
         radius: this.size.x / 2,
      }
   }

   public getPosition = ()=>{
      return this.position; 
   }

   public receiveCollisionInfo(missilesToDestroy: number[]){
      missilesToDestroy.forEach(missileIndex=>this.missileArray[missileIndex].destroyMissile());
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