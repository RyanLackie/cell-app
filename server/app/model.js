// Required modules
const GameState = require('./States/GameState.js');

var gameStates = [];

class Model {
    constructor() {}

    // Methods
    ping(call_back) {
        call_back({ping: 'pong!'});
    }

    getState(ID, call_back) {
        var responce = gameStates[ID];
        call_back(
            {
                'ID': responce.ID,
                'gameState': responce.gameState
            }
        );
    }

    createNewGame(call_back) {
        const ID = gameStates.length;
        var gameState = new GameState(null, null, [], []);
        gameState.createNewGame();
        var tickInterval = setInterval(function() {
            gameState.tick();
        }, 0);

        gameStates.push(
            {
                'ID': ID,
                'gameState': gameState,
                'tickInterval': tickInterval
            }
        );

        var responce = gameStates[ID];
        call_back(
            {
                'ID': responce.ID,
                'gameState': responce.gameState
            }
        );
    }

}

module.exports = Model;