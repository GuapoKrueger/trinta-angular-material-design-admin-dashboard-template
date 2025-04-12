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
    phoneNumber: string;
    guestName: string;
    startTime: Date;
    endTime: Date;
    isReusable: string;
    isActive: boolean;
    isUsed: boolean;
}