const http = require('http');
const path = require('path');
const express = require('express');
const { Usecase } = require('./ribbon-tracker/assemble.page');

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
        const fileIn = path.join(__dirname, './ribbon-tracker', 'index.template.html')
        const fileOut = path.join(__dirname, './ribbon-tracker', 'index.html')
        const html = await new Usecase().execute("", fileIn, fileOut)
        res.status(200).send(html);
    });

    app.get(['/ribbon-tracker/:ribbon'], async (req, res) => {
        const ribbonName = req.params.ribbon;
        const status = req.query.status;
        res.status(200).send();
    });


    // Starts the http server
    httpServer.listen(port, () => {
        // code to execute when the server successfully starts
        console.log(`started on ${port}`);
    });
}

launch();