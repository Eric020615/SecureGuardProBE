import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { convertTimestampToUserTimezone, getCurrentDateString, getCurrentTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatusDescriptions, DocumentStatusEnum, ITimeFormat, ParcelStatusEnum } from '../common/constants'
import { ParcelRepository } from '../repositories/parcel.repository'
import { CreateParcelDto, GetParcelDetailsDto, GetParcelDto } from '../dtos/parcel.dto'
import { FileService } from './file.service'
import { Parcels } from '../models/parcels.model'

@provideSingleton(ParcelService)
export class ParcelService {
	constructor(
		@inject(ParcelRepository) private parcelRepository: ParcelRepository,
		@inject(FileService) private fileService: FileService,
	) {}
	createParcelService = async (createParcelDto: CreateParcelDto, userId: string) => {
		try {
			const fileGuid = await this.fileService.uploadFileService(
				createParcelDto.parcelImage,
				`parcel/${createParcelDto.floor}/${createParcelDto.unit}/${getCurrentDateString(ITimeFormat.isoDateTime)}`,
				createParcelDto.parcelImage.contentType,
				userId,
				'parcel image',
			)
			await this.parcelRepository.createParcelRepository(
				new Parcels(
					0,
					fileGuid,
					createParcelDto.floor,
					createParcelDto.unit,
					ParcelStatusEnum.Received,
					DocumentStatusEnum.ACTIVE,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getParcelByResidentService = async (id: number, limit: number, floor: string, unit: string) => {
		try {
			let { rows, count } = await this.parcelRepository.getParcelByResidentRepository(id, limit, floor, unit)
			let data: GetParcelDto[] = []
			data =
				rows && rows.length > 0
					? await Promise.all(
							rows.map(async (parcel) => {
								return {
									parcelId: parcel.id,
									parcelGuid: parcel.guid,
									parcelImage: await this.fileService.getFileByGuidService(parcel.parcelImage),
									floor: parcel.floor,
									unit: parcel.unit,
									createdDateTime: convertTimestampToUserTimezone(parcel.createdDateTime),
								} as GetParcelDto
							}),
					  )
					: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getParcelDetailsByIdService = async (parcelGuid: string) => {
		try {
			const parcel = await this.parcelRepository.getParcelDetailsByIdRepository(parcelGuid)
			let data: GetParcelDetailsDto = {} as GetParcelDetailsDto
			if (parcel != null) {
				data = {
					parcelId: parcel.id,
					parcelGuid: parcel.guid,
					parcelImage: await this.fileService.getFileByGuidService(parcel.parcelImage),
					floor: parcel.floor,
					unit: parcel.unit,
					status: DocumentStatusDescriptions[parcel.status],
					createdBy: parcel.createdBy,
					createdDateTime: convertTimestampToUserTimezone(parcel.createdDateTime),
					updatedBy: parcel.updatedBy,
					updatedDateTime: convertTimestampToUserTimezone(parcel.updatedDateTime),
				} as GetParcelDetailsDto
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deleteParcelByIdService = async (parcelGuid: string) => {
		try {
			await this.parcelRepository.deleteParcelByResidentRepository(parcelGuid)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getParcelByStaffService = async (id: number, limit: number, userGuid: string) => {
		try {
			let { rows, count } = await this.parcelRepository.getParcelByStaffRepository(id, limit, userGuid)
			let data: GetParcelDto[] = []
			data =
				rows && rows.length > 0
					? await Promise.all(
							rows.map(async (parcel) => {
								return {
									parcelId: parcel.id,
									parcelGuid: parcel.guid,
									parcelImage: await this.fileService.getFileByGuidService(parcel.parcelImage),
									floor: parcel.floor,
									unit: parcel.unit,
									status: DocumentStatusDescriptions[parcel.status],
									createdBy: parcel.createdBy,
									createdDateTime: convertTimestampToUserTimezone(parcel.createdDateTime),
									updatedBy: parcel.updatedBy,
									updatedDateTime: convertTimestampToUserTimezone(parcel.updatedDateTime),
								} as GetParcelDto
							}),
					  )
					: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
