import express from "express";
import bootsrap from './app.controller.js';

const app = express();

const port = 3000;

bootsrap(app, express);
app.listen(port, () => {
    console.log(`Server is running on port:`,port);
});


