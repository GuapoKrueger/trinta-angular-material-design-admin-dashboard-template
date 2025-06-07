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
    PhoneNumberPipe
  ],
  templateUrl: './event-invitation-list.component.html',
  styleUrl: './event-invitation-list.component.scss'
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
          console.log('Invitaciones cargadas:', response.data);
        },
        error: (err) => {
          console.error('Error al cargar invitaciones:', err);
        },
      });
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
    this.router.navigate(['/invitations/share-invitation'], { state: { invitationData: element } });
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
