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
        console.log(gameStates[ID]);
        if (gameStates[ID] != undefined) {
            var THIS = this;

            clearInterval(gameStates[ID].lastUpdate);
            gameStates[ID].lastUpdate = setTimeout(function() {
                THIS.removeGameState(ID);
            }, 5000);

            var responce = gameStates[ID];
            call_back(
                {
                    'ID': responce.ID,
                    'gameState': responce.gameState
                }
            );
        }
    }

    createNewGame(call_back) {
        const ID = gameStates.length;
        var gameState = new GameState(null, null, [], []);
        gameState.createNewGame();
        var tickInterval = setInterval(function() {
            gameState.tick();
        }, 0);
        var lastUpdate = setTimeout(function() {
            THIS.removeGameState(ID);
        }, 5000);

        gameStates.push(
            {
                'ID': ID,
                'gameState': gameState,
                'tickInterval': tickInterval,
                'lastUpdate': lastUpdate
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

    removeGameState(ID) {
        gameStates.splice(ID, 1);
        console.log('gameState: '+ID+' cleared, gameStates active: '+gameStates.length);
    }

}

module.exports = Model;