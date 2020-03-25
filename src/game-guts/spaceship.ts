import Graphics from "./graphics"; 
import ParticleSystem from "./particle-system";

interface IPosition {
   x: number, 
   y: number, 
}

export default class Spaceship {
   private image: HTMLImageElement;
   private graphics: Graphics;
   public position: IPosition;
   public size: IPosition;
   private canvasSize: number;
   private missileArray: SpaceshipMissile[];
   private particleSystem: ParticleSystem;

   constructor(graphics: Graphics, spaceshipImage: HTMLImageElement, position:IPosition, size: IPosition, particleSystem: ParticleSystem, canvasSize: number = 1024){
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

   constructor(pos: IPosition, graphics: Graphics, particleSystem: ParticleSystem){
      this.position = pos; 
      this.graphics = graphics; 
      this.particleSystem = particleSystem; 
   }

   public update = (elapsedTime: number)=> {
      // this.particleSystem.missileThrust(this.position, 0, 1000, {mean: 5, stdev: 0.5}, {mean: 0.1, stdev: 0.05})
      this.position.y -= 1024 * (elapsedTime / 1000);
   }

   public render(){
      console.log("Rendering")
      if(this.position.y > 0) this.graphics.drawRect({center: this.position, size: {x:2, y:10}, rotation: 0, fill: "rgb(255,0, 0)", stroke: "rgb(255, 0, 0)"});
   }

   public isAlive(){
      console.log("Is alive, ", this.position.y > 0)
      return this.position.y > 0; 
   }

}