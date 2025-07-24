export interface ServiceInvitationResponse {
  id: number;
  guestName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isUsed: boolean;
  token: string;
  notes: string | null;
  accessServiceTypeName: string;
  neighborName: string;
  fullAddress: string;
  createDate: string;
}

