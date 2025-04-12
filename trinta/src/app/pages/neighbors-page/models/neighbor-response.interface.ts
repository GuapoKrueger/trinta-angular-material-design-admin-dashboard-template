export interface NeighborResponse {
    Id: number;
    FirstName: string;
    LastName: string;
    MiddleName: string;
    Email: string;
    PhoneNumber: string;
    AvatarUrl: string;
    Active: string
}

export interface NeighborByIdResponse {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    userName: string;
    password: string;
    houseNumber: string;
    email: string;
    phoneNumber: string;
    neighborhoodId: number;
    subdivisionId: number;
    streetId: number;
    avatarUrl: string;
}