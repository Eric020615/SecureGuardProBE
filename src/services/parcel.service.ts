import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	convertTimestampToUserTimezone,
	getCurrentDateString,
	getCurrentTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus, ITimeFormat } from '../common/constants'
import { ParcelRepository } from '../repositories/parcel.repository'
import { CreateParcelDto, GetParcelDto } from '../dtos/parcel.dto'
import { Parcel } from '../models/parcel.model'
import { FileService } from './file.service'

@provideSingleton(ParcelService)
export class ParcelService {
	constructor(
		@inject(ParcelRepository) private parcelRepository: ParcelRepository,
		@inject(FileService) private fileService: FileService,
	) {}
	createParcelService = async (createParcelDto: CreateParcelDto, userId: string) => {
		try {
			const fileUrl = await this.fileService.uploadFile(
				createParcelDto.parcelImage,
				`parcelImage/${createParcelDto.floor}/${createParcelDto.unit}/${getCurrentDateString(
					ITimeFormat.isoDateTime,
				)}`,
				'image/jpeg',
			)
			await this.parcelRepository.createParcelRepository(
				new Parcel(
					0,
					fileUrl,
					createParcelDto.floor,
					createParcelDto.unit,
					DocumentStatus.Active,
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
			data = rows
				? rows.map((parcel) => {
						return {
							parcelId: parcel.id,
							parcelGuid: parcel.guid,
							parcelImage: parcel.parcelImageUrl,
							floor: parcel.floor,
							unit: parcel.unit,
							status: parcel.status,
							createdBy: parcel.createdBy,
							createdDateTime: convertTimestampToUserTimezone(parcel.createdDateTime),
							updatedBy: parcel.updatedBy,
							updatedDateTime: convertTimestampToUserTimezone(parcel.updatedDateTime),
						} as GetParcelDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
