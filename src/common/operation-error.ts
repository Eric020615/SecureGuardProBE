import { HttpStatusCode } from "./http-status-code";

export type OperationErrorMessage =
  | "UNKNOWN_ERROR"
  | "EMAIL_IN_USE"
  | "NOT_FOUND"
  | "INVALID_EMAIL"
  | "TOKEN_NOT_PROVIDED"
  | "SIGNATURE_NOT_FOUND"
  | "JWT_SCOPE_EMPTY"
  | "ROLE_PERMISSION_INVALID"
  | any;

export class OperationError extends Error {
  constructor(message: OperationErrorMessage, readonly status: HttpStatusCode) {
    super(message);
  }
}