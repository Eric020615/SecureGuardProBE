import { RoleEnum } from "../common/role";
import { Timestamp } from "firebase/firestore";

export class User {
    id?: string; // Optional
    firstName: string;
    lastName: string;
    contactNumber: string;
    gender: string;
    dateOfBirth: Timestamp | null;
    role: RoleEnum;
    createdBy: string;
    updatedBy: string;
    createdDateTime: Timestamp;
    updatedDateTime: Timestamp;
  
    constructor(
      firstName: string,
      lastName: string,
      contactNumber: string,
      gender: string,
      dateOfBirth: Timestamp | null,
      role: RoleEnum,
      createdBy: string,
      updatedBy: string,
      createdDateTime: Timestamp,
      updatedDateTime: Timestamp,
    ) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.contactNumber = contactNumber;
      this.gender = gender;
      this.dateOfBirth = dateOfBirth;
      this.role = role;
      this.createdBy = createdBy;
      this.updatedBy = updatedBy;
      this.createdDateTime = createdDateTime;
      this.updatedDateTime = updatedDateTime;
    }  
}

export class Resident {
  unitNumber: string;
  floorNumber: string;
  createdDateTime: Timestamp;
  updatedDateTime: Timestamp;
  supportedDocumentUrl: string[];

  constructor(
    unitNumber: string,
    floorNumber: string,
    createdDateTime: Timestamp,
    updatedDateTime: Timestamp,
    supprtedDocumentUrl: string[]
  ) {
    this.unitNumber = unitNumber,
    this.floorNumber = floorNumber,
    this.createdDateTime = createdDateTime;
    this.updatedDateTime = updatedDateTime;
    this.supportedDocumentUrl = supprtedDocumentUrl;
  }  
}