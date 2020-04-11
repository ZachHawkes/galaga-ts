import Graphics from "./graphics";
import Random from "./random";

interface IGaussian {
   mean: number; 
   stdev: number; 
}

export default class ParticleSystem {

   private graphics: Graphics;
   private particles: Particle[];
   private random: Random;

   constructor(graphics: Graphics){
      this.graphics = graphics;
      this.random = new Random(); 
      this.particles = [];
   }

   public linearParticles = (yPosition: number, speed: IGaussian, size: IGaussian)=>{
         const p = new Particle({
            position: {x: this.random.nextRange(5, 1020), y: yPosition},
            speed: this.random.nextGaussian(speed.mean, speed.stdev),
            size: Math.abs(this.random.nextGaussian(size.mean, size.stdev)), 
            lifetime: 10000,
            rotation: 0,
            direction: {x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI /2)},
            color: "rgb(255,255,255)",
        }, this.graphics)
        this.particles.push(p);
   }

   public missileThrust = (position: {x: number, y: number}, direction: number, lifetime: number, speed: IGaussian, size: IGaussian) =>{
      direction = this.random.nextGaussian(direction, 0.03);
      for(let i = 0; i < 3; i++){
         const p = new Particle({
            position: {x: position.x, y: position.y},
            speed: this.random.nextGaussian(speed.mean, speed.stdev),
            size: Math.abs(this.random.nextGaussian(size.mean, size.stdev)), 
            lifetime: this.random.nextGaussian(500, 200),
            rotation: 0,
            direction: {x: Math.cos(direction + (Math.PI / 2)), y: Math.sin(direction + (Math.PI / 2))},
            color: "rgb(225,235,59)",
         }, this.graphics)
         this.particles.push(p);
      }
   }

   public explodeEnemy = (position: {x: number, y: number}, lifetime: number, speed: IGaussian, size: IGaussian) => {
      for(let i = 0; i < 100; i++){
         const p = new Particle({
            position: {x: position.x, y: position.y},
            speed: this.random.nextGaussian(speed.mean, speed.stdev),
            size: Math.abs(this.random.nextGaussian(size.mean, size.stdev)), 
            lifetime: this.random.nextGaussian(lifetime, 200),
            rotation: 0,
            direction: this.random.nextCircleVector(),
            color: "rgb(225,235,59)",
         }, this.graphics)
         this.particles.push(p);
      }
   }

   public update(elapsedTime: number){
      const aliveParticles = this.particles.filter(particle=>particle.isAlive())
      aliveParticles.forEach(particle => particle.update(elapsedTime));
      this.particles = aliveParticles; 
   }

   public render(){
      this.particles.forEach(particle=>particle.render());
   }

}

interface IParticle {
   position: {
      x: number,
      y: number,
   }
   speed: number;
   lifetime: number;
   rotation: number;
   direction: {
      x: number; 
      y: number; 
   };
   size: number; 
   color: string;
}

class Particle {
   private graphics: Graphics; 
   private screenBounds: {
      x: number, 
      y: number, 
   }
   public position: {
      x: number, 
      y: number, 
   }
   private speed: number; 
   private lifetime: number; 
   private rotation: number; 
   private alive: number; 
   private direction: {
      x: number; 
      y: number; 
   }; 
   private size: number; 
   private color: string; 

   constructor(spec: IParticle, graphics: Graphics){
      this.screenBounds = {x: 1024, y: 1024};
      this.position = spec.position;
      this.speed = spec.speed; 
      this.lifetime = spec.lifetime;
      this.rotation = spec.rotation; 
      this.alive = 0; 
      this.direction = spec.direction; 
      this.graphics = graphics;
      this.size = spec.size;
      this.color = spec.color;  
   }

   public update(elapsedTime: number){
      this.position.x += (Math.abs(this.speed) * this.direction.x * elapsedTime);
      this.position.y += (Math.abs(this.speed) * this.direction.y * elapsedTime);
      this.alive += elapsedTime;
   }

   public isAlive(): boolean {
      if(this.isOutOfBounds()) return false;
      if(this.lifetime) return this.alive < this.lifetime;
      return true
   }

   private isOutOfBounds(): boolean{
      if(this.position.x <= 0 || this.position.x > this.screenBounds.x) return true; 
      if(this.position.y <= 0 || this.position.y > this.screenBounds.y) return true; 
      return false; 
   }
   
   public render(){
      this.graphics.drawCircle(this.position, this.size, this.color, this.color);
   }

}