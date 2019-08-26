const api_root = "http://localhost:";
//const api_root = "http://134.209.217.37:";
const jsPort = 81;
const pyPort = 82;

// Methods
export function ping_js() {
    console.log(myFetch(api_root+jsPort + "/app/ping", {}));
}


export function ping_py() {
    console.log(myFetch(api_root+pyPort + "/ping", {}));
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