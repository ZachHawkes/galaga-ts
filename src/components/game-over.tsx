import React from "react";

interface IScoreObject {
   score: number;
   shots: number;
   hits: number;
   level: number;
}

export default function(props: {scoreObject: IScoreObject}){
   const inputValue = React.createRef<HTMLInputElement>();
   const button = React.createRef<HTMLButtonElement>();

   function saveScore(){
      let highscores = JSON.parse(window.localStorage.getItem('galaga-scores'));
      let score = {
         ...props.scoreObject,
         name: inputValue.current.value,
      }
      if(!highscores){
         let newScores = {scores: [score]};
         window.localStorage.setItem('galaga-scores', JSON.stringify(newScores));
      } else {
         highscores.scores.push(score);
         window.localStorage.setItem('galaga-scores', JSON.stringify(highscores));
      }
      inputValue.current.disabled = true; 
      button.current.disabled =true; 
   }

   const {score, shots, hits, level} = props.scoreObject;
   return (
      <div className="border-screen game-menu">
         <ul>
            <li className="title score">Score: {score}</li>
            <li className="title score">Level: {level}</li>
            <li className="title score">Enemies Hit: {hits}</li>
            <li className="title score">Shots Fired: {shots}</li>
            <li className="title score">Accuracy: {(Math.round(hits / shots) * 100) + "%"}</li>
         <input type="text" placeholder="Name" id="name" ref={inputValue}></input>
         <button onClick={saveScore} ref={button}>Submit Score</button>
         </ul>
      </div>
   )
}