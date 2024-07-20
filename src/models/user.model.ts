enum UserRole {
  Resident = "RES",
  System_Admin = "SA",
}

class User {
    id?: string; // Optional
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    gender: string;
    dateOfBirth: Date;
    role: UserRole;
  
    constructor(
      email: string,
      name: string,
      firstName: string,
      lastName: string,
      contactNumber: string,
      gender: string,
      dateOfBirth: Date | string, // Accepts Date object or date string
      role: UserRole,
      id?: string // Optional
    ) {
      this.email = email;
      this.name = name;
      this.firstName = firstName;
      this.lastName = lastName;
      this.contactNumber = contactNumber;
      this.gender = gender;
      this.dateOfBirth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
      this.role = role;
      this.id = id;
    }  
}

class Resident extends User {
  unitNumber: string;
  floorNumber: string;

  constructor(
    email: string,
    name: string,
    firstName: string,
    lastName: string,
    contactNumber: string,
    gender: string,
    dateOfBirth: Date | string,
    unitNumber: string,
    floorNumber: string,
    id?: string // Optional
  ) {
    super(email, name, firstName, 
        lastName, contactNumber, gender,
        dateOfBirth, UserRole.Resident, id);
    this.unitNumber = unitNumber,
    this.floorNumber = floorNumber
  }  
}