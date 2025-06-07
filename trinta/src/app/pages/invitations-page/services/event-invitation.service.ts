import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment.development';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { BaseApiResponse } from '../../../shared/commons/base-api-response-interface';
import { EventInvitation } from '../models/event-invitation-request.inteface';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EventInvitationService {
  private readonly http = inject(HttpClient);

  constructor() { }

  /**
   * Envía una invitación de evento con imagen usando FormData
   */
  createEventInvitation(payload: EventInvitation): Observable<BaseApiResponse<boolean>> {
    const url = `${env.api}${endpoint.EVENT_INVITATION_CREATE}`; // Ajustar al endpoint adecuado
    const formData = new FormData();

    const startLocal = formatDate(payload.startTime, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
    const endLocal   = formatDate(payload.endTime,   "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
    
    formData.append('phoneNumber', payload.phoneNumber);
    formData.append('startTime', startLocal);
    formData.append('endTime', endLocal);
    formData.append('isReusable', payload.isReusable);
    formData.append('neighborId', payload.neighborId.toString());
    formData.append('isValid', payload.isValid.toString());
    formData.append('EventName', payload.GuestName);
    //formData.append('accessType', payload.accessType.toString());
    formData.append('neighborAddressId', payload.neighborAddressId.toString());
    if (payload.image) {
      formData.append('image', payload.image);
    }

    return this.http.post<BaseApiResponse<boolean>>(url, formData);
  }
}


