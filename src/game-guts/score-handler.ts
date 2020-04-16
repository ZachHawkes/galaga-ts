

export default class ScoreHandler {
   private score: number; 
   private shots: number;
   private hits: number;
   private level: number;
   private graphics: any;

   constructor(graphics){
      this.score = 0; 
      this.shots = 0; 
      this.hits = 0; 
      this.level = 1;
      this.graphics = graphics;
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
      console.log(this.level)
   }

   public getLevel = () =>{
      return this.level;
   }
   
   private getAccuracy(){
      if(this.hits === 0) return 100;
      return Math.round((this.hits / this.shots) * 100);
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

   public enemyDestroyed = (wasAttacking: boolean) =>{
      const multiplier = wasAttacking ? 3 : 1;
      this.score += multiplier * 100 * this.level;
      console.log(this.score)
   }
}