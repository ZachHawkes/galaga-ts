interface IEventSettings {
   disableRepeat: boolean;
   elapsedTime?: number;
   repeatRate?: number;
}

export default class KeyboardHandler {
   public keys: any; 
   public handlers: any;
   private onKeyUpHandlers: any; 

   constructor(){
      this.keys = {};
      this.handlers = {};
      this.onKeyUpHandlers = {};
      window.addEventListener('keydown', function(e) {
         if(e.keyCode === 32 && e.target === document.body) {
           e.preventDefault();
         }
       });
       
   }
   
   public registerCommand(key, handler, onKeyUp: boolean){
      if(onKeyUp){
         this.onKeyUpHandlers[key] = handler
      } else {
         this.handlers[key] = handler;
      }
      this.addListeners(); 
   }

   private addListeners(){
      document.addEventListener('keydown', this.keyPress);
      document.addEventListener('keyup', this.keyRelease);
   }

   public keyPress = (e)=>{
      this.keys[e.key] = e.timeStamp;
   }

   public keyRelease = (e)=> {
      if(this.keys){
         delete this.keys[e.key];
      }
      if(this.onKeyUpHandlers[e.key]){
         this.onKeyUpHandlers[e.key]();
      }
   }

   public update(elapsedTime: number) {
      for (let key in this.keys) {
         if (this.keys.hasOwnProperty(key)) {
            if (this.handlers[key]) {
               this.handlers[key](elapsedTime);
            }
         }
      }
   }
}