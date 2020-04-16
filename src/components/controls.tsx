import React, { Component } from "react"

interface IControls {
   fire: string;
   moveLeft: string;
   moveRight: string;
}

export default class Controls extends Component<{}, IControls, {} > {
   private controls: any; 
   constructor(props){
      super(props);
      this.state = {
            fire: " ",
            moveLeft: "LeftArrow",
            moveRight: "RightArrow",
      }
      this.controls  = JSON.parse(window.localStorage.getItem('galaga-controls'));
   }

   componentDidMount(){
      if(!this.controls){
         const newState = {
            fire: " ",
            moveLeft: "ArrowLeft",
            moveRight: "ArrowRight",
         }
         this.controls = newState;
         this.setState(newState)
      } else {
         this.setState({
            fire: this.controls.fire,
            moveLeft: this.controls.moveLeft, 
            moveRight: this.controls.moveRight,
         })
      }
   }

   setFire = () => {
      this.setState({fire: "Press a Key"})
      let callback = (event)=>{
         this.setState({fire: event.key})
         this.controls.fire = this.state.fire;
         window.localStorage.setItem('galaga-controls', JSON.stringify(this.controls));
         window.removeEventListener('keydown', callback);
      }
      window.addEventListener('keydown', callback)
   }

   setMoveLeft = () => {
      this.setState({moveLeft: "Press a Key"})
      let callback = (event)=>{
         this.setState({moveLeft: event.key})
         this.controls.moveLeft = this.state.moveLeft; 
         window.localStorage.setItem('galaga-controls', JSON.stringify(this.controls));
         window.removeEventListener('keydown', callback);
      }
      window.addEventListener('keydown', callback)
   }

   setMoveRight = () => {
      this.setState({moveRight: "Press a Key"})
      let callback = (event)=>{
         this.setState({moveRight: event.key})
         this.controls.moveRight = this.state.moveRight; 
         window.localStorage.setItem('galaga-controls', JSON.stringify(this.controls));
         window.removeEventListener('keydown', callback);
      }
      window.addEventListener('keydown', callback)
   }

   setDefaults = () =>{
      const newState = {
         fire: " ",
         moveLeft: "ArrowLeft",
         moveRight: "ArrowRight",
      }
      this.controls = newState; 
      window.localStorage.setItem('galaga-controls', JSON.stringify(this.controls))
      this.setState(newState);
   }



   render(){
      return (
         <div>
            <ul>
               <li className="title">Controls: Click to change</li>
               <li className="clickable-menu" onClick={this.setFire}>Fire: {this.state.fire === " " ? "Spacebar" : this.state.fire}</li>
               <li className="clickable-menu" onClick={this.setMoveLeft}>Move Left: {this.state.moveLeft}</li>
               <li className="clickable-menu" onClick={this.setMoveRight}>Move Right: {this.state.moveRight}</li>
               <li className="clickable-menu" onClick={this.setDefaults}>Reset to Defaults</li>
            </ul>
         </div>
      )
   }
}