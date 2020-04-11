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

   constructor(imgHandler, graphics, particleSystem){
      this.imageHandler = imgHandler;
      this.graphics = graphics; 
      this.particleSystem = particleSystem;
      this.buildEnemies(4, 10);
      this.shouldMoveLeft = true; 
      this.moveTime = 0; 
   }

   private buildEnemies(enemyRows: number, enemiesPerRow: number){
      let newEnemies = [];
      for(let rows = 0; rows < enemyRows; rows++){
         let enemyRow = [];
         let yPosition = 150 + (rows *  50);
         for(let rowEnemies = 0; rowEnemies < enemiesPerRow; rowEnemies++){
            enemyRow.push(new Enemy(this.imageHandler.getImage('butterfly'), {x: 200 + (rowEnemies * 50), y: yPosition}, this.graphics, this.particleSystem))
         }
         newEnemies.push(enemyRow);
      }
      this.enemies = newEnemies;
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

   public introduceEnemies(){
      // path enemies one at a time, row by row. use elapsed time. New enemy each frame or two or three. 
   }

   public update(elapsedTime: number){
      this.moveTime += elapsedTime;
      if(this.moveTime > 2000){
         this.shouldMoveLeft = !this.shouldMoveLeft;
         this.moveTime = 0; 
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