import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { EventInvitationByIdNeighborResponse, InvitationByIdNeighborResponse } from '../models/invitation-response.interface';
import { InvitationService } from '../services/invitation.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { PhoneNumberPipe } from '../../../shared/pipes/phone-number.pipe';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-event-invitation-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    CommonModule,
    MatIconModule,
    FeathericonsModule,
    PhoneNumberPipe,
    MatTooltipModule 
  ],
  templateUrl: './event-invitation-list-nuevo.component.html',
  styleUrl: './event-invitation-list-nuevo.component.scss'
})
export class EventInvitationListComponent implements OnInit {
  displayedColumns: string[] = [
    'phoneNumber',
    'guestName',
    'startTime',
    'endTime',
    'isReusable',
    'isActive',
    'isUsed',
    'action',
  ];
  dataSource = new MatTableDataSource<EventInvitationByIdNeighborResponse>();

  // Control para 'ver más'   
  displayCount = 5;

  onViewMore(): void {
    this.displayCount = Math.min(this.displayCount + 5, this.dataSource.data.length);
  }

  constructor(private invitationService: InvitationService, private router: Router) {}

  ngOnInit(): void {
    const neighborId = JSON.parse(localStorage.getItem('IdNeighbor') || '0'); // Obtener IdNeighbor
    if (neighborId > 0) {
      this.getEventInvitations(neighborId, 1000, 'Id', 'desc', 0, '');
    }
  }

  getEventInvitations(
    neighborId: number,
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): void {
    this.invitationService
      .getAllEventInvitationsByNeighborId(neighborId, size, sort, order, numPage, getInputs)
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          // no más paginación integrada
          console.log('Invitaciones cargadas:', this.dataSource);
        },
        error: (err) => {
          console.error('Error al cargar invitaciones:', err);
        },
      });
  }

  getStatusIcon(inv: any): string {
  // eliminada o inactiva
  if (this.asBool(inv?.delete) || this.asBool(inv?.isActive) === false) return 'block';
  // usada o activa sin usar
  return 'task_alt';
}

getStatusClass(inv: any): string {
  if (this.asBool(inv?.delete) || this.asBool(inv?.isActive) === false) return 'status--expired';
  return 'status--active'; // activa o usada
}

getStatusText(inv: any): string {
  if (this.asBool(inv?.delete) || this.asBool(inv?.isActive) === false) return 'Cancelada/expirada';
  if (this.asBool(inv?.isUsed)) return 'Usada';
  return 'Activa';
}

private asBool(v: any): boolean {
  return v === true || v === 'true';
}




  onViewDetails(invitation: InvitationByIdNeighborResponse): void {
    console.log('Detalles de la invitación:', invitation);
  }

  onDelete(invitation: EventInvitationByIdNeighborResponse): void {
    console.log('Eliminar invitación:', invitation);
    Swal.fire({
      title: '¿Seguro que quieres eliminar esta invitación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.invitationService.deleteEventInvitation(invitation.id)
          .subscribe({
            next: () => {
              Swal.fire('Eliminada', 'La invitación ha sido eliminada.', 'success');
              // Remover del listado
              invitation.delete = true;
            },
            error: err => {
              console.error('Error al eliminar invitación:', err);
              Swal.fire('Error', 'No se pudo eliminar la invitación.', 'error');
            }
          });
      }
    });
  }

  onDuplicate(element: any): void {
    this.router.navigate(['/invitations/event-invitation'], { state: { invitationData: element } });
  }
  
  compartir(token: string): void {
    //const shareUrl = `https://www.passo.mx/eventinvitation/detail/${token}`;

    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/eventinvitation/detail/${token}`;

    const message = `¡Has recibido una invitación! Para acceder, pulsa en el siguiente enlace: ${shareUrl}. Gracias por usar nuestro servicio.`;
    
  
    if (navigator.share) {
      navigator.share({
        title: `Passo te abre las puertas.`,
        text: `No hay que pensarlo mucho, un Passo y estás dentro, Vamos!. ¡Haz clic!.`, 
        url: shareUrl
      }).then(() => {
        console.log('Invitación compartida exitosamente');
      }).catch(console.error);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'La función de compartir no está disponible en este navegador.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
