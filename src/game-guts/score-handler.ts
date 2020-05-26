

export default class ScoreHandler {
   private score: number; 
   private shots: number;
   private hits: number;
   private level: number;
   private graphics: any;
   private mediator: any;

   constructor(graphics, mediator){
      this.score = 0; 
      this.shots = 0; 
      this.hits = 0; 
      this.level = 1;
      this.graphics = graphics;
      this.mediator = mediator
      this.mediator.addEvent("enemyDestroyed", this.enemyDestroyed);
      this.mediator.addEvent("enemyHit", this.enemyHit);
      this.mediator.addEvent("shotFired", this.shotFired);
      this.mediator.addEvent("levelUp", this.increaseLevel);
      this.mediator.addEvent("getScore", this.getScore)
   }

   public shotFired = ()=>{
      this.shots++;
   }

   public enemyHit = () => {
      this.hits++;
      console.log((this.hits / this.shots) * 100 + "%")
   }

   public increaseLevel = ()=>{
      this.level++;
   }

   public getLevel = () =>{
      return this.level;
   }

   public getScore = () =>{
      return this.score
   }
   
   private getAccuracy(){
      if(this.hits === 0) return 100;
      return ((this.hits / this.shots) * 100).toFixed(2);
   }

   public getScoreObject = (): {score: number, hits: number; shots: number; level: number;} =>{
      return {
         score: this.score,
         hits: this.hits,
         shots: this.shots,
         level: this.level,
      }
   }

   public render(){
      let scoreString = `Score: ${this.score}`
      let accuracyString = `Accuracy: ${this.getAccuracy()}%`;
      let levelString = `Level: ${this.level}`;

      this.graphics.drawText(scoreString, {x: 820, y:800}, "rgb(255,255,255)");
      this.graphics.drawText(accuracyString, {x: 820, y:850}, "rgb(255,255,255)");
      this.graphics.drawText(levelString, {x: 820, y:900}, "rgb(255,255,255)");
   }

   public enemyDestroyed = (wasAttacking: boolean, type: string) =>{
      const scoreObject = {
         galaga: 200, 
         butterfly: 80,
         bee: 50,
      }
      const multiplier = wasAttacking ? 2 : 1;
      this.score += multiplier * scoreObject[type] * this.level;
      console.log(this.score)
   }
}