export interface LoginResponse {
    id: number;
    userId: number;
    token : string;
    userName: string;
    fullName: string;
    name: string;
    role: string;
    location: [{
        idNeighborsAddress: number;
        location: string;
    }];
    avatarUrl? : string;
    startHour: string;     
    endHour: string;
}