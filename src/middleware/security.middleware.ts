import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../config/jwt"

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).send({
            message: "Authorization failed",
            code: 401
        }) 
    }
    const token = authHeader?.substring(7);
    const payload = verifyToken(token ? token : "");
    next()
}