import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../models/user-request.interface';
import { environment } from '../../../../environments/environment';
import { endpoint } from '../../../shared/utils/endpoint.util';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    private readonly apiUrl = `${environment.api}${endpoint.LIST_PERMISSIONS}`;

    constructor(private http: HttpClient) {}

    getPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.apiUrl);
    }
}