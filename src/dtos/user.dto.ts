export interface CreateUserDto {
    firstName: string;
    lastName: string;
    userName: string;
    contactNumber: string;
    gender: string;
    dateOfBirth: string;
}

export interface CreateResidentDto extends CreateUserDto {
    unitNumber: string;
    floorNumber: string;
}