import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { endpoint } from '../../../shared/utils/endpoint.util';
import { UserCreate } from '../models/user-request.interface';
import { Observable } from 'rxjs';
import { VigilanteList } from '../models/user-combo.interface';
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

    // Enviar permissions como objetos indexados
    if (user.permissions?.length) {
      user.permissions.forEach((p, i) => {
        formData.append(`Permissions[${i}].id`,   p.id.toString());
        formData.append(`Permissions[${i}].name`, p.name);
      });
    }

    // Enviar fraccionamientos como objetos indexados
    if (user.fraccionamientos?.length) {
      user.fraccionamientos.forEach((f, i) => {
        formData.append(`Fraccionamientos[${i}].id`,   f.id.toString());
        formData.append(`Fraccionamientos[${i}].name`, f.name);
      });
    }

    return formData;
  }

getUsersByRole(roleName: string): Observable<BaseApiResponse<VigilanteList[]>> {
    const requestUrl = `${env.api}User/ByRole/${roleName}`;
    return this._httpClient.get<BaseApiResponse<VigilanteList[]>>(requestUrl);
  }
}
