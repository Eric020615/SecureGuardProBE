import { CreateNoticeDto, GetNoticeDto, EditNoticeDto } from '../dtos/notice.dto'
import { NoticeRepository } from '../repositories/notice.repository'
import { Notice } from '../models/notice.model'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getNowTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus, PaginationDirection } from '../common/constants'

@provideSingleton(NoticeService)
export class NoticeService {
	constructor(@inject(NoticeRepository) private noticeRepository: NoticeRepository) {}
	createNoticeService = async (createNoticeDto: CreateNoticeDto, userId: string) => {
		try {
			await this.noticeRepository.createNoticeRepository(
				new Notice(
					0,
					createNoticeDto.title,
					createNoticeDto.description,
					convertDateStringToTimestamp(createNoticeDto.startDate),
					convertDateStringToTimestamp(createNoticeDto.endDate),
					DocumentStatus.Active,
					userId,
					userId,
					getNowTimestamp(),
					getNowTimestamp(),
				),
			)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getAllNoticeService = async (direction: PaginationDirection, id: number, limit: number) => {
		try {
			const { rows, count } = await this.noticeRepository.getAllNoticeRepository(direction, id, limit)
			let data: GetNoticeDto[] = []
			data = rows
				? rows.map((notice) => {
						return {
							noticeId: notice.id,
							noticeGuid: notice.guid,
							title: notice.title,
							description: notice.description,
							startDate: convertTimestampToUserTimezone(notice.startDate),
							endDate: convertTimestampToUserTimezone(notice.endDate),
							createdBy: notice.createdBy,
							createdDateTime: convertTimestampToUserTimezone(notice.createdDateTime),
							updatedBy: notice.updatedBy,
							updatedDateTime: convertTimestampToUserTimezone(notice.updatedDateTime),
						} as GetNoticeDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNoticeService = async (id: number, limit: number) => {
		try {
			let { rows, count } = await this.noticeRepository.getNoticeRepository(id, limit)
			let data: GetNoticeDto[] = []
			data = rows
				? rows.map((notice) => {
						return {
							noticeId: notice.id,
							noticeGuid: notice.guid,
							title: notice.title,
							description: notice.description,
							startDate: convertTimestampToUserTimezone(notice.startDate),
							endDate: convertTimestampToUserTimezone(notice.endDate),
							createdBy: notice.createdBy,
							createdDateTime: convertTimestampToUserTimezone(notice.createdDateTime),
							updatedBy: notice.updatedBy,
							updatedDateTime: convertTimestampToUserTimezone(notice.updatedDateTime),
						} as GetNoticeDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNoticeByIdService = async (noticeGuid: string) => {
		try {
			const notice = await this.noticeRepository.getNoticeByIdRepository(noticeGuid)
			let data: GetNoticeDto = {} as GetNoticeDto
			if (notice != null) {
				data = {
					noticeId: notice.id,
					noticeGuid: notice.guid,
					title: notice.title,
					description: notice.description,
					startDate: convertTimestampToUserTimezone(notice.startDate),
					endDate: convertTimestampToUserTimezone(notice.endDate),
					createdBy: notice.createdBy,
					createdDateTime: convertTimestampToUserTimezone(notice.createdDateTime),
					updatedBy: notice.updatedBy,
					updatedDateTime: convertTimestampToUserTimezone(notice.updatedDateTime),
				} as GetNoticeDto
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editNoticeByIdService = async (editNoticeDto: EditNoticeDto, userId: string) => {
		try {
			let notice: Notice = {
				title: editNoticeDto.title,
				description: editNoticeDto.description,
				startDate: convertDateStringToTimestamp(editNoticeDto.startDate),
				endDate: convertDateStringToTimestamp(editNoticeDto.endDate),
				updatedBy: userId,
				updatedDateTime: getNowTimestamp(),
			} as Notice
			await this.noticeRepository.editNoticeByIdRepository(editNoticeDto.noticeGuid, notice)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deleteNoticeByIdService = async (noticeGuid: string) => {
		try {
			await this.noticeRepository.deleteNoticeByIdRepository(noticeGuid)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
