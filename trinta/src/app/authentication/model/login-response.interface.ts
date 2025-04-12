export interface LoginResponse {
    id: number;
    token : string;
    userName: string;
    fullName: string;
    role: string;
    location: string;
    avatarUrl? : string;
    startHour: string;     
    endHour: string;
}