const http = require('http');
const path = require('path');
const express = require('express');

// Apply the rate limiting middleware to API calls only
const app = express();

async function launch(){
    const port = 8080;
    const baseDirectory = path.join(__dirname);
    app.use(express.json());
    // Makes an http server out of the express server
    const httpServer = http.createServer(app);

    app.use('/ribbon-tracker', express.static(path.join(__dirname, './ribbon-tracker')));
    app.get(['/ribbon-tracker'], async (req, res) => {
        const filePath = path.join(__dirname, './ribbon-tracker', 'index.template.html')
        res.status(200).sendFile(filePath);
    });

    app.get(['/ribbon-tracker/readme'], async (req, res) => {
        const filePath = path.join(__dirname, './ribbon-tracker', 'readme.html')
        res.status(200).sendFile(filePath);
    });


    // Starts the http server
    httpServer.listen(port, () => {
        // code to execute when the server successfully starts
        console.log(`started on ${port}`);
    });
}

launch();