import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { NeighborhoodResponse } from '../../neighborhoods-page/models/neighborhood-response.interface';
import { BaseApiResponse } from '../../../shared/commons/base-api-response-interface';
import { Fraccionmiento } from '../models/user-request.interface';

// // Definir la interfaz para el fraccionamiento
// export interface Fraccionamiento {
//   id: number;
//   nombre: string;
//   direccion: string;
//   // Agrega más propiedades según necesites
// }

@Injectable({
  providedIn: 'root'
})
export class FraccionamientosService {
  private readonly apiUrl = `${environment.api}${endpoint.LIST_NEIGHBORHOOD}`;
  private readonly _httpClient = inject(HttpClient);
  

  constructor(private http: HttpClient) { }

  getAll(
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): Observable<BaseApiResponse<NeighborhoodResponse>> {
    const requestUrl = `${environment.api}${
      endpoint.LIST_NEIGHBORHOOD
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      numPage + 1
    }${getInputs}`;

    return this._httpClient
      .get<BaseApiResponse<NeighborhoodResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (c: NeighborhoodResponse) {
            
          });

          return resp;
        })
      );
  }

  getFraccionamientoById(id: number): Observable<Fraccionmiento> {
    return this.http.get<Fraccionmiento>(`${this.apiUrl}/${id}`);
  }

  createFraccionamiento(fraccionamiento: Fraccionmiento): Observable<any> {
    return this.http.post(this.apiUrl, fraccionamiento);
  }

  updateFraccionamiento(id: number, fraccionamiento: Fraccionmiento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fraccionamiento);
  }

  deleteFraccionamiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}