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

export interface AddressResponse {
    id: number;
    neighborhoodId: number;
    neighborhoodName: string;
    subdivisionId: number;
    subdivisionName: string;
    streetId: number;
    streetName: string;
    houseNumber: string;
}

export interface NeighborByIdResponse {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    addresses: AddressResponse[]; // Added addresses property
}