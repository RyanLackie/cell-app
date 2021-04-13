const apiRoot = "http://localhost:8000";

// Methods
export function ping() {
    return myFetch(`${apiRoot}/app/ping`, {});
}

export function getState(ID) {
    return myFetch(`${apiRoot}/app/getState`, {
        ID
    });
}

export function createNewGame() {
    return myFetch(`${apiRoot}/app/createNewGame`, {});
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
