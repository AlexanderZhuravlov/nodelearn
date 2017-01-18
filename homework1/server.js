// Require modules
const http = require('http');
const fs = require('fs');
const mime = require('mime');
const url = require('url');

// Server start function
function start() {
    function onRequest(request, response) {
        let pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(3000);
    console.log("Server has started on port 3000");
}

// Export functions
exports.start = start;