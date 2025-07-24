import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, catchError, shareReplay, startWith, combineLatest, finalize } from 'rxjs';
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
  
  public get neighboorIdGet() {
    // return this.user.value;
    return JSON.parse(localStorage.getItem('IdNeighbor')!)
  }

  public get userLocation() {
    // return this.user.value;
    return JSON.parse(localStorage.getItem('Location')!)
  }

  public get userIdGet() {
    return JSON.parse(localStorage.getItem('userId')!);
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
            localStorage.setItem('userId', JSON.stringify(response.data.userId));
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
        localStorage.removeItem('userId');
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

  /**
   * BehaviorSubject para mantener el rol actual del usuario
   */
  private currentUserRole = new BehaviorSubject<string | null>(null);
  
  /**
   * BehaviorSubject para el estado de carga del rol
   */
  private isRoleLoading = new BehaviorSubject<boolean>(false);
  
  /**
   * Observable reactivo del rol del usuario con cache y manejo de errores
   */
  public currentUserRole$ = this.currentUserRole.asObservable().pipe(
    shareReplay(1) // Cache el último valor emitido
  );

  /**
   * Observable del estado de carga del rol
   */
  public isRoleLoading$ = this.isRoleLoading.asObservable();

  /**
   * Observable que verifica si el usuario es Vigilante
   */
  public isVigilante$ = this.currentUserRole$.pipe(
    map(role => role === 'Vigilante'),
    startWith(false) // Valor inicial mientras se carga el rol
  );

  /**
   * Observable que determina si se debe mostrar el sidebar
   * Solo muestra el sidebar cuando el rol se ha cargado y el usuario no es Vigilante
   */
  public shouldShowSidebar$ = combineLatest([
    this.isVigilante$,
    this.isRoleLoading$
  ]).pipe(
    map(([isVigilante, isLoading]) => !isLoading && !isVigilante)
  );

  /**
   * Inicializa el rol del usuario y lo mantiene actualizado
   */
  public initializeUserRole(): void {
    // Evitar múltiples llamadas si ya se está cargando
    if (this.isRoleLoading.value) {
      return;
    }

    this.isRoleLoading.next(true);
    
    this.getUserRole().pipe(
      catchError((err) => {
        console.error('Error getting user role:', err);
        return of(null); // Retorna null en caso de error
      }),
      finalize(() => {
        this.isRoleLoading.next(false);
      })
    ).subscribe({
      next: (role) => {
        this.currentUserRole.next(role);
      }
    });
  }

  /**
   * Obtiene el rol actual del usuario de manera síncrona
   * @deprecated Usar currentUserRole$ observable en su lugar
   */
  public getCurrentUserRole(): string | null {
    return this.currentUserRole.value;
  }

  /**
   * Verifica si el usuario actual tiene el rol de Vigilante
   * @deprecated Usar isVigilante$ observable en su lugar
   */
  public isVigilante(): boolean {
    return this.getCurrentUserRole() === 'Vigilante';
  }

}
