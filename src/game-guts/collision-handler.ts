interface IPosition {
   x: number,
   y: number,
}


export default class CollisionHandler {
   private spaceShip: any;
   private enemyHandler: any; 

   constructor(spaceship, enemies){
      this.spaceShip = spaceship;
      this.enemyHandler = enemies; 
   }

   // this spot potentially might need some upgrades. 
   public checkSpaceshipMissiles(){
      let missileArray = this.spaceShip.getMissileCollisionInfo();
      let enemyArray = this.enemyHandler.getCollisionInfo();

      let destroyMissilesArray = [];
      let destroyEnemyArray = [];

      // could use some optimization; for loops are faster, this way i smore readable. 
      if(missileArray.length !== 0){ 
         enemyArray.forEach((row, rowIndex)=>{
            row.forEach((enemy, enemyIndex)=>{
               missileArray.forEach((missile, missileIndex)=>{
                  if(this.lineCircleIntersection(missile.pt1, missile.pt2, enemy)){
                     destroyEnemyArray.push({
                        row: rowIndex,
                        column: enemyIndex
                     });
                     destroyMissilesArray.push(missileIndex);
                  }
               })
            })
         })
      }
      this.spaceShip.receiveCollisionInfo(destroyMissilesArray);
      this.enemyHandler.receiveCollisionInfo(destroyEnemyArray);
   }

   public checkEnemyMissiles(){
      let spaceshipInfo = this.spaceShip.getCollisionInfo();
      let missileInfo = this.enemyHandler.getMissileCollisionInfo();
      
      // using the for loop so I can return out of it early
      for(let i = 0; i < missileInfo.length; i++){
         if(this.lineCircleIntersection(missileInfo[i].pt1, missileInfo[i].pt2, spaceshipInfo)){
            this.spaceShip.destroySpaceship();
            this.enemyHandler.destroyMissile(i)
            return true;
         }
      }
      return false; 
   }

   // Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
   private  lineCircleIntersection(pt1: IPosition, pt2: IPosition, circle: {center: IPosition, radius: number}) {
      let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
      let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
      let b = -2 * (v1.x * v2.x + v1.y * v2.y);
      let c =  2 * (v1.x * v1.x + v1.y * v1.y);
      let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
      if (isNaN(d)) { // no intercept
         return false;
      }
      // These represent the unit distance of point one and two on the line
      let u1 = (b - d) / c;  
      let u2 = (b + d) / c;
      if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
         return true;
      }
      if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
         return true;
      }
      return false;
   }
}