import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

  // private user: BehaviorSubject<BaseApiResponse<LoginResponse>>;

  public get userToken() {
    // return this.user.value;
    return JSON.parse(localStorage.getItem('token')!)
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
            localStorage.setItem('token', JSON.stringify(response.data.token));
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
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('IdNeighbor');
    localStorage.removeItem('Location');
  }
}
