export interface GeneralFileDto {
	fileName: string
	data: string
}

export interface IResponse<T> {
	message?: string
	data?: T | T[] | null
	status?: string
}

export interface PaginationParams {
	page: number
	pageSize: number
}

export interface SearchParams {
	search?: string
}

export interface IPaginatedResponse<T> {
	message?: string
	data?: T | T[] | null
	status?: string
    count: number
}