import React, { Component } from "react";
import Controls from "./controls";
import HighScores from "./high-scores";
import Game from "./game";
import Galaga from "../assets/galaga.png"

export default class MainMenu extends Component<{menu: string}, {menu: string}, {}> {
   private menuMusic: HTMLAudioElement;
   constructor(props){
      super(props);
      this.state = {
         menu: this.props.menu
      }
      this.menuMusic = new Audio();
      this.menuMusic.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/galaga-music.mp3";
      this.menuMusic.loop = true; 
      this.menuMusic.volume = 0.7;
   }


   componentDidMount(){
      // this.menuMusic.play();
   }

   playMusic = () =>{
      this.menuMusic.play();
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
               <li className="clickable-menu" onClick={this.playMusic}>Turn On Music</li>
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
      const game = (
         <div className="menu">
            <Game/>
            <ul>
               <li className="clickable-menu game-back" onClick={this.showMainMenu}>Back to Main Menu</li>
            </ul>
         </div>
      )


      const renderObject = {
         mainMenu,
         controls,
         highScores,
         game, 
         credits
      }

      return renderObject[this.state.menu]
   }
}