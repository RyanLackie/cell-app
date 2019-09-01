const api_root = "http://localhost:81";
//const api_root = "http://134.209.217.37:";

// Methods
export function ping() {
    return myFetch(api_root + "/app/ping", {});
}

export function getState(ID) {
    return myFetch(api_root + "/app/getState", {
        ID
    });
}

export function createNewGame() {
    return myFetch(api_root + "/app/createNewGame", {});
}


function myFetch(url = ``, data = null) {
    let options = {
        cache: "no-cache",
        credentials: "same-origin"
    };
    if (data) {
        options = { 
            ...options,
            method:  "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
        };
    }
    return fetch(url, options)
    .then(response => {
        return response.json()
    });
}