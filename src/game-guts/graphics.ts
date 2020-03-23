// type this sucker and your life will be easier. 
interface IPosition {
   x: number,
   y: number,
}

interface IRect {
   center: IPosition,
   size: IPosition,
   rotation: number,
   fill: string,
   stroke: string,
}

export default class Graphics {
   private canvas: HTMLCanvasElement;
   private context: any; 

   constructor(canvas: HTMLCanvasElement, context){
      this.canvas = canvas;
      this.context = context;
   }

   public drawRect(rect: IRect){
      this.context.save();
      this.context.translate(rect.center.x, rect.center.y );
      this.context.rotate(rect.rotation);
      this.context.translate(-rect.center.x, -rect.center.y);
      
      this.context.fillStyle = rect.fill;
      this.context.fillRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);
      
      this.context.strokeStyle = rect.stroke;
      this.context.strokeRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

      this.context.restore();
   }

   public clearRect(){
      this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
   }

   public drawCircle(center: IPosition, radius:number, stroke:string, fill:string){
      console.log(center, radius)
      this.context.fillStyle = fill;
      this.context.strokeStyle = stroke; 
      this.context.arc(center.x, center.y, radius, 0, (2 * Math.PI));
   }

   public drawText(text: string, position: IPosition, color: string, font = "24px arial"){
      this.context.font = font
      this.context.fillStyle = color
      this.context.lineWidth = 1
      this.context.fillText(text, position.x, position.y);
   }

   public drawTexture(image, center: IPosition, rotation: number, size: IPosition) {
      this.context.save();

      this.context.translate(center.x, center.y);
      this.context.rotate(rotation);
      this.context.translate(-center.x, -center.y);

      this.context.drawImage(
          image,
          center.x - size.x / 2,
          center.y - size.y / 2,
          size.x, size.y);

      this.context.restore();
  }
}