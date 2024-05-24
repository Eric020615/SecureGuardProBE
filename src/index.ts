import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import FIREBASE from "../src/config/firebase";
import router from './routes';

dotenv.config();
const app = express();

// apply cross-origin security
app.use(cors());
app.use(express.json());
app.use(router)

const startServer = async () => {
    try {
        app.listen(3000, () => {
            FIREBASE.FIREBASE_AUTH
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();