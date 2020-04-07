import Graphics from "./graphics";
import ImageHandler from "./image-handler";
import Spaceship from "./spaceship"
import KeyboardHandler from "./keyboard-handler";
import ParticleSystem from "./particle-system";

export default class GameModel {
   private canvas: HTMLCanvasElement;
   private context: any;
   private graphics: Graphics;
   private imageHandler: ImageHandler;
   private spaceship: Spaceship;
   public keyboardHandler: KeyboardHandler;
   private particleSystem: ParticleSystem;

   constructor(canvas:HTMLCanvasElement, imageArray: any){
      this.canvas = canvas; 
      this.context = this.canvas.getContext('2d');
      this.graphics = new Graphics(this.canvas, this.context);
      this.imageHandler = new ImageHandler(imageArray);
      this.particleSystem = new ParticleSystem(this.graphics);
      this.spaceship = new Spaceship(this.graphics, this.imageHandler.getImage('spaceship'), {x: this.canvas.width / 2, y: this.canvas.height - 100}, {x: 50, y: 50}, this.particleSystem)
      this.keyboardHandler = new KeyboardHandler();
      this.registerInput();
   }

   public registerInput(){
      this.keyboardHandler.registerCommand('ArrowLeft', this.spaceship.moveLeft, false);
      this.keyboardHandler.registerCommand('ArrowRight', this.spaceship.moveRight, false);
      this.keyboardHandler.registerCommand(' ', this.spaceship.fire, true)
   }

   public update(elapsedTime: number){
      this.particleSystem.linearParticles(10, {mean: 0.5, stdev: 0.2}, {mean: 0.5, stdev: 0.3});
      this.spaceship.update(elapsedTime)
      this.particleSystem.update(elapsedTime);
   }
   
   public processInput(elapsedTime: number){
      this.keyboardHandler.update(elapsedTime); 
   }

   public render(){
      this.graphics.clearRect();
      this.particleSystem.render();
      this.spaceship.render();
   }

}