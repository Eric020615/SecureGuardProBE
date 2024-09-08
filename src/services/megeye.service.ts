import { HttpStatusCode } from "../common/http-status-code";
import { OperationError } from "../common/operation-error";
import {listUrl, MegeyeManager } from "../config/megeye";

export class MegeyeService {
  private megeyeManager: MegeyeManager;

  constructor() {
    this.megeyeManager = new MegeyeManager();
  }

  public async queryPersonnel() {
    try {
      await this.megeyeManager.requestNewCookie();
      const [success, response] = await this.megeyeManager.MegeyeGlobalHandler(
        {
          path: listUrl.personnelManagement.query.path,
          type: listUrl.personnelManagement.query.type,
          data: {
            limit: 10,
            offset: 0,
            sort: "asc",
          },
        },
      );
      console.log(response);
      // const result : IResponse<any> = {
      //     success,
      //     msg: success ? 'success': response?.message,
      //     data: success ? response?.data : undefined
      // }
      // return result;
    } catch (error: any) {
      console.log(error);
      //   const result : IResponse<any> = {
      //     success: false,
      //     msg: error,
      //     data: null
      // }
      // return result;
      throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  };
}
