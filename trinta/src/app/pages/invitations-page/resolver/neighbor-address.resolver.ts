import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NeighborService } from '../../neighbors-page/services/neighbor.service';
import { NeighborAddressResponse } from '../../neighbors-page/models/neighbor-response.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../../authentication/services/auth.service';

@Injectable({ providedIn: 'root' })
export class NeighborAddressResolver implements Resolve<NeighborAddressResponse[]> {
  constructor(
    private neighborService: NeighborService,
    private authService: AuthService
) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NeighborAddressResponse[]> {
    const neighborId = this.authService.userIdGet;;
    return this.neighborService.getNeighborAddresses(neighborId).pipe(
      map(resp => resp.data),
      catchError(() => of([]))
    );
  }
}