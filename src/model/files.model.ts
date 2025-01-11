import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'
import { DocumentStatusEnum } from '../common/constants'

export interface FileMetadata {
	fileName: string
	fileURL: string
	contentType: string // MIME type of the file (e.g., 'image/png', 'application/pdf')
	size?: number // Optional: Size of the file in bytes
	description?: string // Optional: Description or notes about the file
}

export class Files extends BaseModel implements FileMetadata {
	fileName: string
	fileURL: string
	contentType: string
	size?: number
	description?: string

	constructor(
		id: number,
		fileName: string,
		fileURL: string,
		contentType: string,
		status: DocumentStatusEnum,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
		size?: number,
		description?: string,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
		this.fileName = fileName
		this.fileURL = fileURL
		this.contentType = contentType
		this.size = size
		this.description = description
	}
}
