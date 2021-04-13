# Cell Game App

## Project Dependencies
You'll need to run the api server to have this app render the game.
Go to https://github.com/RyanLackie/cell-api/tree/master, clone and follow the steps to set it up.

## Project setup
```
npm install
npm run serve
```

### About the game
This game is still being worked on but it is usable for anyone interested.

The home screen will allow you to pick a set of images but they won't be displayed on the cells yet :( instead a couple of pre-picked images will be rendered.

You and maybe a friend can pick a side (Green or Red) and see which of the randomly spawned computer controlled sides wins as we can move and zoom in to watch.

Food is spawned randomly for the cells to eat and if they are bigger than an enemy cell, they will try to eat that too.

The physics are handled by a self-written simple physics library but if I continue to develop this project it’ll be switched to a fully functional physics library such as matter.js which I used for another project (A top down shooter!... that is currently private - sorry)

Feel free to reach out if you have any questions about the project!
