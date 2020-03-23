import Graphics from "./graphics";
import ImageHandler from "./image-handler";

export default class GameModel {
   private canvas: HTMLCanvasElement;
   private context: any;
   private rect: any; // temporary proof of concept
   private graphics: Graphics;
   private image: any; 
   private imageHandler: ImageHandler;

   constructor(canvas:HTMLCanvasElement, imageArray: any){
      console.log(canvas)
      this.canvas = canvas; 
      this.context = this.canvas.getContext('2d');
      this.graphics = new Graphics(this.canvas, this.context);
      this.imageHandler = new ImageHandler(imageArray)
      this.rect =  {
            image: this.imageHandler.getImage('spaceship'),
            center:{x: 500, y: 500},
            size: {x: 50, y: 50},
            rotation: 0,
      }
      console.log(this.image)
   }

   public update(elapsedTime: number){
      this.rect.rotation += (Math.PI / 2) * (elapsedTime / 1000);
   }

   public processInput(){

   }

   public render(){
      this.graphics.clearRect();
      // console.log(this.image)
      this.graphics.drawTexture(this.rect.image, this.rect.center, this.rect.rotation, this.rect.size);
   }

}