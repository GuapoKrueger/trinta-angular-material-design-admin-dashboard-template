export interface DuplicationRequestResponse {
  id: number;
  originalInvitationId: number;
  guestName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isUsed: boolean;
  token: string;
  notes: string;
  accessServiceTypeName: string;
  neighborName: string;
  fullAddress: string;
  createDate: string;
  gatekeeperUserId: number;
  gatekeeperUserName: string;
  accessServiceTypeId: number;
  neighborAddressId: number;
  accessType: string;
  requestReason: string;
  requestStatus: string;
  requestDate: string;
  responseDate: string | null;
  newInvitationId: number | null;
}