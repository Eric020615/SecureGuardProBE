import { addDoc, collection } from "firebase/firestore"
import firebase from "../config/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { CreateUserDto } from "../dtos/user.dto"
import { LoginDto } from "../dtos/auth.dto"
import { createToken, verifyToken } from "../config/jwt"
import { Controller, Route, Post, Tags, OperationId, Response, SuccessResponse, Body, ValidateParam, BodyProp, Request } from "tsoa"
import { IResponse } from "../dtos/response.dto"

const auth = firebase.FIREBASE_AUTH
  
@Route("auth")
export class AuthController extends Controller {
  
    @Tags("Users")
    @OperationId('registerUser')
    @Response<IResponse<any>>('400', 'Bad Request')
    @SuccessResponse('200', 'OK')
    @Post('/register')
    public async createUser(
      @Body() body: LoginDto
    ): Promise<IResponse<any>> {
      try {
        const response = {
          message: "ok",
          status: "200",
          data: body,
        }
        return response;
      }
      catch(err) {
        this.setStatus(400);
        const response = {
          message: "fail",
          status: "400",
          data: err,
        }
        return response;
      } 
    }
  }

// export const signUpAsResident = async (req: Request<{}, {}, CreateUserDto>, res: Response<IResponse<any>>, next: NextFunction) => {
//     try {
//         const data = req.body;
//         if(data.confirmPassword !== data.password){
//             res.status(500).send({
//                 message : "Confirm Password and Password not Match"
//             })
//             return
//         }
//         const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
//         next();
//         res.status(200).send({
//             message: "Account Created successfully",
//             code: 200
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             message: "Sign Up Failed",
//             code: 500
//         })
//     }
// }

// export const LogIn = async (req: Request<{}, {}, LoginDto>, res: Response<IResponse<any>>, next: NextFunction) => {
//     try {
//         const data = req.body;
//         const response = await signInWithEmailAndPassword(auth, data.email, data.password);
//         const token = createToken(response.user.uid)
//         next();
//         res.status(200).send({
//             data: token,
//             message: "Account Login successfully",
//             code: 200
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             message: "Account Login failed",
//             code: 500
//         });
//     }
// }

// export const checkAuth = async (req: Request<{}, {}, LoginDto>, res: Response<IResponse<any>>, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization;
//         const token = authHeader?.substring(7);
//         const payload = verifyToken(token ? token : "");
//         res.status(200).send({
//             data: token,
//             message: "JWT valid",
//             code: 200
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             message: "JWT invalid",
//             code: 500
//         });
//     }
// }