import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { UserCreate } from '../models/user-request.interface';
import { Observable } from 'rxjs';
import { BaseApiResponse } from '../../../shared/commons/base-api-response-interface';
import { environment as env } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly _httpClient = inject(HttpClient);

  constructor() { }

  createUser(user: UserCreate): Observable<BaseApiResponse<boolean>> {

    const formData = this.construirFormData(user);



    const requestUrl = `${env.api}${endpoint.USER_CREATE}`;
    return this._httpClient.post<BaseApiResponse<boolean>>(requestUrl, formData);
  }

  private construirFormData(user: UserCreate): FormData{
    const formData = new FormData();

    formData.append('FirstName', user.firstName);
    formData.append('LastName', user.lastName);
    formData.append('MiddleName', user.middleName);
    formData.append('Username', user.userName);
    formData.append('Password', user.password);
    formData.append('Email', user.email);
    formData.append('Role', user.role);
    if (user.foto) {
      formData.append('Foto', user.foto);
    }

    return formData;
  }
}
