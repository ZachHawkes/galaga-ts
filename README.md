This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Ensure Node.js is installed (The newer the better). Navigate to the project folder in terminal.
`yarn && yarn start` or `npm i && npm start` will build and launch the Game.

## Known Bugs

1. Clicking Back while in the middle of the game messes up the sound
2. Enemies fire missiles the moment they start attacking obscuring the attack and making it seem unnatural
3. And probably a lot more that I'm not aware of or can't think of right now.
4. Game window is not adequately dynamic enough to handle all window sizes and resolution.

## Things I want to accomplish with this project

This project was created for CS5410 Final Project. I had fun with this project and want to keep working on it.
I had to crunch really hard to finish this project on time. As a result, I had to write some code that wasn't structured as well as I would have liked. 
So here are some improvements I want to make.

1. Extract move to point functionality from the enemy class and put it in helper functions.
   1. This will allow me to use the functionality in the missile and enemy classes without duplicating code.
   2. It will also clean up the Enemy class and make the code clearer and more concise.
2. I want to create a Mediator object to handle communication between classes.
   1. Currently all classes are tightly coupled. I have to pass functions into the constructor of each class currently for communication between classes.
   2. This will centralize logic and make communication between classes easier to follow and manage.
   3. This will also open the door to possibly adding save games later.
3. I also want to go through all of the code and notate bad code as I find it so I can change it later.
4. Then it will be time to add some more features.
   1. More complete pathing for the enemies
   2. Challenge stages.
   3. Better and more complex sound.
   4. Some alternate and fun weapons for both enemy and player.
   5. Animated sprites.
   6. Maybe extract out copywrighted material and make the game my own.
   7. Should be able to adapt the game to mobile without too much trouble.
