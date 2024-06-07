import { NextFunction, Request, Response } from "express"
import { addDoc, and, collection, doc, getDoc, getDocs, or, query, setDoc, where } from "firebase/firestore"
import firebase from "../config/firebase"
import { CreateBookingDto } from "../dtos/facility.dto"
import { IResponse, getBookingHistoryResponse } from "../types/response"
import { verifyToken } from "../config/jwt"
import moment from "moment";
import "moment-timezone"

const facilityDB = firebase.FIRESTORE
const facilityCollection = collection(facilityDB, "facility")

export const createBooking = async (req: Request<{}, {}, CreateBookingDto>, res: Response<IResponse<any>>, next: NextFunction) => {
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

export const createBookingByAdmin = async (req: Request<{}, {}, CreateBookingDto>, res: Response<IResponse<any>>, next: NextFunction) => {
    try {
        const data = req.body;
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

export const getBookingHistory = async (req: Request, res: Response<IResponse<getBookingHistoryResponse>>, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        let isPast = true
        isPast = req.query.isPast === "true" ? true : false
        const token = authHeader?.substring(7);
        const payload = verifyToken(token ? token : "");
        const data = req.body;
        const userId = payload?.userId;
        const q = query(facilityCollection, 
            and(
                where("userGUID", "==", userId),
                where("startDate", isPast ? "<=" : ">", moment().tz('Asia/Kuala_Lumpur').toISOString())
            )
        )
        const querySnapshot = await getDocs(q)
        let result : getBookingHistoryResponse[] = [];
        querySnapshot.forEach((doc) => {
            result.push(doc.data() as getBookingHistoryResponse)
        })
        return res.status(200).send({
            data: result,
            code: 200,
            message: "Facility get successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to get facility",
            code: 500,
            data: null
        })
    }
}

export const getBookingHistoryByAdmin = async (req: Request, res: Response<IResponse<getBookingHistoryResponse>>, next: NextFunction) => {
    try {
        const q = query(facilityCollection)
        const querySnapshot = await getDocs(q)
        let result : getBookingHistoryResponse[] = [];
        querySnapshot.forEach((doc) => {
            result.push(doc.data() as getBookingHistoryResponse)
        })
        return res.status(200).send({
            data: result,
            code: 200,
            message: "Facility get successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to get facility",
            code: 500,
            data: null
        })
    }
}