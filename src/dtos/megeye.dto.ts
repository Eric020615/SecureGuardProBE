interface MegeyeError {
    status: number;
    source: {}
    title: string;
    detail: string;
    error_code: string;
}

interface MegeyeErrorResponse {
    errors: MegeyeError[];
}


interface FaceData {
  idx: number;
  data: string;
}

interface FeatureData {
  idx: number;
  data: string;
}

export interface CreatePersonDto {
  recognition_type: string; // or other values if applicable
  id?: string;
  is_admin: boolean;
  person_name: string;
  password_encrypt_type?: "aes"; // Optional, if encryption is used
  password?: string; // Optional, if encryption is used
  card_number?: string; // Optional
  group_list: string[];
  face_list?: FaceData[];
  feature_list?: FeatureData[]; // Optional
  feature_version?: string; // Optional, if features are used
  person_code?: string;
  id_number?: string; // Optional, if encryption is used
  visit_begin_time?: string; // Optional, if applicable
  visit_end_time?: string; // Optional, if applicable
  phone_num?: string;
}

export interface EditPersonDto {
  recognition_type: string; // or other values if applicable
  id?: string;
  is_admin: boolean;
  person_name: string;
  password_encrypt_type?: "aes"; // Optional, if encryption is used
  password?: string; // Optional, if encryption is used
  card_number?: string; // Optional
  group_list: string[];
  face_list?: FaceData[];
  feature_list?: FeatureData[]; // Optional
  person_code?: string;
  id_number?: string; // Optional, if encryption is used
  visit_begin_time?: string; // Optional, if applicable
  visit_end_time?: string; // Optional, if applicable
  phone_num?: string;
}

export interface QueryPersonDetailsByIdDto {
  recognition_type: string; // or other values if applicable
  id?: string;
  type: string;
  is_admin: boolean;
  person_name: string;
  card_number?: string; // Optional
  group_list: string[];
  person_code?: string;
  id_number?: string; // Optional, if encryption is used
  visit_begin_time?: string; // Optional, if applicable
  visit_end_time?: string; // Optional, if applicable
  feature_list?: FeatureData[]; // Optional
  phone_num?: string;
  check_feature_status?: string; // Optional
}