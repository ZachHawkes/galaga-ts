import React, {Component} from 'react';
import GameModel from "../game-guts/game-model";
import spaceship_small_blue from '../assets/spaceship_small_blue.png';
import butterfly from "../assets/butterfly.png";


export default class Game extends Component {
   private canvas: any;
   private gameModel: GameModel;
   private spaceship: any;
   private butterfly: any; 
   private previousTime: number;
   private gameOver: boolean;  
   private gameMusic: HTMLAudioElement;

   constructor(props: any){
      super(props);
      this.canvas = React.createRef()
      this.spaceship = React.createRef()
      this.butterfly = React.createRef();
      this.previousTime = performance.now();
      this.state = {
         isGameOver: false,
         level: 1,
      }
      this.gameOver = false; 
      this.gameMusic = new Audio();
      this.gameMusic.src = "https://cs5410-galaga.s3-us-west-2.amazonaws.com/galaga-music.mp3";
      this.gameMusic.volume = 0.5;
      this.gameMusic.loop = true; 
   }  
   
   componentDidMount(){
      this.gameModel = new GameModel(this.canvas.current, this.buildImageArray())
      requestAnimationFrame(this.gameloop);
      // this.gameMusic.play();
   }

   buildImageArray = () =>{
      let imageArray = [];
      imageArray.push({name: "spaceship", image: this.spaceship.current})
      imageArray.push({name: "butterfly", image: this.butterfly.current});
      return imageArray
   }

   gameloop = (gameTime: number) =>{
      let elapsedTime = gameTime - this.previousTime;
      this.previousTime = gameTime;
      this.gameModel.processInput(elapsedTime);
      this.gameModel.update(elapsedTime);
      this.gameModel.render();

      requestAnimationFrame(this.gameloop)
   }


   render(){
      return(
         <div>
            <canvas ref={this.canvas} width='1024' height='1024' className="canvas"></canvas>
            <img src={spaceship_small_blue} alt="spaceship" ref={this.spaceship} />
            <img src={butterfly} alt="butterfly-enemy" ref={this.butterfly} />
         </div>
      )
   }
}