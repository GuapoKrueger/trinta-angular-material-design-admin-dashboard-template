export interface EventInvitation {
    phoneNumber: string;
    startTime: Date;
    endTime: Date;
    isReusable: string;
    neighborId: number;
    isValid: boolean;
    GuestName: string;
    //accessType: number;
    neighborAddressId: number;
    image: File;
  }
  