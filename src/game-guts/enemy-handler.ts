import Enemy from "./enemies";

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

   constructor(imgHandler, graphics, particleSystem, getSpaceshipPosition, scores){
      this.imageHandler = imgHandler;
      this.graphics = graphics; 
      this.particleSystem = particleSystem;
      this.scoreHandler = scores;
      this.shouldMoveLeft = true; 
      this.clearanceToAttack = false; 
      this.buildEnemies(4, 10);
      this.moveTime = 0; 
      this.hasAttacked = 0; 
      this.getSpaceShipPos = getSpaceshipPosition;
      this.attackTime = 0;
   }

   private buildEnemies(enemyRows: number, enemiesPerRow: number){
      let newEnemies = [];
      for(let rows = 0; rows < enemyRows; rows++){
         let enemyRow = [];
         let yPosition = 150 + (rows *  50);
         for(let rowEnemies = 0; rowEnemies < enemiesPerRow; rowEnemies++){
            enemyRow.push(new Enemy(this.imageHandler.getImage('butterfly'), {x: 200 + (rowEnemies * 50), y: yPosition}, this.graphics, this.particleSystem, this.doneAttacking, this.scoreHandler))
         }
         newEnemies.push(enemyRow);
      }
      this.enemies = newEnemies;
      this.clearanceToAttack = true; 
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
      }
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
      let collisionInfo = this.enemies.map((row, rowIndex)=>{
         return row.map((enemy, enemyIndex)=>{
            return {
               collisionInfo: enemy.getMissileCollisionInfo(),
               index: [rowIndex, enemyIndex],
            }
         })
      }).flat().filter(missileInfo=>missileInfo.collisionInfo !== undefined);
      return collisionInfo;
   }

   public destroyMissile(indexInfo){
      this.enemies[indexInfo[0]][indexInfo[1]].destroyMissile();
   }

   public introduceEnemies(){
      // path enemies one at a time, row by row. use elapsed time. New enemy each frame or two or three. 
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

   public update(elapsedTime: number){
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
         this.buildEnemies(4, 10)
      }
      this.hoverEnemies(elapsedTime)
      this.enemies = this.enemies.map(row=>row.filter(enemy=>enemy.isAlive()))
      this.enemies.forEach(row=>{
         row.forEach(enemy=> enemy.update(elapsedTime));
      });
   }

   public render(){
      this.enemies.forEach(row=>{
         row.forEach(enemy=> enemy.render());
      });
   }
}