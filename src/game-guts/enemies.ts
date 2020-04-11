// parent class enemy --> subclass for each type
interface IPosition {
   x: number,
   y: number,
}

const CANVAS_SIZE = 1024

export default class Enemy {
   private alive: boolean;
   private position: IPosition;
   private image: HTMLImageElement;
   private size: IPosition;
   private attacking: boolean; 
   private rotation: number;
   private rotationRate: number; 
   private target: {
      x: number;
      y: number;
      rotation: number; 
   }
   private attackpath: IPosition[]; // series of points to go to. Relative. [0,0; 100,500; 300,0; 0,0] 100 over, 500 down, 300 over, 0 down, back to initial point
   private entryPath: IPosition[];
   private graphics: any;
   private particleSystem: any;

   constructor(img: HTMLImageElement, pos: IPosition, graphics, particleSystem){
      this.image = img; 
      this.position = pos;
      this.alive = true;
      this.rotationRate = Math.PI;
      this.graphics = graphics; 
      this.particleSystem = particleSystem;
      this.size = {
         x: 25,
         y: 25,
      }
   }

   public getCollisionInfo(){
      return {
         center: this.position,
         radius: this.size.x * 0.75, // it doesn't matter if I use x or y because the size is square. 
      }
   }

   public destroyEnemy(){
      this.particleSystem.explodeEnemy(this.position, 200, {mean: 1, stdev: 0.5}, {mean: 1.5, stdev: 0.3})
      this.alive = false; 
   }

   public isAlive(){
      return this.alive; 
   }

   public attackPath(initialTarget: IPosition){
      // follow path, given initial target Point
      // no curves for now
   }

   public attack(target: IPosition){
      // fire missile at player position
   }

   // negative direction for left, positive for right
   public rotate(elapsedTime){
      this.rotation += this.rotationRate * (elapsedTime / 1000) 
   }

   public moveLeft(elapsedTime: number){
      if(this.position.x - (this.size.x / 2) > 0){
         this.position.x -= 35 * (elapsedTime / 1000)
      }
   }

   public moveRight(elapsedTime: number){
      if(this.position.x + (this.size.x / 2) < CANVAS_SIZE){
         this.position.x += 35 * (elapsedTime / 1000)
      }
   }

   public update(elapsedTime){
      
   }

   public render(){
      this.graphics.drawTexture(this.image, this.position, 0, this.size);
   }
}