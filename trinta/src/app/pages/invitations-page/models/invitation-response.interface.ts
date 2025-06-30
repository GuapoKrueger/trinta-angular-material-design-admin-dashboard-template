export interface InvitationResponse {
    phoneNumber: string;
    guestName: string;
    startTime: Date;
    endTime: Date;
    isReusable: string;
    neighborName: string;
    location: string;
    avatarUrl?: string;
    accessType: string;
    imageEventoURL: string;
}

export interface AccessServiceType {
    id: number;
    name: string;
}

export interface InvitationByIdNeighborResponse { 
    id: number;
    phoneNumber: string;
    guestName: string;
    startTime: Date;
    endTime: Date;
    isReusable: string;
    isActive: boolean;
    isUsed: boolean;
    accessType: string;
    neighborAddressId : number;
    fullAddress: string;
    token: string;
}


export interface EventInvitationByIdNeighborResponse { 
    id: number;
    guestName: string;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    isUsed: boolean;
    accessType: string;
    fullAddress: string;
    token: string;
    numAccess: number;
    delete: boolean;
}