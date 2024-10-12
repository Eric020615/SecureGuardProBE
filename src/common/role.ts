export enum RoleEnum {
    'SYSTEM_ADMIN' = 'SA',
    'RESIDENT' = 'RES',
    'RESIDENT_SUBUSER' = 'SUB'
}  

export enum GenderEnum {
    'MALE' = 'M',
    'FEMALE' = 'F'
}

export type RoleParam =
  | "SA"
  | "RES"
  | "SUB";

export const convertRoleEnumMessage = (code: string) => {
    if (code in RoleEnum) {
        return RoleEnum[code as keyof typeof RoleEnum];
    }
    return 'Unknown role';
}