import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '../../../shared/commons/base-api-response-interface';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { environment as env } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { NeighborhoodByIdResponse, NeighborhoodResponse } from '../models/neighborhood-response.interface';
import { Neighborhood, NeighborhoodUpdate } from '../models/neighborhood-request.interface';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodService {
  
  private readonly _httpClient = inject(HttpClient);

  constructor() {}

  getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<NeighborhoodResponse[]>> {
    const requestUrl = `${env.api}${
      endpoint.LIST_NEIGHBORHOOD
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      numPage + 1
    }${getInputs}`;

    return this._httpClient
      .get<BaseApiResponse<NeighborhoodResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (c: NeighborhoodResponse) {
           
          });

          return resp;
        })
      );
  }

  neighborhoodCreate(user: Neighborhood): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.NEIGHBORHOOD_CREATE}`;
    return this._httpClient.post<BaseApiResponse<boolean>>(requestUrl, user);
  }

  neighborhoodUpdate(
    neighborhood: NeighborhoodUpdate
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.NEIGHBORHOOD_UPDATE}`;
    return this._httpClient.put<BaseApiResponse<boolean>>(requestUrl, neighborhood);
  }

  neighborhoodById(neighborhoodId: number): Observable<NeighborhoodByIdResponse> {
    const requestUrl = `${env.api}${endpoint.NEIGHBORHOOD_BY_ID}${neighborhoodId}`;
    return this._httpClient
      .get<BaseApiResponse<NeighborhoodByIdResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

}
