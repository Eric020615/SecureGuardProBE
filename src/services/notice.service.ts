import { CreateNoticeDto, GetNoticeDto, EditNoticeDto, GetNoticeDetailsDto } from '../dtos/notice.dto'
import { NoticeRepository } from '../repositories/notice.repository'
import { Notice } from '../models/notice.model'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus, PaginationDirection } from '../common/constants'
import { FileService } from './file.service'
import { arrayRemove, arrayUnion } from 'firebase/firestore'

@provideSingleton(NoticeService)
export class NoticeService {
	constructor(
		@inject(NoticeRepository) private noticeRepository: NoticeRepository,
		@inject(FileService) private fileService: FileService,
	) {}
	createNoticeService = async (createNoticeDto: CreateNoticeDto, userId: string) => {
		try {
			const noticeGuid = await this.noticeRepository.createNoticeRepository(
				new Notice(
					0,
					createNoticeDto.title,
					createNoticeDto.description,
					convertDateStringToTimestamp(createNoticeDto.startDate),
					convertDateStringToTimestamp(createNoticeDto.endDate),
					[],
					DocumentStatus.Active,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
			if (!noticeGuid) {
				throw new OperationError('Failed to create notice', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const fileGuids = await this.fileService.uploadMultipleFiles(
				createNoticeDto.attachments,
				`notice/attachments/${noticeGuid}`,
				userId,
				'notice attachments',
			)
			if (fileGuids.length > 0) {
				await this.noticeRepository.editNoticeByIdRepository(noticeGuid, {
					attachments: fileGuids,
				} as Notice)
			}
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNoticeByAdminService = async (direction: PaginationDirection, id: number, limit: number) => {
		try {
			const { rows, count } = await this.noticeRepository.getNoticeByAdminRepository(direction, id, limit)
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
							status: DocumentStatus[notice.status],
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
							status: DocumentStatus[notice.status],
						} as GetNoticeDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNoticeDetailsByIdService = async (noticeGuid: string) => {
		try {
			const notice = await this.noticeRepository.getNoticeDetailsByIdRepository(noticeGuid)
			let data: GetNoticeDetailsDto = {} as GetNoticeDetailsDto
			const attachments = await this.fileService.getFilesByGuidsService(notice.attachments)
			if (notice != null) {
				data = {
					noticeId: notice.id,
					noticeGuid: notice.guid,
					title: notice.title,
					description: notice.description,
					startDate: convertTimestampToUserTimezone(notice.startDate),
					endDate: convertTimestampToUserTimezone(notice.endDate),
					attachments: attachments,
					status: DocumentStatus[notice.status],
					createdBy: notice.createdBy,
					createdDateTime: convertTimestampToUserTimezone(notice.createdDateTime),
					updatedBy: notice.updatedBy,
					updatedDateTime: convertTimestampToUserTimezone(notice.updatedDateTime),
				} as GetNoticeDetailsDto
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
				updatedDateTime: getCurrentTimestamp(),
			} as Notice
			const fileGuids = await this.fileService.editFilesService(
				editNoticeDto.deletedAttachments,
				editNoticeDto.newAttachments ?? [],
				`notice/attachments/${editNoticeDto.noticeGuid}`,
				userId,
				'notice attachments',
			)
			const attachmentUpdates: Record<string, any> = {}
			if (fileGuids.length > 0) {
				attachmentUpdates.attachments = arrayUnion(...fileGuids)
			}
			if (editNoticeDto.deletedAttachments?.length) {
				attachmentUpdates.attachments = arrayRemove(...editNoticeDto.deletedAttachments)
			}
			await this.noticeRepository.editNoticeByIdRepository(editNoticeDto.noticeGuid, {
				...notice,
				...attachmentUpdates,
			})
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
