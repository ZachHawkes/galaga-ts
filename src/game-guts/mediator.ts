

interface IEvent {
   name: string;
   handlers: any[];
}

export default class Mediator {
   private events: IEvent[];

   constructor(){
      this.events = [];
   }

   // return true if event exists, false if it doesn't
   public addEvent(name:string, handler): boolean{
      let added = false; 
      this.events.forEach(event=>{
         if(event.name === name){
            event.handlers.push(handler)
            added = true; 
         }
      })
      if(added) return added;
      this.events.push({
         name,
         handlers: [handler]
      })
      return false; 
   }

   // return false if name doesn't exist
   public publishEvent(name:string, params?): boolean{
      let success = false; 
      this.events.forEach(event=>{
         if(event.name === name){
            event.handlers.forEach(handler=>{
               handler(...params)
            })
            success = true; 
         }
      })
      return success; 
   }
}