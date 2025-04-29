export interface Neighbor {
    id: number;
    FirstName: string;
    LastName: string
    MiddleName: string;
    Email: string;
    PhoneNumber: string;
    Foto?: File;
    UserName: string;
    Password: string;
    addresses?: Address[]; // Add the list of addresses property
}

export interface Address {
    id: number; // Optional: ID might not exist for new addresses
    neighborhoodId: number;
    neighborhoodName?: string;
    subdivisionId: number;
    subdivisionName?: string;
    streetId: number;
    streetName?: string;
    number: string;
  }