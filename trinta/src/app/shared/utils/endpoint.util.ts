import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
    LOGIN: 'Auth/Login',
  
    //Neighborhood
    LIST_NEIGHBORHOOD: 'Neighborhood',
    NEIGHBORHOOD_BY_ID: 'Neighborhood/',
    NEIGHBORHOOD_CREATE: 'Neighborhood/Create',
    NEIGHBORHOOD_UPDATE: 'Neighborhood/Update/',
    NEIGHBORHOOD_DELETE: 'Neighborhood/Delete/',
    //
    //Neighbor
    LIST_NEIGHBOR: 'Neighbor',
    NEIGHBOR_BY_ID: 'Neighbor/',
    NEIGHBOR_CREATE: 'Neighbor/Create',
    NEIGHBOR_UPDATE: 'Neighbor/Update/',
    NEIGHBOR_DELETE: 'Neighbor/Delete/',
    //
    //Invitation
    INVITATION_CREATE: 'Invitation/Create',
    INVITATION_BY_TOKEN: 'Invitation/detail/',
    INVITATION_BY_NEIGHBOR: 'Invitation',

    //EventInvitation
    EVENT_INVITATION_CREATE: 'EventInvitation/Create',
    EVENT_INVITATION: 'EventInvitation',

    //ServiceInvitation
    SERVICE_INVITATION_CREATE: 'ServiceInvitation/Create',

    //AccessServiceType
    ACCESS_SERVICE_TYPE: 'AccessServiceType',

    //
    //Abrir Puerta
    DOOR_OPEN: 'Door/open/',
    //
    //User
    USER_CREATE: 'User/Create',
    LIST_PERMISSIONS: 'Permissions',
  };
  
// Opciones globales para requests HTTP, incluye withCredentials para cookies HttpOnly
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};