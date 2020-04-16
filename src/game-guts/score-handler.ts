

export default class ScoreHandler {
   private score: number; 
   private shots: number;
   private hits: number;
   private level: number;

   constructor(){
      this.score = 0; 
      this.shots = 0; 
      this.hits = 0; 
      this.level = 1;
   }

   public shotFired = ()=>{
      this.shots++;
   }

   public enemyHit = () => {
      this.hits++;
      console.log((this.hits / this.shots) * 100 + "%")
   }

   public enemyDestroyed = (wasAttacking: boolean) =>{
      const multiplier = wasAttacking ? 3 : 1;
      this.score += multiplier * 100 * this.level;
      console.log(this.score)
   }
}