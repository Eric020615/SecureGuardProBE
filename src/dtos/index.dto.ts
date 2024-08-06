export interface GeneralFileDto {
	fileName: string;
	data: string
}

export interface IResponse<T> {
    message?: string
    data?: T | T[] | null
    status?: string
}