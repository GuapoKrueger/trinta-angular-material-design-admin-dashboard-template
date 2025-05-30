import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse } from '../../../shared/commons/base-api-response-interface';
import { map, Observable } from 'rxjs';
import { NeighborByIdResponse, NeighborResponse, NeighborAddressResponse } from '../models/neighbor-response.interface';
import { environment as env } from '../../../../environments/environment.development';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { Street, Subdivision } from '../../neighborhoods-page/models/neighborhood-request.interface';
import { Neighbor } from '../models/neighbor-request.interface';

@Injectable({
  providedIn: 'root'
})
export class NeighborService {

  private readonly _httpClient = inject(HttpClient);

  constructor() {}

  getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<NeighborResponse[]>> {
    const requestUrl = `${env.api}${
      endpoint.LIST_NEIGHBOR
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      numPage + 1
    }${getInputs}`;

    return this._httpClient
      .get<BaseApiResponse<NeighborResponse[]>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (c: NeighborResponse) {
           
          });

          return resp;
        })
      );
  }

  getByNeighborhoodId(neighborhoodId: number): Observable<BaseApiResponse<Subdivision[]>> {
    const requestUrl = `${env.api}Neighborhood/${neighborhoodId}/subdivisions`;
    // const requestUrl = `https://localhost:44307/api/Neighborhood/${neighborhoodId}/subdivisions`
    return this._httpClient.get<BaseApiResponse<Subdivision[]>>(requestUrl);
  }

  getBySubdivisionId(subdivisionId: number): Observable<BaseApiResponse<Street[]>> {
     const requestUrl = `${env.api}Neighborhood/${subdivisionId}/streets`;
    // const requestUrl = `https://localhost:44307/api/Neighborhood/${subdivisionId}/streets`
    return this._httpClient.get<BaseApiResponse<Street[]>>(requestUrl);
  }

  createNeighbor(neighbor: Neighbor): Observable<BaseApiResponse<boolean>> {
    const formData = this.construirFormData(neighbor);
    const requestUrl = `${env.api}${endpoint.NEIGHBOR_CREATE}`;
    return this._httpClient.post<BaseApiResponse<boolean>>(requestUrl, formData);
  }

  UpdateNeighbor(
    neighbor: Neighbor
  ): Observable<BaseApiResponse<boolean>> {
    const formData = this.construirFormData(neighbor);
    const requestUrl = `${env.api}${endpoint.NEIGHBOR_UPDATE}`;
    return this._httpClient.put<BaseApiResponse<boolean>>(requestUrl, formData);
  }

  neighborById(neighborId: number): Observable<NeighborByIdResponse> {
    const requestUrl = `${env.api}${endpoint.NEIGHBOR_BY_ID}${neighborId}`;
    return this._httpClient
      .get<BaseApiResponse<NeighborByIdResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  getNeighborAddresses(neighborId: number): Observable<BaseApiResponse<NeighborAddressResponse[]>> {
    const requestUrl = `${env.api}${endpoint.NEIGHBOR_BY_ID}${neighborId}/Addresses`;
    return this._httpClient.get<BaseApiResponse<NeighborAddressResponse[]>>(requestUrl);
  }
  
  private construirFormData(neighbor: Neighbor): FormData{
    const formData = new FormData();
    formData.append('Id', neighbor.id.toString());
    formData.append('FirstName', neighbor.FirstName);
    formData.append('LastName', neighbor.LastName);
    formData.append('MiddleName', neighbor.MiddleName);
    formData.append('PhoneNumber', neighbor.PhoneNumber);
    formData.append('Email', neighbor.Email);
    formData.append('UserName', neighbor.UserName);
    formData.append('Password', neighbor.Password);
    if (neighbor.Foto) {
      formData.append('Foto', neighbor.Foto);
    }

    // Append addresses
    neighbor.addresses?.forEach((address, index) => {
        formData.append(`Addresses[${index}].Id`, (address.id ?? 0).toString());
        formData.append(`Addresses[${index}].HouseNumber`, address.number || '');
        formData.append(`Addresses[${index}].NeighborhoodId`, address.neighborhoodId.toString());
        formData.append(`Addresses[${index}].SubdivisionId`, address.subdivisionId.toString());
        formData.append(`Addresses[${index}].StreetId`, address.streetId.toString());
    });

    return formData;
  }
}
