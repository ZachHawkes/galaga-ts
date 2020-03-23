interface ImageObject{
   name: string; 
   image: HTMLImageElement;
}

export default class ImageHandler {
   private images: ImageObject[];

   constructor(imageArray: ImageObject[]){
      this.images = imageArray
   }

   public getImage(name: string){
      let image;
      this.images.forEach(imageObject =>{
         if(imageObject.name === name){
            image = imageObject.image;
         }
      })
      return image;
   }
}