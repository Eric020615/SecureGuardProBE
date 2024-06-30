import moment from "moment";
import "moment-timezone";
import { CancelFacilityBookingDto, CreateFacilityBookingDto, GetFacilityBookingHistoryDto } from "../dtos/facility.dto";
import { FacilityBooking } from "../models/facilityBooking.mode";
import {
    cancelFacilityBookingRepository,
  createFacilityBookingRepository,
  getAllFacilityBookingRepository,
  getFacilityBookingRepository,
} from "../repositories/facility.repository";
import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";

export const createFacilityBookingService = async (
  createFacilityBookingDto: CreateFacilityBookingDto,
  userId: string
) => {
  try {
    await createFacilityBookingRepository(
      new FacilityBooking(
        createFacilityBookingDto.facilityId,
        createFacilityBookingDto.startDate
          ? moment(createFacilityBookingDto.startDate).tz("Asia/Kuala_Lumpur").valueOf()
          : 0,
        createFacilityBookingDto.endDate
          ? moment(createFacilityBookingDto.endDate).tz("Asia/Kuala_Lumpur").valueOf()
          : 0,
        createFacilityBookingDto.bookedBy
          ? createFacilityBookingDto.bookedBy
          : userId,
        createFacilityBookingDto.numOfGuest,
        false,
        "",
        userId,
        userId,
        moment().tz("Asia/Kuala_Lumpur").valueOf(),
        moment().tz("Asia/Kuala_Lumpur").valueOf()
      )
    );
  } catch (error: any) {
    console.log(error)
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const getFacilityBookingService = async (
  userId: string,
  isPast: boolean
) => {
  try {
    const facilityBookings = await getFacilityBookingRepository(userId, isPast);
    let data: GetFacilityBookingHistoryDto[] = [];
    data = facilityBookings
      ? facilityBookings.map((facilityBooking) => {
          return {
            bookingId: facilityBooking.bookingId,
            startDate: facilityBooking.startDate
              ? moment(facilityBooking.startDate).tz("Asia/Kuala_Lumpur").toString()
              : "",
            endDate: facilityBooking.endDate 
              ? moment(facilityBooking.endDate).tz("Asia/Kuala_Lumpur").toString() 
              : "",
            facilityId: facilityBooking.facilityId,
            bookedBy: facilityBooking.bookedBy,
            numOfGuest: facilityBooking.numOfGuest,
            isCancelled: facilityBooking.isCancelled,
            createdBy: facilityBooking.createdBy,
            createdDateTime: facilityBooking.createdDateTime 
                ? moment(facilityBooking.createdDateTime).tz("Asia/Kuala_Lumpur").toString() 
                : "",
            updatedBy: facilityBooking.updatedBy,
            updatedDateTime: facilityBooking.updatedDateTime 
                ? moment(facilityBooking.updatedDateTime).tz("Asia/Kuala_Lumpur").toString() 
                : ""
          } as GetFacilityBookingHistoryDto;
        })
      : [];
    return data;
  } catch (error: any) {
    console.log(error)
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const getAllFacilityBookingService = async (
  ) => {
    try {
      const facilityBookings = await getAllFacilityBookingRepository();
      let data: GetFacilityBookingHistoryDto[] = [];
      data = facilityBookings
        ? facilityBookings.map((facilityBooking) => {
            return {
              bookingId: facilityBooking.bookingId,
              startDate: facilityBooking.startDate
                ? moment(facilityBooking.startDate).tz("Asia/Kuala_Lumpur").toString()
                : "",
              endDate: facilityBooking.endDate 
                ? moment(facilityBooking.endDate).tz("Asia/Kuala_Lumpur").toString() 
                : "",
              facilityId: facilityBooking.facilityId,
              bookedBy: facilityBooking.bookedBy,
              numOfGuest: facilityBooking.numOfGuest,
              isCancelled: facilityBooking.isCancelled,
              createdBy: facilityBooking.createdBy,
              createdDateTime: facilityBooking.createdDateTime 
                  ? moment(facilityBooking.createdDateTime).tz("Asia/Kuala_Lumpur").toString() 
                  : "",
              updatedBy: facilityBooking.updatedBy,
              updatedDateTime: facilityBooking.updatedDateTime 
                  ? moment(facilityBooking.updatedDateTime).tz("Asia/Kuala_Lumpur").toString() 
                  : ""
            } as GetFacilityBookingHistoryDto;
          })
        : [];
      return data;
    } catch (error: any) {
      throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
};

export const cancelFacilityBookingService = async (
    userId: string,
    cancelFacilityBookingDto: CancelFacilityBookingDto, 
    bookingId: string
  ) => {
    try {
      let facilityBooking : FacilityBooking = {
        isCancelled : cancelFacilityBookingDto.isCancelled,
        cancelRemark : cancelFacilityBookingDto.cancelRemark ? 
            cancelFacilityBookingDto.cancelRemark 
            : "Cancel by user",
        updatedBy : userId,
        updatedDateTime : moment().tz("Asia/Kuala_Lumpur").valueOf(),
      } as FacilityBooking;
      await cancelFacilityBookingRepository(facilityBooking, bookingId);
    } catch (error: any) {
      throw new OperationError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    }
  };