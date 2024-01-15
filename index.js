const http = require('http');
const path = require('path');
const express = require('express');
const species = require('./species')

// Apply the rate limiting middleware to API calls only
const app = express();

async function launch(){
    const port = 8075;
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

    app.get(['/cry/:cry'], async (req, res) => {
        console.log(req.params.cry)
        try {
            if (!isNaN(req.params.cry)) {
                const mon = species.at(Number(req.params.cry)-1)
                res.status(200).send(mon.name.toLowerCase().replace(' ', ''));
            } else {
                res.status(200).send(req.params.cry.toLowerCase().replace(' ', ''));
            }
        } catch (e) {
            console.warn(e)
            res.status(200).send("torkoal");
        }
    });


    // Starts the http server
    httpServer.listen(port, () => {
        // code to execute when the server successfully starts
        console.log(`started on ${port}`);
    });
}

launch();