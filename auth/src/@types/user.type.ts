export interface IUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface IUserModel extends IUserRequest {
    role: string;
    isActive: boolean;
}