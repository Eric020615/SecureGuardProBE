import { LoginDto, RegisterUserDto } from "../dtos/auth.dto"
import { Controller, Route, Post, Tags, OperationId, Response, SuccessResponse, Body, Security, Get } from "tsoa"
import { IResponse } from "../dtos/response.dto"
import { loginService, registerService } from "../services/auth.service"
import { HttpStatusCode } from "../common/http-status-code"
import { OperationError } from "../common/operation-error"
  
@Route("auth")
export class AuthController extends Controller {
  
    @Tags("Auth")
    @OperationId('registerUser')
    @Response<IResponse<any>>('400', 'Bad Request')
    @SuccessResponse('200', 'OK')
    @Post('/sign-up')
    public async signUp(
      @Body() registerUserDto: RegisterUserDto
    ): Promise<IResponse<any>> {
      try {
        const token = await registerService(registerUserDto);
        const response = {
          message: "Account Created successfully",
          status: "200",
          data: token,
        }
        return response;
      }
      catch(err: any) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        if(err instanceof OperationError){
          const response = {
            message: err.message ? err.message : "",
            status: "500",
            data: null,
          }
          return response;
        }
        const response = {
          message: "",
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
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
        if(err instanceof OperationError){
          const response = {
            message: err.message ? err.message : "",
            status: "500",
            data: null,
          }
          return response;
        }
        const response = {
          message: "",
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
    @Get('/check-auth')
    @Security("jwt", ["RES", "SA"])
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
          message: err.message ? err.message : "",
          status: "500",
          data: err,
        }
        return response;
      } 
    }
}