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
}