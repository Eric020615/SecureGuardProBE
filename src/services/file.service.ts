import { ref, uploadString, getDownloadURL, getStorage, deleteObject } from 'firebase/storage'
import { inject } from 'inversify'
import { FirebaseClient } from '../config/initFirebase' // adjust the path as needed
import { GeneralFileDto, GeneralFileResponseDto } from '../dtos/index.dto'
import { provideSingleton } from '../helper/provideSingleton'
import { DocumentStatusEnum } from '../common/constants'
import { getCurrentTimestamp } from '../helper/time'
import { FileRepository } from '../repositories/file.repository'
import { Files } from '../models/files.model'

@provideSingleton(FileService)
export class FileService {
	private storage: ReturnType<typeof getStorage>

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient, // Inject and persist FirebaseClient
		@inject(FileRepository)
		private fileRepository: FileRepository,
	) {
		this.storage = this.firebaseClient.storage // Store the storage instance
	}

	public uploadFileService = async (
		file: GeneralFileDto,
		folderpath: string,
		contentType: string,
		userGuid: string,
		description: string,
	) => {
		try {
			const storageRef = ref(this.storage, `${folderpath}`)
			const snapshot = await uploadString(storageRef, file.fileData, 'base64', {
				contentType: contentType,
			})
			const fileURL = await getDownloadURL(snapshot.ref)
			const fileModel = new Files(
				0,
				file.fileName,
				fileURL,
				file.contentType,
				DocumentStatusEnum.Active,
				userGuid,
				userGuid,
				getCurrentTimestamp(),
				getCurrentTimestamp(),
				file.size,
				description,
			)
			const fileGuid = await this.fileRepository.createFileRepository(fileModel)
			return fileGuid
		} catch (error) {
			console.error(error)
			throw new Error('File upload failed')
		}
	}

	public uploadMultipleFilesService = async (
		fileDto: GeneralFileDto[],
		folderpath: string,
		userGuid: string,
		description?: string,
	) => {
		try {
			// Now use this.storage which persists across the method
			const fileURLs = await Promise.all(
				fileDto.map(async (file) => {
					const storageRef = ref(this.storage, `${folderpath}/${file.fileName}`)
					const snapshot = await uploadString(storageRef, file.fileData, 'base64')
					const fileURL = await getDownloadURL(snapshot.ref)
					const fileModel = new Files(
						0,
						file.fileName,
						fileURL,
						file.contentType,
						DocumentStatusEnum.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
						file.size,
						description,
					)
					const fileGuid = await this.fileRepository.createFileRepository(fileModel)
					return fileGuid
				}),
			)

			return fileURLs
		} catch (error) {
			console.error(error)
			throw new Error('File upload failed')
		}
	}

	public getFileByGuidService = async (fileGuid: string) => {
		try {
			const file = await this.fileRepository.getFileByGuidRepository(fileGuid)
			let data: GeneralFileResponseDto = {} as GeneralFileResponseDto
			if (file != null) {
				data = {
					fileGuid: file.guid,
					fileName: file.fileName,
					fileUrl: file.fileURL,
					contentType: file.contentType,
					size: file.size,
				} as GeneralFileResponseDto
			}
			return data
		} catch (error) {
			console.error(error)
			throw new Error('Failed to get files')
		}
	}

	public getFilesByGuidsService = async (fileGuids: string[]) => {
		try {
			const files = await this.fileRepository.getFilesByGuidsRepository(fileGuids)
			let data: GeneralFileResponseDto[] = []
			data = files
				? files.map((file) => {
						return {
							fileGuid: file.guid,
							fileName: file.fileName,
							fileUrl: file.fileURL,
							contentType: file.contentType,
							size: file.size,
						} as GeneralFileResponseDto
				  })
				: []
			return data
		} catch (error) {
			console.error(error)
			throw new Error('Failed to get files')
		}
	}

	public editFilesService = async (
		oldFileGuids: string[] | undefined,
		newFiles: GeneralFileDto[],
		folderpath: string,
		userGuid: string,
		description?: string,
	) => {
		try {
			if (oldFileGuids && oldFileGuids.length > 0) {
				await Promise.all(
					oldFileGuids.map(async (fileGuid) => {
						const file = await this.fileRepository.getFileByGuidRepository(fileGuid)
						if (file) {
							const storageRef = ref(this.storage, file.fileURL)
							await deleteObject(storageRef)
							await this.fileRepository.deleteFileByIdRepository(fileGuid)
						}
					}),
				)
			}

			const fileGuids = await Promise.all(
				newFiles.map(async (file) => {
					const storageRef = ref(this.storage, `${folderpath}/${file.fileName}`)
					const snapshot = await uploadString(storageRef, file.fileData, 'base64', {
						contentType: file.contentType,
					})
					const fileURL = await getDownloadURL(snapshot.ref)

					const fileModel = new Files(
						0,
						file.fileName,
						fileURL,
						file.contentType,
						DocumentStatusEnum.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
						file.size,
						description,
					)
					return await this.fileRepository.createFileRepository(fileModel)
				}),
			)
			return fileGuids
		} catch (error) {
			console.error(error)
			throw new Error('Failed to edit files')
		}
	}
}
