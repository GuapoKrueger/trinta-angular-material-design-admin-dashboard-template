export interface LoginResponse {
    id: number;
    userId: number;
    token : string;
    userName: string;
    fullName: string;
    role: string;
    location: [{
        idNeighborsAddress: number;
        location: string;
    }];
    avatarUrl? : string;
    startHour: string;     
    endHour: string;
}