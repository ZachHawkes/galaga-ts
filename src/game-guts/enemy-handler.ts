import Enemy from "./enemies";
import EnemyMissile from "./enemy-missile";

interface IPosition {
   x: number, 
   y: number,
}

export default class EnemyHandler {
   private enemies: Enemy[][];
   private imageHandler: any;
   private graphics: any; 
   private particleSystem: any;
   private shouldMoveLeft: boolean;
   private moveTime: number; 
   private hasAttacked: number; // temporary
   private getSpaceShipPos: any;
   private attackTime: number; 
   private scoreHandler: any;
   private clearanceToAttack: boolean;
   private timeToEnter: number;
   private entryComplete: boolean;
   private entryQueue: Enemy[];
   private missileArray: EnemyMissile[];
   private mediator: any; 
   private level: number; 

   constructor(imgHandler, graphics, particleSystem, getSpaceshipPosition, mediator){
      this.imageHandler = imgHandler;
      this.graphics = graphics; 
      this.particleSystem = particleSystem;
      this.shouldMoveLeft = true; 
      this.clearanceToAttack = false; 
      this.mediator = mediator;
      this.buildEnemies(5, 8);
      this.moveTime = 0; 
      this.hasAttacked = 0; 
      this.getSpaceShipPos = getSpaceshipPosition;
      this.attackTime = 0;
      this.timeToEnter = 0; 
      this.entryComplete = false; 
      this.missileArray = [];
      this.level = 1; 
   }

   private buildEnemies(enemyRows: number, enemiesPerRow: number){
      this.entryComplete = false; 
      this.timeToEnter = 0;
      let newEnemies = [];
      for(let rows = 0; rows < enemyRows; rows++){
         let enemyRow = []; 
         let yPosition = 150 + (rows *  50);
         let image;
         let secondImage;  
         let type; 
         if(rows === 1 || rows === 2){
            image = this.imageHandler.getImage('butterfly')
            type = 'butterfly'
         } else if(rows === 3 || rows === 4){
            image = this.imageHandler.getImage('bee')
            type = "bee"; 
         } else {
            image = this.imageHandler.getImage('bossGalaga')
            secondImage = this.imageHandler.getImage('galaga')
            type = "galaga"
         }
         for(let rowEnemies = 1; rowEnemies <= enemiesPerRow; rowEnemies++){
            let side = rows % 2 === 0 ? 1200 : -80;
            enemyRow.push(new Enemy(type, image, {x: side, y: 800}, {x: 300 + (rowEnemies * 50), y: yPosition}, this.graphics, this.particleSystem, this.doneAttacking, this.mediator, secondImage))
         }
         newEnemies.push(enemyRow);
      }
      this.enemies = newEnemies;
   }

   public doneAttacking = () =>{
      this.attackTime = 0; 
      this.hasAttacked--;
   }

   private hoverEnemies(elapsedTime: number){
      this.enemies.forEach(row=>{
         row.forEach(enemy=>{
            if(this.shouldMoveLeft){
               enemy.moveLeft(elapsedTime);
            } else {
               enemy.moveRight(elapsedTime);
            }
         })
      })
   }

   private initiateAttack(){
      let spaceshipPosition = this.getSpaceShipPos(); 
      let indexToAttack = Math.floor(Math.random() * this.enemies.length)
      let secondIndextToAttack = Math.floor(Math.random() * this.enemies[indexToAttack].length);
      if(this.enemies[indexToAttack][secondIndextToAttack] && !this.enemies[indexToAttack][secondIndextToAttack].isAttacking()){
         this.enemies[indexToAttack][secondIndextToAttack].attack(spaceshipPosition);
         const enemyInfo = this.enemies[indexToAttack][secondIndextToAttack].getEnemyInfo();
         if(Math.random() * 10 < (3 + this.level)) this.fireMissile(spaceshipPosition, enemyInfo.position, enemyInfo.rotation);
      }
   }

   private fireMissile(target, position, rotation){
      let result = this.computeAngle(position, rotation + (Math.PI / 2), target);
      const definiteTarget = JSON.parse(JSON.stringify(position))
      this.missileArray.push(new EnemyMissile(definiteTarget, result.angle, this.graphics, this.particleSystem));
   }

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

   private crossProduct(v1: IPosition, v2: IPosition){
      return (v1.x * v2.y) - (v1.y * v2.x);
   }

   public getCollisionInfo(): {center: IPosition, radius: number}[][]{
      return this.enemies.map(row=>{
         return row.map(enemy=>enemy.getCollisionInfo())
      });
   }

   public receiveCollisionInfo(enemiesTodestroy: {row: number, column: number}[]){
      enemiesTodestroy.forEach(enemy=>{
         this.enemies[enemy.row][enemy.column].destroyEnemy();
      })
   }

   public getMissileCollisionInfo(){
      let collisionInfo = this.missileArray.map(missile=>missile.getCollisionInfo());
      return collisionInfo;
   }

   public destroyMissile(indexInfo){
      this.missileArray[indexInfo].destroyMissile();
   }

   public areAllEnemiesDown(){
      for(let i = 0; i < this.enemies.length; i++){
         if(this.enemies[i].length !== 0){
            return false; 
         }
      }
      return true; 
   }

   public stopAttacking(){
      this.clearanceToAttack = false;
   }

   public resumeAttacking = ()=>{
      this.clearanceToAttack = true; 
      this.attackTime = 0;
      this.hasAttacked = 0;
   }

   public enterEnemy(){
      if(!this.entryQueue){
         this.entryQueue = this.enemies.flat(); // deep copy
      }
      const newEnemy = this.entryQueue.pop();
      if(newEnemy){
         newEnemy.enterScreen();
      } else {
         this.entryComplete = true; 
         this.clearanceToAttack = true; 
         this.entryQueue = undefined;
      }
   }

   public update(elapsedTime: number){
      if(this.entryComplete){
         this.attackTime += elapsedTime;
         this.moveTime += elapsedTime;
         if(this.moveTime > 2000){
            this.shouldMoveLeft = !this.shouldMoveLeft;
            this.moveTime = 0; 
         }
         if(this.attackTime > 2000 && this.clearanceToAttack){
            this.attackTime = 0; 
            this.hasAttacked--;
         }
         if(this.hasAttacked < 2 && this.attackTime < 3000 && this.clearanceToAttack){
            this.hasAttacked++;
            this.initiateAttack();
         }
         if(this.areAllEnemiesDown()){
            this.buildEnemies(5, 8)
            this.mediator.publishEvent("levelUp", []);
            this.level++;
         }
         this.hoverEnemies(elapsedTime)
      } else {
         this.timeToEnter += elapsedTime;
         if(this.timeToEnter > 100){
            this.timeToEnter = 0; 
            this.enterEnemy();
         }
      }
      this.enemies = this.enemies.map(row=>row.filter(enemy=>enemy.isAlive()))
      this.enemies.forEach(row=>{
         row.forEach(enemy=> enemy.update(elapsedTime));
      });
      this.missileArray.forEach(missile=>missile.update(elapsedTime))
   }

   public render(){
      this.enemies.forEach(row=>{
         row.forEach(enemy=> enemy.render());
      });
      this.missileArray.forEach(missile=>missile.render())
   }
}