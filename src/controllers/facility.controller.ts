import { NextFunction, Request, Response } from "express"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import firebase from "../config/firebase"
import { CreateBookingDto } from "../dtos/facility.dto"
import { IResponse } from "../types/response"
import { verifyToken } from "../config/jwt"

const facilityDB = firebase.FIRESTORE
const facilityCollection = collection(facilityDB, "facility")

export const createBooking = async (req: Request<{}, {}, CreateBookingDto>, res: Response<IResponse>, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.substring(7);
        const payload = verifyToken(token ? token : "");
        const data = req.body;
        const userId = payload?.userId;
        data.userGUID = userId
        await addDoc(facilityCollection, data);
        return res.status(200).send({
            message: "Facility booking created successfully",
            code: 200
        })
    } catch (error) {
        return res.status(500).send({
            message: "Facility booking failed",
            code: 500
        })
    }
}