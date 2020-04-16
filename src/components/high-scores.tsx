import React, { Component } from "react";

interface IScores {
   name: string;
   score: number;
   shots: number;
   hits: number;
   level: number;  
}

export default class HighScores extends Component {
   private scores: {scores: IScores[]};
   constructor(props){
      super(props);
      this.scores = JSON.parse(window.localStorage.getItem('galaga-scores'))
   }

   renderScores = () => {
      const highscores = this.scores;
      if(!highscores) return <li className="title">No highscores yet!</li> 
      console.log(highscores)
      return highscores.scores.sort((a, b)=>b.score - a.score).map((score, index)=><li className="title" key={index}>{`Name: ${score.name} -- Score: ${score.score} -- Level: ${score.level}`}</li>)
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