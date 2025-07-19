import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { BaseApiResponse } from '../../shared/commons/base-api-response-interface';
import { environment as env } from '../../../environments/environment.development';
import { endpoint, httpOptions } from '../../shared/utils/endpoint.util';
import { LoginRequest } from '../model/login-request.interface';
import { LoginResponse } from '../model/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  /**
   * Valida si el usuario está autenticado consultando al backend.
   * Retorna un Observable<boolean>.
   */
  isAuthenticated(): Observable<boolean> {
    const requestUrl = `${env.api}auth/check`;
    return this.http.get<BaseApiResponse<any>>(requestUrl, httpOptions).pipe(
      map((response: BaseApiResponse<any>) => {
        return response.data;
      })
    );
  }
  
  public get userAvatarUrl() {
    // return this.user.value;
    return JSON.parse(localStorage.getItem('avatarUrl')!)
  }
  
  public get userIdGet() {
    // return this.user.value;
    return JSON.parse(localStorage.getItem('IdNeighbor')!)
  }

  public get userLocation() {
    // return this.user.value;
    return JSON.parse(localStorage.getItem('Location')!)
  }

  constructor() {
    // this.user = new BehaviorSubject<BaseApiResponse<LoginResponse>>(
    //   JSON.parse(localStorage.getItem('token')!)
    // );
  }

  login(request: LoginRequest): Observable<BaseApiResponse<LoginResponse>> {
    const requestUrl = `${env.api}${endpoint.LOGIN}`;
    return this.http
      .post<BaseApiResponse<LoginResponse>>(requestUrl, request, httpOptions)
      .pipe(
        map((response: BaseApiResponse<LoginResponse>) => {
          if (response.isSuccess) {
            console.log(response.data);
            // El token ya es guardado como HttpOnly cookie por el backend
            localStorage.setItem('userName', JSON.stringify(response.data.userName));
            localStorage.setItem('avatarUrl', JSON.stringify(response.data.avatarUrl));
            localStorage.setItem('IdNeighbor', JSON.stringify(response.data.id));
            localStorage.setItem('Location', JSON.stringify(response.data.location));
            // .next(response.data);
          }
          return response;
        })
      );
  }

  logout() {
    const requestUrl = `${env.api}auth/logout`;
    this.http.post<BaseApiResponse<any>>(requestUrl, {}, httpOptions).subscribe({
      next: () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('avatarUrl');
        localStorage.removeItem('IdNeighbor');
        localStorage.removeItem('Location');
      },
      error: (err) => {
        console.error('Error during logout:', err);
      }
    });
  }

  /**
   * Obtiene el rol del usuario desde el backend.
   * Realiza una solicitud HTTP para obtener el rol del usuario.
   */
  public getUserRole(): Observable<string> {
    const requestUrl = `${env.api}auth/role`;
    return this.http.get<BaseApiResponse<string>>(requestUrl, httpOptions).pipe(
      map((response: BaseApiResponse<string>) => response.data)
    );
  }

}
