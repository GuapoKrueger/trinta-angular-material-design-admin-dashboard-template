// En tu componente de Layout/Shell principal del guardia
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../authentication/services/auth.service';
import { InvitationSocketService } from '../../services/invitation-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guard-layout',
  template: '<router-outlet></router-outlet>', // Este componente envuelve tus otras vistas
  // ...
})
export class GuardLayoutComponent implements OnInit, OnDestroy {

  private gatekeeperId: number | null = null;
  private socketSubscription = new Subscription();

  constructor(
    private authService: AuthService,
    private invitationSocket: InvitationSocketService
  ) {}

  ngOnInit(): void {
    this.gatekeeperId = this.authService.userIdGet; // O como obtengas el ID

    if (this.gatekeeperId) {
      // 1. Se une al grupo de forma persistente
      this.invitationSocket.joinGatekeeper(this.gatekeeperId);

      // 2. Escucha SIEMPRE para mostrar la notificación global
      const sub = this.invitationSocket.newInvitation$.subscribe(invitation => {
        console.log('Notificación GLOBAL recibida:', invitation);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: `Nueva invitación de `, // Ajusta el nombre del campo si es diferente
          showConfirmButton: false,
          timer: 8000
        });
      });
      this.socketSubscription.add(sub);
    }
  }

  ngOnDestroy(): void {
    // 3. Se sale del grupo y se limpia al cerrar sesión (cuando este layout se destruye)
    if (this.gatekeeperId) {
      this.invitationSocket.leaveGatekeeper(this.gatekeeperId);
    }
    this.socketSubscription.unsubscribe();
  }
}