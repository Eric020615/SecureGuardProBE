import { NextFunction, Request, Response } from "express"
import { addDoc, collection } from "firebase/firestore"
import firebase from "../config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

const auth = firebase.FIREBASE_AUTH

export const signUpAsResident = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const response = await signInWithEmailAndPassword(auth, data.email, data.password);
        next();
        res.status(200).send('account created successfully');
    } catch (error) {
        res.status(400).send(error)
    }
}