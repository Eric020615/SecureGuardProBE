export interface GetPropertyListDto {
	floorId: string
	units: {
		unitId: string
		isAssigned: boolean
		assignedTo: string | null
	}[]
}
