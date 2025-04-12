export interface UserCreate {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    role: string,
    foto?: File
}