const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";
const headers = {
    "Content-Type": "application/json",
};

function apiService(options) {
    const { path, method = "GET", body = {}, type = null } = options;
    const url = `${ baseUrl }${path}`;

    let opts = {
        headers: {
            ...headers,
            "x-access-token": localStorage.getItem( "token" )
        },
        method,
        body: type === "fileUpload" ? body : JSON.stringify( body )
    };

    if ( method === "GET" || method === "DELETE" ) {
        delete opts.body;
    }

    if ( type === "fileUpload" ) {
        delete opts.headers[ "Content-Type" ];
    }

    return fetch( url, opts )
        .then( res => {
            let json = res.json(); // there's always a body
            if (res.status >= 200 && res.status < 300) {
                return json;
            } else {
                return json.then(Promise.reject.bind(Promise));
            }
        } )
}

export default apiService;
