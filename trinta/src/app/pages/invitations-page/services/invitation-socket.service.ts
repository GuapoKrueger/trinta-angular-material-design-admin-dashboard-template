// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';
// import { Subject } from 'rxjs';
// import { environment as env } from '../../../../environments/environment.development';

// @Injectable({
//   providedIn: 'root'
// })
// export class InvitationSocketService {

//   private hubConnection: signalR.HubConnection;
//   private newInvitationSubject = new Subject<any>();
//   newInvitation$ = this.newInvitationSubject.asObservable();

//   constructor() {
//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(`${env.api.replace('/api', '')}hubs/invitations`, {
//         withCredentials: true
//       })
//       .withAutomaticReconnect()
//       .build();
//    }

//    connect(gatekeeperId: number): void {
//     this.hubConnection
//       .start()
//       .then(() => {
//         console.log('Conectado a SignalR');
//         this.hubConnection.invoke('JoinGroup', gatekeeperId.toString());
//       })
//       .catch(err => console.error('Error al conectar con SignalR:', err));

//     this.hubConnection.on('NewInvitation', (invitation) => {
//       this.newInvitationSubject.next(invitation);
//     });
//   }

//   disconnect(gatekeeperId: number): void {
//     this.hubConnection.invoke('LeaveGroup', gatekeeperId.toString())
//       .finally(() => this.hubConnection.stop());
//   }

  

// }

import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class InvitationSocketService {
  private hubConnection?: signalR.HubConnection;

  // Eventos
  private newInvitationSubject = new Subject<any>();
  private duplicationRequestedSubject = new Subject<any>();
  // cancelación de duplicación (para guardia)
  private duplicationCancelledSubject = new Subject<any>();

  /** Invitación nueva para el guardia */
  readonly newInvitation$: Observable<any> = this.newInvitationSubject.asObservable();
  /** Solicitud de duplicación para el residente */
  readonly duplicationRequested$: Observable<any> =
    this.duplicationRequestedSubject.asObservable();

    /** ⬅cancelación de duplicación (para guardia) */
  readonly duplicationCancelled$: Observable<any> =
    this.duplicationCancelledSubject.asObservable();

  // Grupos unidos (para re-unirse en reconexión)
  private joinedGroups = new Set<string>();
  private isStarting = false;

  constructor(private ngZone: NgZone) {}

  /** Inicializa la conexión si no existe */
  private ensureConnection(): void {
    if (this.hubConnection || this.isStarting) return;

    this.isStarting = true;

this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${env.api.replace('/api', '')}hubs/invitations`,
        {
          withCredentials: true,
          // transport: signalR.HttpTransportType.WebSockets // 🔒 evita caer en SSE/LongPolling
          // skipNegotiation: true, // opcional: solo si **seguro** hay WebSockets en hosting
        }
      )
      .withAutomaticReconnect()
      .build();




    this.hubConnection.on('NewInvitation', (invitation: any) => {
      this.ngZone.run(() => this.newInvitationSubject.next(invitation));
    });

    this.hubConnection.on('DuplicationRequestCreated', (payload: any) => {
      this.ngZone.run(() => this.duplicationRequestedSubject.next(payload));
    });

    this.hubConnection.on('DuplicationCancelled', (payload: any) => {
      this.ngZone.run(() => this.duplicationCancelledSubject.next(payload));
    });

    // Rejoin tras reconectar
    this.hubConnection.onreconnected(() => {
      // Re-únete a todos los grupos recordados
      this.joinedGroups.forEach(g => {
        const [kind, id] = g.split(':');
        if (kind === 'gatekeeper') {
          this.invokeJoinGatekeeper(id).catch(() => {});
        } else if (kind === 'resident') {
          this.invokeJoinResident(id).catch(() => {});
        }
      });
    });

    // Start
    this.hubConnection
      .start()
      .then(() => {
        this.isStarting = false;
        // Si ya teníamos grupos antes de que terminara el start, reintenta unirlos
        this.joinedGroups.forEach(g => {
          const [kind, id] = g.split(':');
          if (kind === 'gatekeeper') this.invokeJoinGatekeeper(id).catch(() => {});
          if (kind === 'resident') this.invokeJoinResident(id).catch(() => {});
        });
      })
      .catch(err => {
        this.isStarting = false;
        console.error('Error al conectar con SignalR:', err);
      });
  }

  /** Unirse al grupo del guardia (para recibir NewInvitation) */
  joinGatekeeper(gatekeeperId: number | string): void {
    this.ensureConnection();
    const id = String(gatekeeperId);
    this.joinedGroups.add(`gatekeeper:${id}`);
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.invokeJoinGatekeeper(id).catch(err => console.error('Join gatekeeper error:', err));
    }
  }

  /** Salir del grupo del guardia */
  leaveGatekeeper(gatekeeperId: number | string): void {
    const id = String(gatekeeperId);
    this.joinedGroups.delete(`gatekeeper:${id}`);
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.invokeLeaveGatekeeper(id).catch(err => console.error('Leave gatekeeper error:', err));
    }
  }

  /** Unirse al grupo del residente (para recibir DuplicationRequested) */
  joinResident(neighborId: number | string): void {
    this.ensureConnection();
    const id = String(neighborId);
    this.joinedGroups.add(`resident:${id}`);
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.invokeJoinResident(id).catch(err => console.error('Join resident error:', err));
    }
  }

  /** Salir del grupo del residente */
  leaveResident(neighborId: number | string): void {
    const id = String(neighborId);
    this.joinedGroups.delete(`resident:${id}`);
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.invokeLeaveResident(id).catch(err => console.error('Leave resident error:', err));
    }
  }

  /** Cierra la conexión y limpia estado */
  disconnect(): void {
    this.joinedGroups.clear();
    if (!this.hubConnection) return;
    this.hubConnection.stop().catch(() => {});
    this.hubConnection = undefined;
  }

  // --- Invokes (ajusta al nombre de métodos que tengas en el Hub) ---

  private async invokeJoinGatekeeper(id: string): Promise<void> {
    // Si mantuviste JoinGroup/LeaveGroup antiguos:
    // await this.hubConnection!.invoke('JoinGroup', id);
    await this.hubConnection!.invoke('JoinGatekeeperGroup', id);
  }

  private async invokeLeaveGatekeeper(id: string): Promise<void> {
    // await this.hubConnection!.invoke('LeaveGroup', id);
    await this.hubConnection!.invoke('LeaveGatekeeperGroup', id);
  }

  private async invokeJoinResident(id: string): Promise<void> {
    // await this.hubConnection!.invoke('JoinGroup', id); // NO recomendado porque se mezclaría con gatekeepers
    await this.hubConnection!.invoke('JoinResidentGroup', id);
  }

  private async invokeLeaveResident(id: string): Promise<void> {
    // await this.hubConnection!.invoke('LeaveGroup', id);
    await this.hubConnection!.invoke('LeaveResidentGroup', id);
  }
}

