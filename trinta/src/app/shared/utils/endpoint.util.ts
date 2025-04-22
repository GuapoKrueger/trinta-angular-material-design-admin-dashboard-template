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

    //
    //Abrir Puerta
    DOOR_OPEN: 'Door/open/',
    //
    //User
    USER_CREATE: 'User/Create',
    LIST_PERMISSIONS: 'Permissions',
  };
  
  export const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };