export enum RoleEnum {
    'SYSTEM_ADMIN' = 'SA',
    'RESIDENT' = 'RES',
}  

export type RoleParam =
  | "SA"
  | "RES"

export const convertRoleEnumMessage = (code: string) => {
    if (code in RoleEnum) {
        return RoleEnum[code as keyof typeof RoleEnum];
    }
    return 'Unknown role';
}