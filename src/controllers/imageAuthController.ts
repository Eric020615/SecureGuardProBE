import { IResponse } from "../dtos/index.dto";
import {
  Body,
  Controller,
  OperationId,
  Post,
  Get,
  Response,
  Route,
  SuccessResponse,
  Tags,
  Path,
  Put,
  Security,
  Request,
  Query,
} from "tsoa";
import { HttpStatusCode } from "../common/http-status-code";
import { MegeyeService } from "../services/megeye.service";

@Route("image-auth")
export class ImageAuthController extends Controller {
  private megeyeService: MegeyeService;

  constructor() {
    super();
    this.megeyeService = new MegeyeService();
  }

  @Tags("ImageAuth")
  @OperationId("test")
  @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/")
  //   @Security("jwt", ["RES", "SA"])
  public async getPersonnel(): Promise<IResponse<any>> {
    try {
      const data = await this.megeyeService.queryPersonnel();
      const response = {
        message: "Successfully retrieved personnel",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve personnel",
        status: "500",
        data: null,
      };
      return response;
    }
  }
}
