import React, { Component } from "react"

interface IControls {
   fire: string;
   moveLeft: string;
   moveRight: string;
}

export default class Controls extends Component<{}, IControls, {} > {
   constructor(props){
      super(props);
      this.state = {
            fire: "Spacebar",
            moveLeft: "LeftArrow",
            moveRight: "RightArrow",
      }
   }


   render(){
      return (
         <div>
            <ul>
               <li className="title">Controls: Click to change</li>
               <li className="clickable-menu">Fire: {this.state.fire}</li>
               <li className="clickable-menu">Move Left: {this.state.moveLeft}</li>
               <li className="clickable-menu">Move Right: {this.state.moveRight}</li>
            </ul>
         </div>
      )
   }
}