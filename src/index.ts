import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import FIREBASE from "../src/config/firebase";
import router from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(router)

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