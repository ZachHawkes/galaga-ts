import React, { Component } from "react";
import Controls from "./controls";
import HighScores from "./high-scores";
import Game from "./game";
import Galaga from "../assets/galaga.png"

export default class MainMenu extends Component<{}, {menu: string}, {}> {
   private menuMusic: HTMLAudioElement;
   constructor(props){
      super(props);
      this.state = {
         menu: "mainMenu"
      }
      this.menuMusic = new Audio();
      this.menuMusic.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/galaga-music.mp3";
      this.menuMusic.loop = true; 
      this.menuMusic.volume = 0;
   }


   componentDidMount(){
      this.menuMusic.play()
   }

   showControls = () => {
      this.setState({menu: "controls"})
   }

   showMainMenu = () => {
      this.setState({menu: "mainMenu"})
   }

   showHighscores = () => {
      this.setState({menu: "highScores"});
   }

   showCredits = () => {
      this.setState({menu: "credits"})
   }

   startGame = () => {
      this.setState({menu: "game"})
   }

   render(){
      const mainMenu = (
         
         <div className="menu">
         <img src={Galaga} alt="GalagaTitle" className="showImage" />
            <ul>
               <li className="clickable-menu" onClick={this.startGame}>Start Game</li>
               <li className="clickable-menu" onClick={this.showControls}>Controls</li>
               <li className="clickable-menu" onClick={this.showHighscores}>High Scores</li>
               <li className="clickable-menu" onClick={this.showCredits}>Credits</li>
            </ul>
         </div>
      )
      const controls = (
         
         <div className="menu">
         <img src={Galaga} alt="GalagaTitle" className="showImage" />
            <Controls />
            <ul>
               <li className="clickable-menu" onClick={this.showMainMenu}>Back to Main Menu</li>
            </ul>
         </div>
      )
      const highScores = (
         
         <div className="menu">
         <img src={Galaga} alt="GalagaTitle" className="showImage" />
            <HighScores />
            <ul>
               <li className="clickable-menu" onClick={this.showMainMenu}>Back to Main Menu</li>
            </ul>
         </div>
      )
      const credits = (
         
         <div className="menu">
         <img src={Galaga} alt="GalagaTitle" className="showImage" />
            <ul>
               <li className="title">Zach Hawkes worked really hard on this. </li>
               <li className="clickable-menu" onClick={this.showMainMenu}>Back to Main Menu</li>
            </ul>
         </div>
      )


      const renderObject = {
         mainMenu,
         controls,
         highScores,
         game: <Game />, 
         credits
      }

      return renderObject[this.state.menu]
   }
}