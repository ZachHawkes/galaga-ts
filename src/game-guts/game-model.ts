import Graphics from "./graphics";
import ImageHandler from "./image-handler";
import Spaceship from "./spaceship"
import KeyboardHandler from "./keyboard-handler";
import ParticleSystem from "./particle-system";
import EnemiesHandler from "./enemy-handler";
import CollisionHandler from "./collision-handler";
import ScoreHandler from "./score-handler";

export default class GameModel {
   private canvas: HTMLCanvasElement;
   private context: any;
   private graphics: Graphics;
   private imageHandler: ImageHandler;
   private spaceship: Spaceship;
   public keyboardHandler: KeyboardHandler;
   private particleSystem: ParticleSystem;
   private enemiesHandler: EnemiesHandler;
   private collisionHandler: CollisionHandler;
   private scoreHandler: ScoreHandler;

   constructor(canvas:HTMLCanvasElement, imageArray: any){
      this.canvas = canvas; 
      this.context = this.canvas.getContext('2d');
      this.graphics = new Graphics(this.canvas, this.context);
      this.imageHandler = new ImageHandler(imageArray);
      this.particleSystem = new ParticleSystem(this.graphics);
      this.keyboardHandler = new KeyboardHandler();
      this.scoreHandler = new ScoreHandler();
      this.spaceship = new Spaceship(this.graphics, this.imageHandler.getImage('spaceship'), {x: this.canvas.width / 2, y: this.canvas.height - 100}, {x: 50, y: 50}, this.particleSystem, this.scoreHandler)
      this.enemiesHandler = new EnemiesHandler(this.imageHandler, this.graphics, this.particleSystem, this.spaceship.getPosition, this.scoreHandler);
      this.collisionHandler = new CollisionHandler(this.spaceship, this.enemiesHandler);
      this.registerInput();
   }

   public registerInput(){
      this.keyboardHandler.registerCommand('ArrowLeft', this.spaceship.moveLeft, false);
      this.keyboardHandler.registerCommand('ArrowRight', this.spaceship.moveRight, false);
      this.keyboardHandler.registerCommand(' ', this.spaceship.fire, true)
   }

   public update(elapsedTime: number){
      // console.log(elapsedTime)
      this.particleSystem.linearParticles(10, {mean: 0.5, stdev: 0.2}, {mean: 0.8, stdev: 0.3});
      this.enemiesHandler.update(elapsedTime);
      this.spaceship.update(elapsedTime)
      this.particleSystem.update(elapsedTime);
      this.collisionHandler.checkSpaceshipMissiles();
   }
   
   public processInput(elapsedTime: number){
      this.keyboardHandler.update(elapsedTime); 
   }

   public render(){
      this.graphics.clearRect();
      this.particleSystem.render();
      this.spaceship.render();
      this.enemiesHandler.render();
   }

}