import express from 'express';
import * as dotenv from 'dotenv';
import { registerRoutes } from "./registerRoute";

dotenv.config();
const app = express();

registerRoutes(app)

const startServer = async () => {
    try {
        app.listen(3000, () => {
            console.log("Server is listening on http://localhost:3000")
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();