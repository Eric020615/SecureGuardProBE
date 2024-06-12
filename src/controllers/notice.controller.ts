import { NextFunction, Request, Response } from "express"
import { addDoc, and, collection, deleteDoc, doc, getDoc, getDocs, or, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore"
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
        const q = query(noticeCollection)
        const querySnapshot = await getDocs(q)
        let result : getNoticeResponse[] = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data() as getNoticeResponse
            data.noticeId = doc.id
            result.push(data)
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

export const getNoticeById = async (req: Request, res: Response<IResponse<getNoticeResponse>>, next: NextFunction) => {
    try {
        let noticeId = ""
        noticeId = req.query.noticeId ? req.query.noticeId as string : ""
        const noticeDocRef = doc(noticeCollection, noticeId)
        const noticeDoc = await getDoc(noticeDocRef)
        let data : getNoticeResponse = {} as getNoticeResponse;
        data = noticeDoc.data() as getNoticeResponse
        data.noticeId = noticeDoc.id
        let result : getNoticeResponse[] = []
        result.push(data)
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

export const getNoticesByResident = async (req: Request, res: Response<IResponse<getNoticeResponse>>, next: NextFunction) => {
    try {
        const q = query(noticeCollection,                 
            and(
                where("startDate", "<=", moment().tz('Asia/Kuala_Lumpur').toISOString()),
                where("endDate", ">", moment().tz('Asia/Kuala_Lumpur').toISOString()),
            ),
            orderBy("startDate")
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

export const editNotice = async (req: Request, res: Response<IResponse<getNoticeResponse>>, next: NextFunction) => {
    try {
        let noticeId = req.params.id
        let data = req.body
        const docRef = doc(noticeCollection, 
            noticeId
        )
        const querySnapshot = await updateDoc(docRef, data)
        return res.status(200).send({
            data: null,
            code: 200,
            message: "Notice updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to update notice",
            code: 500,
            data: null
        })
    }
}

export const deleteNotice = async (req: Request, res: Response<IResponse<getNoticeResponse>>, next: NextFunction) => {
    try {
        let noticeId = req.params.id
        const docRef = doc(noticeCollection, 
            noticeId
        )
        const querySnapshot = await deleteDoc(docRef)
        return res.status(200).send({
            data: null,
            code: 200,
            message: "Notice updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Failed to update notice",
            code: 500,
            data: null
        })
    }
}