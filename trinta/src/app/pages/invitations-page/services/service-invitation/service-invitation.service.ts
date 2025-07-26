import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AccessServiceType } from '../../models/invitation-response.interface';
import { map, catchError } from 'rxjs/operators';
import { BaseApiResponse } from '../../../../shared/commons/base-api-response-interface';
import { environment as env } from '../../../../../environments/environment.development';
import { endpoint } from '../../../../shared/utils/endpoint.util';
import { ServiceInvitationRequest } from '../../models/service-invitation-request.interface';
import { ServiceInvitationResponse } from '../../models/service-invitation-response.interface';


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

  /**
   * Obtiene las invitaciones de servicio de un guardia por su ID.
   * @param gatekeeperId ID del guardia
   */
  getInvitationsByGatekeeper(gatekeeperId: number): Observable<BaseApiResponse<ServiceInvitationResponse[]>> {
    const requestUrl = `${env.api}ServiceInvitation/ByGatekeeper/${gatekeeperId}`;
    return this._httpClient.get<BaseApiResponse<ServiceInvitationResponse[]>>(requestUrl).pipe(
      map((resp) => resp),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          // Retorna el error RFC9110 completo para que el componente lo maneje
          return throwError(() => error.error);
        }
        return throwError(() => error);
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

  /**
   * Obtiene las invitaciones de servicio filtradas y paginadas por guardia
   * @param gatekeeperId ID del guardia
   * @param numRecordsPage Número de registros por página (default: 10)
   * @param numPage Número de página (default: 1)
   * @param stateFilter Filtro de estado: 'active' para activas, 'inactive' para inactivas
   * @param textFilter Filtro de texto para buscar en los campos de la invitación
   */
  getInvitationsByGatekeeperFiltered(
    gatekeeperId: number, 
    numRecordsPage: number = 10, 
    numPage: number = 1,
    stateFilter?: 'active' | 'inactive',
    textFilter?: string
  ): Observable<BaseApiResponse<ServiceInvitationResponse[]>> {
    let requestUrl = `${env.api}ServiceInvitation/ByGatekeeper/filtered?UserId=${gatekeeperId}&NumRecordsPage=${numRecordsPage}&NumPage=${numPage}`;
    
    // Agregar filtro de estado si se proporciona
    if (stateFilter) {
      requestUrl += `&StateFilter=${stateFilter}`;
    }
    
    // Agregar filtro de texto si se proporciona
    if (textFilter && textFilter.trim()) {
      requestUrl += `&TextFilter=${encodeURIComponent(textFilter.trim())}`;
    }
    
    return this._httpClient.get<BaseApiResponse<ServiceInvitationResponse[]>>(requestUrl).pipe(
      map((resp) => resp),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene las invitaciones de servicio filtradas y paginadas por vecino
   * @param neighborId ID del vecino
   * @param numRecordsPage Número de registros por página (default: 10)
   * @param numPage Número de página (default: 1)
   */
  getInvitationsByNeighborFiltered(
    neighborId: number, 
    numRecordsPage: number = 10, 
    numPage: number = 1
  ): Observable<BaseApiResponse<ServiceInvitationResponse[]>> {
    const requestUrl = `${env.api}ServiceInvitation/ByNeighbor/filtered?UserId=${neighborId}&NumRecordsPage=${numRecordsPage}&NumPage=${numPage}`;
    
    return this._httpClient.get<BaseApiResponse<ServiceInvitationResponse[]>>(requestUrl).pipe(
      map((resp) => resp),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Abre la puerta por parte del vigilante utilizando el token de la invitación
   * @param gatekeeperId ID del vigilante
   * @param token Token de la invitación de servicio
   */
  openDoorByGatekeeper(gatekeeperId: number, token: string): Observable<BaseApiResponse<any>> {
    const requestUrl = `${env.api}ServiceInvitation/OpenDoorByGatekeeper`;
    const payload = {
      gatekeeperId: gatekeeperId,
      token: token
    };
    
    return this._httpClient.post<BaseApiResponse<any>>(requestUrl, payload).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          // Retorna el error RFC9110 completo para que el componente lo maneje
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina una invitación de servicio por su ID
   * @param id ID de la invitación de servicio
   */
  deleteServiceInvitation(id: number): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}ServiceInvitation/${id}`;
    return this._httpClient.delete<BaseApiResponse<boolean>>(requestUrl).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Crea una solicitud de duplicación de invitación
   * @param originalInvitationId ID de la invitación original a duplicar
   * @param requestedByUserId ID del usuario que solicita la duplicación
   * @param requestReason Razón por la cual se solicita la duplicación
   */
  createDuplicationRequest(
    originalInvitationId: number,
    requestedByUserId: number,
    requestReason: string
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}ServiceInvitation/DuplicationRequest`;
    const payload = {
      originalInvitationId: originalInvitationId,
      requestedByUserId: requestedByUserId,
      requestReason: requestReason
    };
    
    return this._httpClient.post<BaseApiResponse<boolean>>(requestUrl, payload).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          return throwError(() => error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
