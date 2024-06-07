import { NextFunction, Request, Response } from "express"
import { addDoc, and, collection, doc, getDoc, getDocs, or, query, setDoc, where } from "firebase/firestore"
import firebase from "../config/firebase"
import { CreateBookingDto } from "../dtos/facility.dto"
import { IResponse, getBookingHistoryResponse, getNoticeResponse } from "../types/response"
import { verifyToken } from "../config/jwt"
import moment from "moment";
import "moment-timezone"
import { CreateNoticeDto } from "../dtos/notice.dto"

const noticesDB = firebase.FIRESTORE
const noticeCollection = collection(noticesDB, "notice")

export const createNotice = async (req: Request<{}, {}, CreateNoticeDto>, res: Response<IResponse<any>>, next: NextFunction) => {
    try {
        const data = req.body;
        await addDoc(noticeCollection, data);
        return res.status(200).send({
            message: "Notices created successfully",
            code: 200
        })
    } catch (error) {
        return res.status(500).send({
            message: "Notices booking failed",
            code: 500
        })
    }
}

export const getNotices = async (req: Request, res: Response<IResponse<getNoticeResponse>>, next: NextFunction) => {
    try {
        const data = req.body;
        const q = query(noticeCollection, 
            // and(
            //     where("userGUID", "==", userId),
            //     where("startDate", isPast ? "<=" : ">", moment().tz('Asia/Kuala_Lumpur').toISOString())
            // )
        )
        const querySnapshot = await getDocs(q)
        let result : getNoticeResponse[] = [];
        querySnapshot.forEach((doc) => {
            result.push(doc.data() as getNoticeResponse)
        })
        return res.status(200).send({
            data: result,
            code: 200,
            message: "Notices get successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to get notices",
            code: 500,
            data: null
        })
    }
}