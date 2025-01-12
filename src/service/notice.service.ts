import { CreateNoticeDto, GetNoticeDto, EditNoticeDto, GetNoticeDetailsDto } from '../dto/notice.dto'
import { NoticeRepository } from '../repository/notice.repository'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatusEnum, PaginationDirectionEnum } from '../common/constants'
import { FileService } from './file.service'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { Notices } from '../model/notices.model'
import { FirebaseAdmin } from '../config/firebaseAdmin'

@provideSingleton(NoticeService)
export class NoticeService {
	private authAdmin
	constructor(
		@inject(NoticeRepository) private noticeRepository: NoticeRepository,
		@inject(FileService) private fileService: FileService,
		@inject(FirebaseAdmin) private firebaseAdmin: FirebaseAdmin,
	) {
		this.authAdmin = this.firebaseAdmin.auth
	}
	createNoticeService = async (createNoticeDto: CreateNoticeDto, userId: string) => {
		try {
			const noticeGuid = await this.noticeRepository.createNoticeRepository(
				new Notices(
					0,
					createNoticeDto.title,
					createNoticeDto.description,
					convertDateStringToTimestamp(createNoticeDto.startDate),
					convertDateStringToTimestamp(createNoticeDto.endDate),
					[],
					DocumentStatusEnum.ACTIVE,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
			if (!noticeGuid) {
				throw new OperationError('Failed to create notice', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const fileGuids = await this.fileService.uploadMultipleFilesService(
				createNoticeDto.attachments,
				`notices/attachments/${noticeGuid}`,
				userId,
				'notice attachments',
			)
			if (fileGuids.length > 0) {
				await this.noticeRepository.editNoticeByIdRepository(noticeGuid, {
					attachments: fileGuids,
				} as Notices)
			}
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNoticeByAdminService = async (direction: PaginationDirectionEnum, id: number, limit: number) => {
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
							status: DocumentStatusEnum[notice.status],
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
							status: DocumentStatusEnum[notice.status],
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
			const createdBy = await this.authAdmin.getUser(notice.createdBy)
			const updatedBy = await this.authAdmin.getUser(notice.updatedBy)
			if (notice != null) {
				data = {
					noticeId: notice.id,
					noticeGuid: notice.guid,
					title: notice.title,
					description: notice.description,
					startDate: convertTimestampToUserTimezone(notice.startDate),
					endDate: convertTimestampToUserTimezone(notice.endDate),
					attachments: attachments,
					status: DocumentStatusEnum[notice.status],
					createdBy: createdBy.email ? createdBy.email : '',
					createdDateTime: convertTimestampToUserTimezone(notice.createdDateTime),
					updatedBy: updatedBy.email ? updatedBy.email : '',
					updatedDateTime: convertTimestampToUserTimezone(notice.updatedDateTime),
				} as GetNoticeDetailsDto
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editNoticeByIdService = async (noticeGuid: string, editNoticeDto: EditNoticeDto, userId: string) => {
		try {
			let notice: Notices = {
				title: editNoticeDto.title,
				description: editNoticeDto.description,
				startDate: convertDateStringToTimestamp(editNoticeDto.startDate),
				endDate: convertDateStringToTimestamp(editNoticeDto.endDate),
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as Notices
			const fileGuids = await this.fileService.editFilesService(
				editNoticeDto.deletedAttachments,
				editNoticeDto.newAttachments ?? [],
				`notices/attachments/${noticeGuid}`,
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
			await this.noticeRepository.editNoticeByIdRepository(noticeGuid, {
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
