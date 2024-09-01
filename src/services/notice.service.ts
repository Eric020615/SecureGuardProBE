import {
  CreateNoticeDto,
  GetNoticeDto,
  EditNoticeDto,
} from "../dtos/notice.dto";
import {
  createNoticeRepository,
  deleteNoticeByIdRepository,
  editNoticeByIdRepository,
  getAllNoticeRepository,
  getNoticeByIdRepository,
  getNoticeRepository,
} from "../repositories/notice.repository";
import { Notice } from "../models/notice.model";
import moment from "moment";
import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";
import {
  convertDateStringToTimestamp,
  convertTimestampToUserTimezone,
  getNowTimestamp,
} from "../helper/time";

export const createNoticeService = async (
  createNoticeDto: CreateNoticeDto,
  userId: string
) => {
  try {
    await createNoticeRepository(
      new Notice(
        createNoticeDto.title,
        createNoticeDto.description,
        convertDateStringToTimestamp(createNoticeDto.startDate),
        convertDateStringToTimestamp(createNoticeDto.endDate),
        userId,
        userId,
        getNowTimestamp(),
        getNowTimestamp()
      )
    );
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const getAllNoticeService = async () => {
  try {
    const notices = await getAllNoticeRepository();
    let data: GetNoticeDto[] = [];
    data = notices
      ? notices.map((notice) => {
          return {
            noticeId: notice.noticeId,
            title: notice.title,
            description: notice.description,
            startDate: convertTimestampToUserTimezone(notice.startDate),
            endDate: convertTimestampToUserTimezone(notice.endDate),
            createdBy: notice.createdBy,
            createdDateTime: convertTimestampToUserTimezone(
              notice.createdDateTime
            ),
            updatedBy: notice.updatedBy,
            updatedDateTime: convertTimestampToUserTimezone(
              notice.updatedDateTime
            ),
          } as GetNoticeDto;
        })
      : [];
    return data;
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const getNoticeService = async () => {
  try {
    // rmb add repository method for this
    const notices = await getNoticeRepository();
    let data: GetNoticeDto[] = [];
    data = notices
      ? notices.map((notice) => {
          return {
            noticeId: notice.noticeId,
            title: notice.title,
            description: notice.description,
            startDate: convertTimestampToUserTimezone(notice.startDate),
            endDate: convertTimestampToUserTimezone(notice.endDate),
            createdBy: notice.createdBy,
            createdDateTime: convertTimestampToUserTimezone(
              notice.createdDateTime
            ),
            updatedBy: notice.updatedBy,
            updatedDateTime: convertTimestampToUserTimezone(
              notice.updatedDateTime
            ),
          } as GetNoticeDto;
        })
      : [];
    return data;
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const getNoticeByIdService = async (id: string) => {
  try {
    const notice = await getNoticeByIdRepository(id);
    let data: GetNoticeDto = {} as GetNoticeDto;
    if (notice != null) {
      data ={
        noticeId: notice.noticeId,
        title: notice.title,
        description: notice.description,
        startDate: convertTimestampToUserTimezone(notice.startDate),
        endDate: convertTimestampToUserTimezone(notice.endDate),
        createdBy: notice.createdBy,
        createdDateTime: convertTimestampToUserTimezone(notice.createdDateTime),
        updatedBy: notice.updatedBy,
        updatedDateTime: convertTimestampToUserTimezone(notice.updatedDateTime)
      } as GetNoticeDto;
      console.log(data)
    }
    return data;
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const editNoticeByIdService = async (
  editNoticeDto: EditNoticeDto,
  userId: string
) => {
  try {
    let notice: Notice = {
      title: editNoticeDto.title,
      description: editNoticeDto.description,
      startDate: convertDateStringToTimestamp(editNoticeDto.startDate),
      endDate: convertDateStringToTimestamp(editNoticeDto.endDate),
      updatedBy: userId,
      updatedDateTime: getNowTimestamp()
    } as Notice;
    await editNoticeByIdRepository(editNoticeDto.noticeId, notice);
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const deleteNoticeByIdService = async (id: string) => {
  try {
    await deleteNoticeByIdRepository(id);
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};
