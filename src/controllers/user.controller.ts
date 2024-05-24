import { NextFunction, Request, Response } from "express"
import { addDoc, collection } from "firebase/firestore"
import firebase from "../config/firebase"
import { CreateUserDto } from "../dtos/user.dto"

const userDB = firebase.FIRESTORE

export const createUser = async (req: Request<{}, {}, CreateUserDto>, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        await addDoc(collection(userDB, 'user'), data);
        next()
        res.status(200).send('user created successfully')
    } catch (error) {
        res.status(400).send(error)
    }
}