import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AccessServiceType } from '../../models/invitation-response.interface';
import { map, catchError } from 'rxjs/operators';
import { BaseApiResponse } from '../../../../shared/commons/base-api-response-interface';
import { environment as env } from '../../../../../environments/environment.development';
import { endpoint } from '../../../../shared/utils/endpoint.util';
import { ServiceInvitationRequest } from '../../models/service-invitation-request.interface';


@Injectable({
  providedIn: 'root'
})
export class ServiceInvitationService {

  private readonly _httpClient = inject(HttpClient);

  constructor() { }

  getAccessServiceType(): Observable<BaseApiResponse<AccessServiceType[]>> {
    const requestUrl = `${env.api}${endpoint.ACCESS_SERVICE_TYPE}`;
    return this._httpClient
      .get<BaseApiResponse<AccessServiceType[]>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }


  
  createInvitation(invitation: ServiceInvitationRequest): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.SERVICE_INVITATION_CREATE}`;
    return this._httpClient.post<BaseApiResponse<boolean>>(requestUrl, invitation).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          // Retorna el error RFC9110 completo para que el componente lo maneje
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
