import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Invitation } from '../models/invitation-request.interface';
import { BaseApiResponse } from '../../../shared/commons/base-api-response-interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment.development';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { EventInvitationByIdNeighborResponse, InvitationByIdNeighborResponse, InvitationResponse } from '../models/invitation-response.interface';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly _httpClient = inject(HttpClient);

  constructor() { }

  createInvitation(invitation: Invitation): Observable<BaseApiResponse<boolean>> {

    const requestUrl = `${env.api}${endpoint.INVITATION_CREATE}`;
    return this._httpClient.post<BaseApiResponse<boolean>>(requestUrl, invitation);
  }

  invitationByToken(token: string): Observable<InvitationResponse> {
    const requestUrl = `${env.api}${endpoint.INVITATION_BY_TOKEN}${token}`;
    return this._httpClient
      .get<BaseApiResponse<InvitationResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  openDoor(token: string, accessType:string | null = null): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.DOOR_OPEN}${token}`;

let params = new HttpParams();
    if (accessType !== null) {
      params = params.set('accessType', accessType);
    }

    return this._httpClient
    .put<BaseApiResponse<boolean>>(requestUrl, {}, { params });
  }

  getAllByNeighborId(
    neighborId: number,
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<InvitationByIdNeighborResponse[]>> {
    const requestUrl = `${env.api}${endpoint.INVITATION_BY_NEIGHBOR}?id=${neighborId}&records=${size}&sort=${sort}&order=${order}&numPage=${numPage + 1
    }${getInputs}`;
  
    return this._httpClient
      .get<BaseApiResponse<InvitationByIdNeighborResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (c: InvitationByIdNeighborResponse) {
           
          });

          return resp;
        })
      );
  }

  getAllEventInvitationsByNeighborId(
    neighborId: number,
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<EventInvitationByIdNeighborResponse[]>> {
    const requestUrl = `${env.api}${endpoint.EVENT_INVITATION}?NeighborId=${neighborId}&records=${size}&sort=${sort}&order=${order}&numPage=${numPage + 1
    }${getInputs}`;
  
    return this._httpClient
      .get<BaseApiResponse<EventInvitationByIdNeighborResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (c: EventInvitationByIdNeighborResponse) {
           
          });

          return resp;
        })
      );
  }


  deleteEventInvitation(id: number): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.EVENT_INVITATION}/${id}`;
    return this._httpClient
      .delete<BaseApiResponse<boolean>>(requestUrl);
  }

}
