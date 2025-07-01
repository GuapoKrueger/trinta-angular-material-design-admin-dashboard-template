import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NeighborService } from '../../neighbors-page/services/neighbor.service';
import { NeighborAddressResponse } from '../../neighbors-page/models/neighbor-response.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../../authentication/services/auth.service';

export const neighborAddressResolver: ResolveFn<NeighborAddressResponse[]> = (route, state) => {
  const neighborService = inject(NeighborService);
  const authService = inject(AuthService);
  
  const neighborId = authService.userIdGet;
  return neighborService.getNeighborAddresses(neighborId).pipe(
    map(resp => resp.data),
    catchError(() => of([]))
  );
};