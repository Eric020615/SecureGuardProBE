export interface GeneralFileDto {
	fileName: string
	data: string
}

export interface IResponse<T> {
	message?: string
	data?: T | T[] | IPaginatedResponse<T> | null
	status?: string
}

export interface IPaginatedResponse<T> {
	list?: T[] | null
	count: number
}

export interface PaginationParams {
	page: number
	pageSize: number
}

export interface SearchParams {
	search?: string
}
