import EnemyMissile from "./enemy-missile";
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
   private attackPath: IPosition[]; // series of points to go to. Relative. [0,0; 100,500; 300,0; 0,0] 100 over, 500 down, 300 over, 0 down, back to initial point
   private entryPath: IPosition[];
   private currentPath: IPosition[];
   private graphics: any;
   private particleSystem: any;
   private target: IPosition;
   private formationPosition: IPosition;
   private moveRate: number; 
   private doneAttacking: any; 
   private missile: EnemyMissile; 
   private attackTime: number; 
   private spaceShipPosition: IPosition;
   private scoreHandler: any; 
   private explosionSound: HTMLAudioElement;
   private type: string; 
   private hasSheld: boolean; 
   private unShieldedGalaga: HTMLImageElement;
   private mediator: any; 

   constructor(type: string, img: HTMLImageElement, pos: IPosition, formPosition: IPosition, graphics, particleSystem, isAttackComplete, mediator ,galaga?: HTMLImageElement){
      this.image = img; 
      this.position = pos;
      this.alive = true;
      this.rotationRate = 2 * Math.PI;
      this.graphics = graphics; 
      this.particleSystem = particleSystem;
      this.size = {
         x: 25,
         y: 25,
      }
      this.attackPath = [{x: 200, y: 500}, {x: 0, y: -500}];
      this.rotation = 0; 
      this.moveRate = 300;
      this.formationPosition = formPosition
      this.doneAttacking = isAttackComplete;
      this.attackTime = 0; 
      this.explosionSound = new Audio();
      this.explosionSound.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/secondExplosion.mp3";
      this.type = type; 
      if(this.type === "galaga"){
         this.hasSheld = true; 
      }
      this.unShieldedGalaga = galaga;
      this.mediator = mediator; 

   }

   // the next two methods need to be refactored or removed. DRY is important. 
   // taken profPorkins github :)
   public computeAngle(position: IPosition, rotation, target: IPosition): {angle: number, crossProduct: number}{
      let v1 = {
         x : Math.cos(rotation + (Math.PI / 2)),
         y : Math.sin(rotation + (Math.PI / 2))
      };
      let v2 = {
         x : position.x - target.x,
         y : position.y - target.y
      };

      let v2len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      v2.x /= v2len;
      v2.y /= v2len;

      let dp = v1.x * v2.x + v1.y * v2.y;
      let angle = Math.acos(dp);
      //
      // It is possible to get a NaN result, when that happens, set the angle to
      // 0 so that any use of it doesn't have to check for NaN.
      if (isNaN(angle)) {
         angle = 0;
      }

      //
      // Get the cross product of the two vectors so we can know
      // which direction to rotate.
      let cp = this.crossProduct(v1, v2);

      return {
         angle : angle,
         crossProduct : cp
      };
   }
      
   // also taken from profPorkins github
   private crossProduct(v1: IPosition, v2: IPosition){
      return (v1.x * v2.y) - (v1.y * v2.x);
   }

   // also taken from profPorkins github
   private moveForward(elapsedTime: number){
      //
        // Create a normalized direction vector
        let vectorX = Math.cos(this.rotation + (Math.PI / 2));
        let vectorY = Math.sin(this.rotation + (Math.PI / 2));
        //
        // With the normalized direction vector, move the center of the sprite
        this.position.x += (vectorX * this.moveRate * (elapsedTime / 1000)) * -1;
        this.position.y += (vectorY * this.moveRate * (elapsedTime  / 1000)) * -1;

   }

   private setTarget(target: IPosition){
      this.target = {
         x: target.x,
         y: target.y - 300, 
      }
      this.spaceShipPosition = target; 
   }

   public attack(spaceshipPosition: IPosition){
      this.attacking = true;  
      this.setTarget(spaceshipPosition)
   }

   public getEnemyInfo(){
      return {
         position: this.position,
         rotation: this.rotation,
      }
   }

   public getCollisionInfo(){
      return {
         center: this.position,
         radius: this.size.x * 0.75, // it doesn't matter if I use x or y because the size is square. 
      }
   }

   public destroyEnemy(){
      if(!this.hasSheld){
         this.particleSystem.explodeEnemy(this.position, 200, {mean: 1, stdev: 0.5}, {mean: 1.5, stdev: 0.3})
         this.alive = false; 
         if(this.attacking) this.doneAttacking();
         this.mediator.publishEvent("enemyHit", [])
         this.mediator.publishEvent("enemyDestroyed", [this.attacking, this.type])
         this.explosionSound.play();
      } else {
         this.hasSheld = false; 
         this.mediator.publishEvent("enemyHit", [])
      }
   }

   public isAlive(){
      return this.alive; 
   }

   public getMissileCollisionInfo(){
      return this.missile ? this.missile.getCollisionInfo() : undefined;
   }

   public enterScreen(){
      this.target = this.formationPosition;
   }

   public moveLeft(elapsedTime: number){
      if(this.position.x - (this.size.x / 2) > 0 && !this.attacking){
         this.position.x -= 35 * (elapsedTime / 1000)
         this.formationPosition.x -= 35 * (elapsedTime / 1000)
      } else {
         this.formationPosition.x -= 35 * (elapsedTime / 1000)
      }
   }

   public moveRight(elapsedTime: number){
      if(this.position.x + (this.size.x / 2) < CANVAS_SIZE){
         this.position.x += 35 * (elapsedTime / 1000)
         this.formationPosition.x += 35 * (elapsedTime / 1000)
      } else {
         this.formationPosition.x += 35 * (elapsedTime / 1000)
      }
   }

   public update(elapsedTime: number){
      if(this.target){
         // some of this code borrowed/modified from profPorkins github. 
         let result = this.computeAngle(this.position, this.rotation, this.target);
         if(Math.abs(result.angle - this.rotation + (Math.PI / 2)) > 0.001){
            if(result.crossProduct > 0){
               if (result.angle > (this.rotationRate * (elapsedTime /1000))) {
                  this.rotation += (this.rotationRate * (elapsedTime / 1000));
               } else {
                     this.rotation += result.angle;
               }
            } else {
               if (result.angle > (this.rotationRate * (elapsedTime / 1000))) {
                   this.rotation -= (this.rotationRate * (elapsedTime / 1000));
               } else {
                   this.rotation -= result.angle;
               }
           }
         }
         let distance = Math.sqrt(Math.pow(this.position.x - this.target.x, 2) + Math.pow(this.position.y - this.target.y, 2))
         if(distance > 3){
            this.moveForward(elapsedTime)
         } else {
            this.target = null; 
         }
      } else {
         if(this.attacking){
            this.target = this.formationPosition;
            this.attacking = false; 
            this.doneAttacking();
            this.attackTime = 0; 
         }
         this.rotation = 0;
      }
   }

   public isAttacking(){
      return this.attacking; 
   }

   public render(){
      if(this.type === "galaga" && !this.hasSheld){
         this.graphics.drawTexture(this.unShieldedGalaga, this.position, this.rotation, this.size);
      } else {
         this.graphics.drawTexture(this.image, this.position, this.rotation, this.size);
      }
      if(this.missile && this.missile.isAlive()){
         this.missile.render(); 
      }
   }
}