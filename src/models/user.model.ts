import { RoleEnum } from "../common/role";
import { Timestamp } from "firebase/firestore";
import { BaseModel } from "./base.model";

export class User extends BaseModel{
  firstName: string;
  lastName: string;
  contactNumber: string;
  gender: string;
  dateOfBirth: Timestamp | null;
  role: RoleEnum;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    contactNumber: string,
    gender: string,
    dateOfBirth: Timestamp | null,
    role: RoleEnum,
    status: number,
    createdBy: string,
    updatedBy: string,
    createdDateTime: Timestamp,
    updatedDateTime: Timestamp
  ) {
    super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime);
    this.firstName = firstName;
    this.lastName = lastName;
    this.contactNumber = contactNumber;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.role = role;
  }
}

export class Resident {
  id?: string;
  unitNumber: string;
  floorNumber: string;
  createdBy: string;
  updatedBy: string;
  createdDateTime: Timestamp;
  updatedDateTime: Timestamp;
  supportedDocumentUrl: string[];

  constructor(
    unitNumber: string,
    floorNumber: string,
    createdBy: string,
    updatedBy: string,
    createdDateTime: Timestamp,
    updatedDateTime: Timestamp,
    supprtedDocumentUrl: string[]
  ) {
    this.unitNumber = unitNumber;
    this.floorNumber = floorNumber;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.createdDateTime = createdDateTime;
    this.updatedDateTime = updatedDateTime;
    this.supportedDocumentUrl = supprtedDocumentUrl;
  }
}

export class SystemAdmin {
  id?: string;
  staffId: string;
  createdBy: string;
  updatedBy: string;
  createdDateTime: Timestamp;
  updatedDateTime: Timestamp;
  supportedDocumentUrl: string[];

  constructor(
    staffId: string,
    createdBy: string,
    updatedBy: string,
    createdDateTime: Timestamp,
    updatedDateTime: Timestamp,
    supprtedDocumentUrl: string[]
  ) {
    this.staffId = staffId;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.createdDateTime = createdDateTime;
    this.updatedDateTime = updatedDateTime;
    this.supportedDocumentUrl = supprtedDocumentUrl;
  }
}