import React, { Component } from "react";

interface IScores {
   name: string;
   score: number;
   shots: number;
   hits: number; 
}

export default class HighScores extends Component {
   private scores: IScores[];
   constructor(props){
      super(props);
      this.scores = [{name: "Zach", score: 50000, shots: 300, hits: 300}, {name: "Zach", score: 50000, shots: 300, hits: 300}, {name: "Zach", score: 50000, shots: 300, hits: 300}];
   }

   renderScores = () => {
      const scores = this.scores; 
      return scores.map(score=><li className="title">{score.name}</li>)
   }


   render(){
      return (
         <div className="game-over">
            <ul>
               <li className="title">HighScores</li>
               {this.renderScores()}
            </ul>
         </div>
      )
   }
}