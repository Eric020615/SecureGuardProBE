import firebase from "../config/firebase"
import { CreateUserDto } from "../dtos/user.dto"
import { LoginDto } from "../dtos/auth.dto"
import { Controller, Route, Post, Tags, OperationId, Response, SuccessResponse, Body, Security } from "tsoa"
import { IResponse } from "../dtos/response.dto"
import { loginService, registerService } from "../services/auth.service"
import { HttpStatusCode } from "../common/http-status-code"

const auth = firebase.FIREBASE_AUTH
  
@Route("auth")
export class AuthController extends Controller {
  
    @Tags("Auth")
    @OperationId('registerUser')
    @Response<IResponse<any>>('400', 'Bad Request')
    @SuccessResponse('200', 'OK')
    @Post('/sign-up')
    public async createUser(
      @Body() createUserDto: CreateUserDto
    ): Promise<IResponse<any>> {
      try {
        await registerService(createUserDto);
        const response = {
          message: "Account Created successfully",
          status: "200",
          data: null,
        }
        return response;
      }
      catch(err: any) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
          message: err,
          status: "500",
          data: null,
        }
        return response;
      } 
    }

    @Tags("Auth")
    @OperationId('login')
    @Response<IResponse<any>>('400', 'Bad Request')
    @SuccessResponse('200', 'OK')
    @Post('/log-in')
    public async login(
      @Body() loginDto: LoginDto
    ): Promise<IResponse<any>> {
      try {
        const token = await loginService(loginDto);
        const response = {
          message: "Account login successfully",
          status: "200",
          data: token,
        }
        return response;
      }
      catch(err: any) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
          message: "Failed",
          status: "500",
          data: null,
        }
        return response;
      } 
    }

    @Tags("Auth")
    @OperationId('checkAuth')
    @Response<IResponse<any>>('400', 'Bad Request')
    @SuccessResponse('200', 'OK')
    @Post('/check-auth')
    @Security("jwt", ["resident", "admin"])
    public async checkAuth(
    ): Promise<IResponse<any>> {
      try {
        const response = {
          message: "Token valid",
          status: "200",
          data: null,
        }
        return response;
      }
      catch(err: any) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
          message: err,
          status: "500",
          data: err,
        }
        return response;
      } 
    }
}