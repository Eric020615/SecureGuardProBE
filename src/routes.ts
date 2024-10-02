/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VisitorController } from './controllers/visitor.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './controllers/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NoticeController } from './controllers/notice.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FacilityController } from './controllers/facility.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FaceAuthController } from './controllers/faceAuthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './controllers/auth.controller';
import { expressAuthentication } from './middleware/security.middleware';
// @ts-ignore - no great way to install types from subpackage
import { iocContainer } from './ioc';
import type { IocContainer, IocContainerFactory } from '@tsoa/runtime';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IPaginatedResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"any"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"any"},{"dataType":"array","array":{"dataType":"any"}},{"ref":"IPaginatedResponse_any_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateVisitorDto": {
        "dataType": "refObject",
        "properties": {
            "visitorName": {"dataType":"string","required":true},
            "visitorCategory": {"dataType":"string","required":true},
            "visitorContactNumber": {"dataType":"string","required":true},
            "visitDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetVisitorDto": {
        "dataType": "refObject",
        "properties": {
            "visitorId": {"dataType":"double","required":true},
            "visitorGuid": {"dataType":"string","required":true},
            "visitorName": {"dataType":"string","required":true},
            "visitorCategory": {"dataType":"string","required":true},
            "visitorContactNumber": {"dataType":"string","required":true},
            "visitDateTime": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetVisitorDto_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_IPaginatedResponse_GetVisitorDto__": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"IPaginatedResponse_GetVisitorDto_"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IPaginatedResponse_GetVisitorDto__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"IPaginatedResponse_GetVisitorDto_"},{"dataType":"array","array":{"dataType":"refObject","ref":"IPaginatedResponse_GetVisitorDto_"}},{"ref":"IPaginatedResponse_IPaginatedResponse_GetVisitorDto__"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetVisitorDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetVisitorDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}}},{"ref":"IPaginatedResponse_GetVisitorDto-Array_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetVisitorDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetVisitorDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}},{"ref":"IPaginatedResponse_GetVisitorDto_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditVisitorByIdDto": {
        "dataType": "refObject",
        "properties": {
            "visitorName": {"dataType":"string","required":true},
            "visitorCategory": {"dataType":"string","required":true},
            "visitorContactNumber": {"dataType":"string","required":true},
            "visitDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GeneralFileDto": {
        "dataType": "refObject",
        "properties": {
            "fileName": {"dataType":"string","required":true},
            "data": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GenderEnum": {
        "dataType": "refEnum",
        "enums": ["M","F"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResidentDto": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "contactNumber": {"dataType":"string","required":true},
            "gender": {"ref":"GenderEnum","required":true},
            "dateOfBirth": {"dataType":"string","required":true},
            "unitNumber": {"dataType":"string","required":true},
            "floorNumber": {"dataType":"string","required":true},
            "supportedFiles": {"dataType":"array","array":{"dataType":"refObject","ref":"GeneralFileDto"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSystemAdminDto": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "contactNumber": {"dataType":"string","required":true},
            "gender": {"ref":"GenderEnum","required":true},
            "dateOfBirth": {"dataType":"string","required":true},
            "staffId": {"dataType":"string","required":true},
            "supportedFiles": {"dataType":"array","array":{"dataType":"refObject","ref":"GeneralFileDto"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleEnum": {
        "dataType": "refEnum",
        "enums": ["SA","RES"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserDto": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "contactNumber": {"dataType":"string","required":true},
            "gender": {"dataType":"string","required":true},
            "role": {"ref":"RoleEnum","required":true},
            "dateOfBirth": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetUserDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDto"}}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetUserDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDto"}}},{"ref":"IPaginatedResponse_GetUserDto-Array_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResidentInformationDto": {
        "dataType": "refObject",
        "properties": {
            "floorNumber": {"dataType":"string","required":true},
            "unitNumber": {"dataType":"string","required":true},
            "supportedFiles": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SystemInformationDto": {
        "dataType": "refObject",
        "properties": {
            "staffId": {"dataType":"string","required":true},
            "supportedFiles": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserDetailsByIdDto": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "contactNumber": {"dataType":"string","required":true},
            "gender": {"dataType":"string","required":true},
            "role": {"ref":"RoleEnum","required":true},
            "roleInformation": {"dataType":"union","subSchemas":[{"ref":"ResidentInformationDto"},{"ref":"SystemInformationDto"}]},
            "dateOfBirth": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean"},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetUserDetailsByIdDto_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDetailsByIdDto"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetUserDetailsByIdDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetUserDetailsByIdDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDetailsByIdDto"}},{"ref":"IPaginatedResponse_GetUserDetailsByIdDto_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditUserDetailsByIdDto": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "contactNumber": {"dataType":"string","required":true},
            "gender": {"dataType":"string","required":true},
            "dateOfBirth": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateNoticeDto": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetNoticeDto": {
        "dataType": "refObject",
        "properties": {
            "noticeId": {"dataType":"double","required":true},
            "noticeGuid": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetNoticeDto_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_IPaginatedResponse_GetNoticeDto__": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"IPaginatedResponse_GetNoticeDto_"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IPaginatedResponse_GetNoticeDto__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"IPaginatedResponse_GetNoticeDto_"},{"dataType":"array","array":{"dataType":"refObject","ref":"IPaginatedResponse_GetNoticeDto_"}},{"ref":"IPaginatedResponse_IPaginatedResponse_GetNoticeDto__"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetNoticeDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetNoticeDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}}},{"ref":"IPaginatedResponse_GetNoticeDto-Array_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetNoticeDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetNoticeDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}},{"ref":"IPaginatedResponse_GetNoticeDto_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditNoticeDto": {
        "dataType": "refObject",
        "properties": {
            "noticeId": {"dataType":"string","required":true},
            "noticeGuid": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteNoticeDto": {
        "dataType": "refObject",
        "properties": {
            "noticeGuid": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateFacilityBookingDto": {
        "dataType": "refObject",
        "properties": {
            "bookedBy": {"dataType":"string"},
            "facilityId": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
            "numOfGuest": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetFacilityBookingHistoryDto": {
        "dataType": "refObject",
        "properties": {
            "bookingId": {"dataType":"double","required":true},
            "bookingGuid": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "facilityId": {"dataType":"string","required":true},
            "facilityName": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
            "bookedBy": {"dataType":"string","required":true},
            "numOfGuest": {"dataType":"double","required":true},
            "isCancelled": {"dataType":"boolean","required":true},
            "cancelRemark": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetFacilityBookingHistoryDto_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_IPaginatedResponse_GetFacilityBookingHistoryDto__": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"IPaginatedResponse_GetFacilityBookingHistoryDto_"}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IPaginatedResponse_GetFacilityBookingHistoryDto__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"IPaginatedResponse_GetFacilityBookingHistoryDto_"},{"dataType":"array","array":{"dataType":"refObject","ref":"IPaginatedResponse_GetFacilityBookingHistoryDto_"}},{"ref":"IPaginatedResponse_IPaginatedResponse_GetFacilityBookingHistoryDto__"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetFacilityBookingHistoryDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "list": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}}},{"dataType":"enum","enums":[null]}]},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetFacilityBookingHistoryDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}}},{"ref":"IPaginatedResponse_GetFacilityBookingHistoryDto-Array_"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CancelFacilityBookingDto": {
        "dataType": "refObject",
        "properties": {
            "bookingGuid": {"dataType":"string","required":true},
            "cancelRemark": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserFaceAuthDto": {
        "dataType": "refObject",
        "properties": {
            "faceData": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserDto": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "confirmPassword": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginDto": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.post('/visitor/create',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.createVisitor)),

            async function VisitorController_createVisitor(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    createVisitorDto: {"in":"body","name":"createVisitorDto","required":true,"ref":"CreateVisitorDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<VisitorController>(VisitorController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'createVisitor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/visitor',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getVisitorByResident)),

            async function VisitorController_getVisitorByResident(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    isPast: {"in":"query","name":"isPast","required":true,"dataType":"boolean"},
                    page: {"in":"query","name":"page","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<VisitorController>(VisitorController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getVisitorByResident',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/visitor/details',
            authenticateMiddleware([{"jwt":["RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getVisitorDetailsByResident)),

            async function VisitorController_getVisitorDetailsByResident(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    visitorGuid: {"in":"query","name":"visitorGuid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<VisitorController>(VisitorController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getVisitorDetailsByResident',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/visitor/admin',
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getAllVisitors)),

            async function VisitorController_getAllVisitors(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<VisitorController>(VisitorController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllVisitors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/visitor/edit',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.editVisitorById)),

            async function VisitorController_editVisitorById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    editVisitorByIdDto: {"in":"body","name":"editVisitorByIdDto","required":true,"ref":"EditVisitorByIdDto"},
                    visitorGuid: {"in":"query","name":"visitorGuid","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<VisitorController>(VisitorController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'editVisitorById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/create',
            authenticateMiddleware([{"newUser":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createUser)),

            async function UserController_createUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    createUserDto: {"in":"body","name":"createUserDto","required":true,"dataType":"union","subSchemas":[{"ref":"CreateResidentDto"},{"ref":"CreateSystemAdminDto"}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user/user-list',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserList)),

            async function UserController_getUserList(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    isActive: {"in":"query","name":"isActive","required":true,"dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getUserList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user/profile',
            authenticateMiddleware([{"jwt":["SA","RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserProfileById)),

            async function UserController_getUserProfileById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getUserProfileById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/user/profile',
            authenticateMiddleware([{"jwt":["SA","RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.editUserProfileById)),

            async function UserController_editUserProfileById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    editUserDetailsByIdDto: {"in":"body","name":"editUserDetailsByIdDto","required":true,"ref":"EditUserDetailsByIdDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'editUserProfileById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user/details',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserDetailsById)),

            async function UserController_getUserDetailsById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    userId: {"in":"query","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getUserDetailsById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/user/activate',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.activateUserById)),

            async function UserController_activateUserById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    userId: {"in":"query","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'activateUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/user/deactivate',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.deactivateUserById)),

            async function UserController_deactivateUserById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    userId: {"in":"query","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'deactivateUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/notice/create',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(NoticeController)),
            ...(fetchMiddlewares<RequestHandler>(NoticeController.prototype.createNotice)),

            async function NoticeController_createNotice(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    createNoticeDto: {"in":"body","name":"createNoticeDto","required":true,"ref":"CreateNoticeDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NoticeController>(NoticeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'createNotice',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/notice/admin',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(NoticeController)),
            ...(fetchMiddlewares<RequestHandler>(NoticeController.prototype.getAllNotice)),

            async function NoticeController_getAllNotice(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    page: {"in":"query","name":"page","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NoticeController>(NoticeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllNotice',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/notice',
            ...(fetchMiddlewares<RequestHandler>(NoticeController)),
            ...(fetchMiddlewares<RequestHandler>(NoticeController.prototype.getNotice)),

            async function NoticeController_getNotice(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    page: {"in":"query","name":"page","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NoticeController>(NoticeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getNotice',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/notice/detail',
            ...(fetchMiddlewares<RequestHandler>(NoticeController)),
            ...(fetchMiddlewares<RequestHandler>(NoticeController.prototype.getNoticeById)),

            async function NoticeController_getNoticeById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    noticeGuid: {"in":"query","name":"noticeGuid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NoticeController>(NoticeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getNoticeById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/notice/edit',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(NoticeController)),
            ...(fetchMiddlewares<RequestHandler>(NoticeController.prototype.editNoticeById)),

            async function NoticeController_editNoticeById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    editNoticeDto: {"in":"body","name":"editNoticeDto","required":true,"ref":"EditNoticeDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NoticeController>(NoticeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'editNoticeById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/notice/delete',
            ...(fetchMiddlewares<RequestHandler>(NoticeController)),
            ...(fetchMiddlewares<RequestHandler>(NoticeController.prototype.deleteNoticeById)),

            async function NoticeController_deleteNoticeById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    deleteNoticeDto: {"in":"body","name":"deleteNoticeDto","required":true,"ref":"DeleteNoticeDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NoticeController>(NoticeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'deleteNoticeById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/facility/create',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.createFacilityBooking)),

            async function FacilityController_createFacilityBooking(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    createFacilityBookingDto: {"in":"body","name":"createFacilityBookingDto","required":true,"ref":"CreateFacilityBookingDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<FacilityController>(FacilityController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'createFacilityBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/facility',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.getFacilityBookingHistory)),

            async function FacilityController_getFacilityBookingHistory(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    isPast: {"in":"query","name":"isPast","required":true,"dataType":"boolean"},
                    page: {"in":"query","name":"page","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<FacilityController>(FacilityController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getFacilityBookingHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/facility/admin',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.getAllFacilityBooking)),

            async function FacilityController_getAllFacilityBooking(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    page: {"in":"query","name":"page","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<FacilityController>(FacilityController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllFacilityBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/facility/cancel',
            authenticateMiddleware([{"jwt":["SA","RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.cancelFacilityBooking)),

            async function FacilityController_cancelFacilityBooking(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    cancelFacilityBookingDto: {"in":"body","name":"cancelFacilityBookingDto","required":true,"ref":"CancelFacilityBookingDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<FacilityController>(FacilityController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'cancelFacilityBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/face-auth/user/upload',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(FaceAuthController)),
            ...(fetchMiddlewares<RequestHandler>(FaceAuthController.prototype.uploadUserFaceAuth)),

            async function FaceAuthController_uploadUserFaceAuth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    createUserFaceAuthDto: {"in":"body","name":"createUserFaceAuthDto","required":true,"ref":"CreateUserFaceAuthDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<FaceAuthController>(FaceAuthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'uploadUserFaceAuth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/face-auth/user/update',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(FaceAuthController)),
            ...(fetchMiddlewares<RequestHandler>(FaceAuthController.prototype.updateUserFaceAuth)),

            async function FaceAuthController_updateUserFaceAuth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    updateUserFaceAuthDto: {"in":"body","name":"updateUserFaceAuthDto","required":true,"ref":"CreateUserFaceAuthDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<FaceAuthController>(FaceAuthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'updateUserFaceAuth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/sign-up',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.signUp)),

            async function AuthController_signUp(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    registerUserDto: {"in":"body","name":"registerUserDto","required":true,"ref":"RegisterUserDto"},
                    role: {"in":"query","name":"role","required":true,"ref":"RoleEnum"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<AuthController>(AuthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'signUp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/log-in',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    loginDto: {"in":"body","name":"loginDto","required":true,"ref":"LoginDto"},
                    role: {"in":"query","name":"role","required":true,"ref":"RoleEnum"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<AuthController>(AuthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/auth/check-auth',
            authenticateMiddleware([{"jwt":["RES","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.checkAuth)),

            async function AuthController_checkAuth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<AuthController>(AuthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'checkAuth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
