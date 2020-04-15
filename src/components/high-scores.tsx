import React, { Component } from "react";

interface IScores {
   score: number;
   shots: number;
   hits: number; 
}

export default class HighScores extends Component<{}, {scores: IScores[]}, {}> {
   constructor(props){
      super(props);
      this.state = {
         scores: [] 
      }
   }

   renderScores = () => {
      const scores = this.state.scores; 
      return scores.map(score=><li className="clickable-menu">score</li>)
   }


   render(){
      return (
         <div>
            <ul>
               <li className="title">HighScores</li>
               {this.renderScores()}
            </ul>
         </div>
      )
   }
}