// Required modules


class Model {
    constructor() {}

    // Methods
    ping(call_back) {
        call_back({ping: 'pong!'});
    }
    
    
}

module.exports = Model;