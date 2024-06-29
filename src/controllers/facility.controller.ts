import { NextFunction, Request, Response } from "express"
import { addDoc, and, collection, doc, getDoc, getDocs, or, query, setDoc, updateDoc, where } from "firebase/firestore"
import firebase from "../config/firebase"
import { CreateBookingDto, GetBookingHistoryDto } from "../dtos/facility.dto"
import { verifyToken } from "../config/jwt"
import moment from "moment";
import "moment-timezone"
import { IResponse } from "../dtos/response.dto"

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
            status: "200"
        })
    } catch (error) {
        return res.status(500).send({
            message: "Facility booking failed",
            status: "500"
        })
    }
}

export const createBookingByAdmin = async (req: Request<{}, {}, CreateBookingDto>, res: Response<IResponse<any>>, next: NextFunction) => {
    try {
        const data = req.body;
        await addDoc(facilityCollection, data);
        return res.status(200).send({
            message: "Facility booking created successfully",
            status: "200"
        })
    } catch (error) {
        return res.status(500).send({
            message: "Facility booking failed",
            status: "500"
        })
    }
}

export const getBookingHistory = async (req: Request, res: Response<IResponse<GetBookingHistoryDto>>, next: NextFunction) => {
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
        let result : GetBookingHistoryDto[] = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data() as GetBookingHistoryDto
            data.bookingId = doc.id
            result.push(data)
        })
        return res.status(200).send({
            data: result,
            status: "200",
            message: "Facility get successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to get facility",
            status: "500",
            data: null
        })
    }
}

export const getBookingHistoryByAdmin = async (req: Request, res: Response<IResponse<GetBookingHistoryDto>>, next: NextFunction) => {
    try {
        const q = query(facilityCollection)
        const querySnapshot = await getDocs(q)
        let result : GetBookingHistoryDto[] = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data() as GetBookingHistoryDto
            data.bookingId = doc.id
            result.push(data)
        })
        return res.status(200).send({
            data: result,
            status: "200",
            message: "Facility get successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to get facility",
            status: "500",
            data: null
        })
    }
}

export const cancelBooking = async (req: Request, res: Response<IResponse<GetBookingHistoryDto>>, next: NextFunction) => {
    try {
        let bookingId = ""
        let cancelRemark = ""
        bookingId = req.body.bookingId ? req.body.bookingId as string : ""
        cancelRemark = req.body.cancelRemark ? req.body.cancelRemark as string : "Cancel by user"
        const data = {
            cancelRemark: cancelRemark,
            isCancelled: true
        };
        const docRef = doc(facilityCollection, 
            bookingId
        )
        const querySnapshot = await updateDoc(docRef, data)
        return res.status(200).send({
            data: null,
            status: "200",
            message: "Booking cancel successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to cancel booking",
            status: "500",
            data: null
        })
    }
}