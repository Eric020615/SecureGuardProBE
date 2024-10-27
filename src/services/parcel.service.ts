import { CreateNoticeDto, GetNoticeDto, EditNoticeDto } from '../dtos/notice.dto'
import { NoticeRepository } from '../repositories/notice.repository'
import { Notice } from '../models/notice.model'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	convertDateStringToTimestamp,
	getCurrentDate,
	getCurrentDateString,
	getCurrentTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus, ITimeFormat } from '../common/constants'
import { ParcelRepository } from '../repositories/parcel.repository'
import { CreateParcelDto } from '../dtos/parcel.dto'
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
}
