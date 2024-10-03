export class Facility {
	facilityId?: string
	image: string
	name: string
	spaces: {
		id: string
		name: string
		capacity: number
	}[]
    
	constructor(
		image: string,
		name: string,
		spaces: {
			id: string
			name: string
			capacity: number
		}[],
	) {
        this.image = image
        this.name = name
        this.spaces = spaces
    }
}
