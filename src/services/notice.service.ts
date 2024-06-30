import {
  CreateNoticeDto,
  GetNoticeDto,
  UpdateNoticeDto,
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

export const createNoticeService = async (createNoticeDto: CreateNoticeDto, userId: string) => {
  try {
    await createNoticeRepository(
      new Notice(
        createNoticeDto.title,
        createNoticeDto.description,
        createNoticeDto.startDate
          ? moment(createNoticeDto.startDate).valueOf()
          : 0,
        createNoticeDto.endDate ? moment(createNoticeDto.endDate).valueOf() : 0,
        userId,
        userId,
        moment().valueOf(),
        moment().valueOf()
      )
    );
  } catch (error: any) {
    throw new OperationError(
      error,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
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
            startDate: notice.startDate
              ? moment(notice.startDate).toString()
              : "",
            endDate: notice.endDate ? moment(notice.endDate).toString() : "",
            createdBy: notice.createdBy,
            createdDateTime: notice.createdDateTime
              ? moment(notice.createdDateTime).toString()
              : "",
            updatedBy: notice.updatedBy,
            updatedDateTime: notice.updatedDateTime
              ? moment(notice.updatedDateTime).toString()
              : "",
          } as GetNoticeDto;
        })
      : [];
    return data;
  } catch (error: any) {
    throw new OperationError(
      error,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
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
            startDate: notice.startDate
              ? moment(notice.startDate).toString()
              : "",
            endDate: notice.endDate ? moment(notice.endDate).toString() : "",
            createdBy: notice.createdBy,
            createdDateTime: notice.createdDateTime
              ? moment(notice.createdDateTime).toString()
              : "",
            updatedBy: notice.updatedBy,
            updatedDateTime: notice.updatedDateTime
              ? moment(notice.updatedDateTime).toString()
              : "",
          } as GetNoticeDto;
        })
      : [];
    return data;
  } catch (error: any) {
    throw new OperationError(
      error,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
  }
};

export const getNoticeByIdService = async (id: string) => {
  try {
    const notice = await getNoticeByIdRepository(id);
    let data: GetNoticeDto[] = [];
    if (notice != null) {
      data.push({
        noticeId: notice.noticeId,
        title: notice.title,
        description: notice.description,
        startDate: notice.startDate ? moment(notice.startDate).toString() : "",
        endDate: notice.endDate ? moment(notice.endDate).toString() : "",
        createdBy: notice.createdBy,
        createdDateTime: notice.createdDateTime
          ? moment(notice.createdDateTime).toString()
          : "",
        updatedBy: notice.updatedBy,
        updatedDateTime: notice.updatedDateTime
          ? moment(notice.updatedDateTime).toString()
          : "",
      } as GetNoticeDto);
    }
    return data;
  } catch (error: any) {
    throw new OperationError(
      error,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
  }
};

export const editNoticeByIdService = async (
  id: string,
  updateNoticeDto: UpdateNoticeDto,
  userId: string
) => {
  try {
    let notice: Notice = {
      title: updateNoticeDto.title,
      description: updateNoticeDto.description,
      startDate: moment(updateNoticeDto.startDate).valueOf(),
      endDate: moment(updateNoticeDto.endDate).valueOf(),
      updatedBy: userId,
      updatedDateTime: moment().valueOf(),
    } as Notice;
    await editNoticeByIdRepository(id, notice);
  } catch (error: any) {
    throw new OperationError(
      error,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
  }
};

export const deleteNoticeByIdService = async (id: string) => {
  try {
    await deleteNoticeByIdRepository(id);
  } catch (error: any) {
    throw new OperationError(
      error,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
  }
};