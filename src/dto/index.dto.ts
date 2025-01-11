export interface GeneralFileDto {
	fileName: string
	fileData: string
	contentType: string
	size?: number
}

export interface GeneralFileResponseDto {
	fileGuid: string
	fileName: string
	fileUrl: string
	contentType: string
	size?: number
}

export interface IResponse<T> {
	message?: string
	data?: T | T[] | null
	status?: string
}

export interface IPaginatedResponse<T> {
	message?: string
	status?: string
	data: {
		list: T[] | null
		count: number
	}
}

export interface PaginationParams {
	page: number
	pageSize: number
}

export interface SearchParams {
	search?: string
}
