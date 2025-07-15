export interface ServiceInvitationRequest {
  accessServiceTypeId: string;
  guestName: string;
  neighborAddressId: string;
  gatekeeperUserId: number;
  accessType: string;
  notes?: string;
  startTime: Date;
  endTime: Date;
  isValid: boolean;
  neighborId: number;
}
