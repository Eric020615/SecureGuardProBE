import moment from "moment";
import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";
import { CreateVisitorDto, GetVisitorDto } from "../dtos/visitor.dto";
import {
  createVisitorRepository,
  getAllVisitorsRepository,
} from "../repositories/visitor.repository";
import { Visitor } from "../models/visitor.model";
import { Timestamp } from "firebase/firestore";
import { convertTimestampToUserTimezone } from "../helper/time";

export const createVisitorService = async (
  createVisitorDto: CreateVisitorDto,
  userId: string
) => {
  try {
    await createVisitorRepository(
      new Visitor(
        createVisitorDto.visitorName,
        createVisitorDto.visitorCategory,
        createVisitorDto.visitorContactNumber,
        Timestamp.fromDate(moment(createVisitorDto.visitDateTime).toDate()),
        userId,
        userId,
        Timestamp.fromDate(moment().toDate()),
        Timestamp.fromDate(moment().toDate())
      )
    );
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const getAllVisitorService = async () => {
  try {
    const visitors = await getAllVisitorsRepository();
    let data: GetVisitorDto[] = [];
    data = visitors
      ? visitors.map((visitor) => {
          return {
            visitorId: visitor.visitorId,
            visitorName: visitor.visitorName,
            visitorCategory: visitor.visitorCategory,
            visitorContactNumber: visitor.visitorContactNumber,
            visitDateTime: convertTimestampToUserTimezone(
              visitor.visitDateTime
            ),
            createdBy: visitor.createdBy,
            updatedBy: visitor.updatedBy,
            createdDateTime: convertTimestampToUserTimezone(
              visitor.createdDateTime
            ),
            updatedDateTime: convertTimestampToUserTimezone(
              visitor.updatedDateTime
            ),
          } as GetVisitorDto;
        })
      : [];
    return data;
  } catch (error: any) {
    console.log(error)
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};
