import { NextFunction, Request, Response } from "express"
import { addDoc, collection } from "firebase/firestore"
import firebase from "../config/firebase"
import { CreateBookingDto } from "../dtos/facility.dto"
import { IResponse } from "../types/response"

const facilityDB = firebase.FIRESTORE

export const createBooking = async (req: Request<{}, {}, CreateBookingDto>, res: Response<IResponse>, next: NextFunction) => {
    try {
        const data = req.body;
        console.log(data)
        await addDoc(collection(facilityDB, 'facility'), data);
        next()
        res.status(200).send({
            message: "Facility booking created successfully",
            code: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Facility booking failed",
            code: 500
        })
    }
}