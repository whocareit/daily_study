const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject) {
        const handler = function() {
            if(this.readState !== 4) {
                return;
            }
            if(this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        }
        const clent = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        client.open("GET", url);
        clent.onreadyStatechange = handler;
        clent.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    })
}