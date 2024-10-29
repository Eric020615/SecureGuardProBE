/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VisitorController } from './controllers/visitor.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './controllers/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RefDataController } from './controllers/refData.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ParcelController } from './controllers/parcel.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NotificationController } from './controllers/notification.controller';
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
    "IResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"any"},{"dataType":"array","array":{"dataType":"any"}},{"dataType":"enum","enums":[null]}]},
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
    "DocumentStatus": {
        "dataType": "refEnum",
        "enums": [1,0,-1,2,3,4],
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
            "status": {"ref":"DocumentStatus","required":true},
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
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetVisitorDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetVisitorDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetVisitorDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationDirection.Next": {
        "dataType": "refEnum",
        "enums": ["next"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationDirection.Previous": {
        "dataType": "refEnum",
        "enums": ["prev"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetVisitorByDateDto": {
        "dataType": "refObject",
        "properties": {
            "date": {"dataType":"string","required":true},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetVisitorByDateDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetVisitorByDateDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorByDateDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetVisitorByDateDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorByDateDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetVisitorByDateDto"}}},{"dataType":"enum","enums":[null]}]},
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
    "RoleEnum": {
        "dataType": "refEnum",
        "enums": ["SA","STF","RES","SUB"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserDto": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"double","required":true},
            "userGuid": {"dataType":"string","required":true},
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
    "IPaginatedResponse_GetUserDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetUserDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResidentInformationDto": {
        "dataType": "refObject",
        "properties": {
            "floor": {"dataType":"string","required":true},
            "unit": {"dataType":"string","required":true},
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
            "userId": {"dataType":"double","required":true},
            "userGuid": {"dataType":"string","required":true},
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
    "IResponse_GetUserDetailsByIdDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetUserDetailsByIdDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetUserDetailsByIdDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditUserDetailsByIdDto": {
        "dataType": "refObject",
        "properties": {
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
    "CreateSubUserRequestDto": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetSubUserByResidentDto": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"double","required":true},
            "userGuid": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "contactNumber": {"dataType":"string","required":true},
            "gender": {"dataType":"string","required":true},
            "dateOfBirth": {"dataType":"string","required":true},
            "status": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetSubUserByResidentDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetSubUserByResidentDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteSubUserByIdDto": {
        "dataType": "refObject",
        "properties": {
            "subUserGuid": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetPropertyListDto": {
        "dataType": "refObject",
        "properties": {
            "floorId": {"dataType":"string","required":true},
            "units": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"assignedTo":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"isAssigned":{"dataType":"boolean","required":true},"unitId":{"dataType":"string"}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetPropertyListDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetPropertyListDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetPropertyListDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateParcelDto": {
        "dataType": "refObject",
        "properties": {
            "parcelImage": {"dataType":"string","required":true},
            "floor": {"dataType":"string","required":true},
            "unit": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetParcelDto": {
        "dataType": "refObject",
        "properties": {
            "parcelId": {"dataType":"double","required":true},
            "parcelGuid": {"dataType":"string","required":true},
            "parcelImage": {"dataType":"string","required":true},
            "floor": {"dataType":"string","required":true},
            "unit": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetParcelDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetParcelDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetParcelDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetParcelDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetParcelDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetNotificationDto": {
        "dataType": "refObject",
        "properties": {
            "notificationId": {"dataType":"double","required":true},
            "notificationGuid": {"dataType":"string","required":true},
            "userGuid": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "body": {"dataType":"string","required":true},
            "data": {"dataType":"any","required":true},
            "isRead": {"dataType":"boolean","required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetNotificationDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetNotificationDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetNotificationDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetNotificationDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetNotificationDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
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
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetNoticeDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetNoticeDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetNoticeDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetNoticeDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditNoticeDto": {
        "dataType": "refObject",
        "properties": {
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
            "spaceId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetFacilityBookingHistoryDto": {
        "dataType": "refObject",
        "properties": {
            "bookingId": {"dataType":"double","required":true},
            "bookingGuid": {"dataType":"string","required":true},
            "facilityName": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
            "bookedBy": {"dataType":"string","required":true},
            "isCancelled": {"dataType":"boolean","required":true},
            "status": {"ref":"DocumentStatus","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginatedResponse_GetFacilityBookingHistoryDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "status": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"list":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetFacilityBookingHistoryDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetFacilityBookingDetailsDto": {
        "dataType": "refObject",
        "properties": {
            "bookingId": {"dataType":"double","required":true},
            "bookingGuid": {"dataType":"string","required":true},
            "facilityName": {"dataType":"string","required":true},
            "startDate": {"dataType":"string","required":true},
            "endDate": {"dataType":"string","required":true},
            "bookedBy": {"dataType":"string","required":true},
            "numOfGuest": {"dataType":"double","required":true},
            "isCancelled": {"dataType":"boolean","required":true},
            "cancelRemark": {"dataType":"string","required":true},
            "status": {"ref":"DocumentStatus","required":true},
            "createdBy": {"dataType":"string","required":true},
            "createdDateTime": {"dataType":"string","required":true},
            "updatedBy": {"dataType":"string","required":true},
            "updatedDateTime": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetFacilityBookingDetailsDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetFacilityBookingDetailsDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingDetailsDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_GetFacilityBookingHistoryDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"GetFacilityBookingHistoryDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"GetFacilityBookingHistoryDto"}},{"dataType":"enum","enums":[null]}]},
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
    "SpaceAvailabilityDto": {
        "dataType": "refObject",
        "properties": {
            "spaceId": {"dataType":"string","required":true},
            "spaceName": {"dataType":"string","required":true},
            "isBooked": {"dataType":"boolean","required":true},
            "capacity": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_SpaceAvailabilityDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"SpaceAvailabilityDto"}},{"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"SpaceAvailabilityDto"}}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
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
            "role": {"dataType":"array","array":{"dataType":"refEnum","ref":"RoleEnum"},"required":true},
            "notificationToken": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestResetPasswordDto": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordDto": {
        "dataType": "refObject",
        "properties": {
            "currentPassword": {"dataType":"string","required":true},
            "newPassword": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthTokenPayloadDto": {
        "dataType": "refObject",
        "properties": {
            "userGuid": {"dataType":"string","required":true},
            "role": {"ref":"RoleEnum","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_AuthTokenPayloadDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"AuthTokenPayloadDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"AuthTokenPayloadDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubUserAuthTokenPayloadDto": {
        "dataType": "refObject",
        "properties": {
            "subUserRequestGuid": {"dataType":"string","required":true},
            "subUserEmail": {"dataType":"string","required":true},
            "parentUserGuid": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_SubUserAuthTokenPayloadDto_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
            "data": {"dataType":"union","subSchemas":[{"ref":"SubUserAuthTokenPayloadDto"},{"dataType":"array","array":{"dataType":"refObject","ref":"SubUserAuthTokenPayloadDto"}},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"string"},
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
            authenticateMiddleware([{"jwt":["RES","SUB","SA"]}]),
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
            authenticateMiddleware([{"jwt":["RES","SUB","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getVisitorByResident)),

            async function VisitorController_getVisitorByResident(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    isPast: {"in":"query","name":"isPast","required":true,"dataType":"boolean"},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
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
            authenticateMiddleware([{"jwt":["RES","SUB","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getVisitorDetails)),

            async function VisitorController_getVisitorDetails(request: ExRequest, response: ExResponse, next: any) {
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
                methodName: 'getVisitorDetails',
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
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getAllVisitors)),

            async function VisitorController_getAllVisitors(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    direction: {"in":"query","name":"direction","required":true,"dataType":"union","subSchemas":[{"ref":"PaginationDirection.Next"},{"ref":"PaginationDirection.Previous"}]},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
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
        app.get('/visitor/admin/analytics',
            authenticateMiddleware([{"jwt":["SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(VisitorController)),
            ...(fetchMiddlewares<RequestHandler>(VisitorController.prototype.getVisitorCountsByDay)),

            async function VisitorController_getVisitorCountsByDay(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    startDate: {"in":"query","name":"startDate","required":true,"dataType":"string"},
                    endDate: {"in":"query","name":"endDate","required":true,"dataType":"string"},
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
                methodName: 'getVisitorCountsByDay',
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
            authenticateMiddleware([{"newUser":["RES","SA","SUB","STF"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createUser)),

            async function UserController_createUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    createUserDto: {"in":"body","name":"createUserDto","required":true,"dataType":"any"},
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
                    direction: {"in":"query","name":"direction","required":true,"dataType":"union","subSchemas":[{"ref":"PaginationDirection.Next"},{"ref":"PaginationDirection.Previous"}]},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
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
            authenticateMiddleware([{"jwt":["SA","RES","SUB","STF"]}]),
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
            authenticateMiddleware([{"jwt":["SA","RES","SUB","STF"]}]),
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
                    userGuid: {"in":"query","name":"userGuid","required":true,"dataType":"string"},
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
                    userGuid: {"in":"query","name":"userGuid","required":true,"dataType":"string"},
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
                    userGuid: {"in":"query","name":"userGuid","required":true,"dataType":"string"},
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
        app.post('/user/sub-user/create',
            authenticateMiddleware([{"jwt":["RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createSubUserRequest)),

            async function UserController_createSubUserRequest(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    createSubUserRequestDto: {"in":"body","name":"createSubUserRequestDto","required":true,"ref":"CreateSubUserRequestDto"},
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
                methodName: 'createSubUserRequest',
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
        app.get('/user/sub-user/list',
            authenticateMiddleware([{"jwt":["RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getSubUserList)),

            async function UserController_getSubUserList(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
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
                methodName: 'getSubUserList',
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
        app.put('/user/sub-user',
            authenticateMiddleware([{"jwt":["RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.editSubUserStatusById)),

            async function UserController_editSubUserStatusById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    subUserGuid: {"in":"query","name":"subUserGuid","required":true,"dataType":"string"},
                    status: {"in":"query","name":"status","required":true,"dataType":"boolean"},
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
                methodName: 'editSubUserStatusById',
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
        app.delete('/user/sub-user',
            authenticateMiddleware([{"jwt":["RES"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.deleteSubUserById)),

            async function UserController_deleteSubUserById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    deleteSubUserByIdDto: {"in":"body","name":"deleteSubUserByIdDto","required":true,"ref":"DeleteSubUserByIdDto"},
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
                methodName: 'deleteSubUserById',
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
        app.get('/ref-data/property',
            ...(fetchMiddlewares<RequestHandler>(RefDataController)),
            ...(fetchMiddlewares<RequestHandler>(RefDataController.prototype.getPropertyList)),

            async function RefDataController_getPropertyList(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    checkOccupied: {"in":"query","name":"checkOccupied","required":true,"dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<RefDataController>(RefDataController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getPropertyList',
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
        app.post('/parcel/staff',
            authenticateMiddleware([{"jwt":["STF"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParcelController)),
            ...(fetchMiddlewares<RequestHandler>(ParcelController.prototype.createParcel)),

            async function ParcelController_createParcel(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    createParcelDto: {"in":"body","name":"createParcelDto","required":true,"ref":"CreateParcelDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ParcelController>(ParcelController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'createParcel',
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
        app.get('/parcel',
            authenticateMiddleware([{"jwt":["RES","SUB"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParcelController)),
            ...(fetchMiddlewares<RequestHandler>(ParcelController.prototype.getParcelByResident)),

            async function ParcelController_getParcelByResident(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ParcelController>(ParcelController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getParcelByResident',
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
        app.get('/parcel/staff',
            authenticateMiddleware([{"jwt":["STF"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParcelController)),
            ...(fetchMiddlewares<RequestHandler>(ParcelController.prototype.getParcelByStaff)),

            async function ParcelController_getParcelByStaff(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ParcelController>(ParcelController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getParcelByStaff',
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
        app.get('/notification',
            authenticateMiddleware([{"jwt":["RES","SUB","STF"]}]),
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.getNotification)),

            async function NotificationController_getNotification(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<NotificationController>(NotificationController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getNotification',
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
                    direction: {"in":"query","name":"direction","required":true,"dataType":"union","subSchemas":[{"ref":"PaginationDirection.Next"},{"ref":"PaginationDirection.Previous"}]},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
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
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
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
        app.get('/notice/details',
            authenticateMiddleware([{"jwt":["RES","SUB","SA","STF"]}]),
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
            authenticateMiddleware([{"jwt":["RES","SUB","SA","STF"]}]),
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
            authenticateMiddleware([{"jwt":["RES","SUB","SA"]}]),
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
            authenticateMiddleware([{"jwt":["RES","SA","SUB"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.getFacilityBookingHistory)),

            async function FacilityController_getFacilityBookingHistory(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    isPast: {"in":"query","name":"isPast","required":true,"dataType":"boolean"},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
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
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.getFacilityBookingHistoryByAdmin)),

            async function FacilityController_getFacilityBookingHistoryByAdmin(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    direction: {"in":"query","name":"direction","required":true,"dataType":"union","subSchemas":[{"ref":"PaginationDirection.Next"},{"ref":"PaginationDirection.Previous"}]},
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
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
                methodName: 'getFacilityBookingHistoryByAdmin',
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
        app.get('/facility/details',
            authenticateMiddleware([{"jwt":["RES","SUB","SA"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.getFacilityBookingDetailsByFacilityGuid)),

            async function FacilityController_getFacilityBookingDetailsByFacilityGuid(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    facilityBookingGuid: {"in":"query","name":"facilityBookingGuid","required":true,"dataType":"string"},
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
                methodName: 'getFacilityBookingDetailsByFacilityGuid',
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
            authenticateMiddleware([{"jwt":["SA","RES","SUB"]}]),
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
        app.get('/facility/available-slot/check',
            authenticateMiddleware([{"jwt":["SA","RES","SUB"]}]),
            ...(fetchMiddlewares<RequestHandler>(FacilityController)),
            ...(fetchMiddlewares<RequestHandler>(FacilityController.prototype.checkFacilitySlot)),

            async function FacilityController_checkFacilitySlot(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    facilityId: {"in":"query","name":"facilityId","required":true,"dataType":"string"},
                    startDate: {"in":"query","name":"startDate","required":true,"dataType":"string"},
                    endDate: {"in":"query","name":"endDate","required":true,"dataType":"string"},
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
                methodName: 'checkFacilitySlot',
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
        app.post('/auth/reset-password/request',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.requestResetPassword)),

            async function AuthController_requestResetPassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestResetPasswordDto: {"in":"body","name":"requestResetPasswordDto","required":true,"ref":"RequestResetPasswordDto"},
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
                methodName: 'requestResetPassword',
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
        app.post('/auth/reset-password',
            authenticateMiddleware([{"jwt":["RES","SA","STF","SUB"]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.resetPassword)),

            async function AuthController_resetPassword(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    resetPasswordDto: {"in":"body","name":"resetPasswordDto","required":true,"ref":"ResetPasswordDto"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                methodName: 'resetPassword',
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
            authenticateMiddleware([{"jwt":["RES","SA","STF","SUB"]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.checkAuth)),

            async function AuthController_checkAuth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    check: {"in":"query","name":"check","dataType":"boolean"},
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
        app.get('/auth/check-auth/sub-user',
            authenticateMiddleware([{"subUserAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.checkSubUserAuth)),

            async function AuthController_checkSubUserAuth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                methodName: 'checkSubUserAuth',
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
