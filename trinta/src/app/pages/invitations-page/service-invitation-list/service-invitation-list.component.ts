import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ServiceInvitationResponse } from '../models/service-invitation-response.interface';
import { ServiceInvitationService } from '../services/service-invitation/service-invitation.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-invitation-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    CommonModule,
    MatIconModule,
    FeathericonsModule
  ],
  templateUrl: './service-invitation-list.component.html',
  styleUrl: './service-invitation-list.component.scss'
})
export class ServiceInvitationListComponent implements OnInit {
  displayedColumns: string[] = [
    'guestName',
    'accessServiceTypeName',
    'startTime',
    'endTime',
    'isActive',
    'isUsed',
    'action',
  ];
  dataSource = new MatTableDataSource<ServiceInvitationResponse>();

  // Control para 'ver más'
  displayCount = 5;
  currentPage = 1;
  pageSize = 5;
  isLoading = false;
  hasMoreData = true;

  onViewMore(): void {
    if (this.hasMoreData && !this.isLoading) {
      this.loadMoreInvitations();
    }
  }

  constructor(private serviceInvitationService: ServiceInvitationService, private router: Router) {}

  ngOnInit(): void {
    const neighborId = JSON.parse(localStorage.getItem('IdNeighbor') || '0');
    if (neighborId > 0) {
      this.loadServiceInvitations(neighborId);
    }
  }

  loadServiceInvitations(neighborId: number): void {
    this.isLoading = true;
    this.serviceInvitationService
      .getInvitationsByNeighborFiltered(neighborId, this.pageSize, this.currentPage)
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          this.hasMoreData = response.data.length === this.pageSize;
          this.isLoading = false;
          console.log('Invitaciones de servicio cargadas:', response.data);
        },
        error: (err) => {
          console.error('Error al cargar invitaciones de servicio:', err);
          this.isLoading = false;
          this.hasMoreData = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar las invitaciones de servicio.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        },
      });
  }

  onViewDetails(invitation: ServiceInvitationResponse): void {
    console.log('Detalles de la invitación de servicio:', invitation);
  }

  onDelete(invitation: ServiceInvitationResponse): void {
    console.log('Eliminar invitación de servicio:', invitation);
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
        // TODO: Implement delete service invitation endpoint
        Swal.fire('Eliminada', 'La invitación ha sido eliminada.', 'success');
      }
    });
  }

  onDuplicate(element: ServiceInvitationResponse): void {
    this.router.navigate(['/invitations/service-invitation'], { state: { invitationData: element } });
  }
  
  duplicar(invitation: ServiceInvitationResponse): void {
    this.router.navigate(['/invitations/service-visit'], { 
      state: { invitationData: invitation } 
    });
  }

  loadMoreInvitations(): void {
    this.currentPage++;
    const neighborId = JSON.parse(localStorage.getItem('IdNeighbor') || '0');
    if (neighborId > 0) {
      this.isLoading = true;
      this.serviceInvitationService
        .getInvitationsByNeighborFiltered(neighborId, this.pageSize, this.currentPage)
        .subscribe({
          next: (response) => {
            // Append new data to existing data without creating new MatTableDataSource
            this.dataSource.data = [...this.dataSource.data, ...response.data];
            this.displayCount += response.data.length;
            this.hasMoreData = response.data.length === this.pageSize;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error al cargar más invitaciones:', err);
            this.isLoading = false;
            this.hasMoreData = false;
          },
        });
    }
  }
}
