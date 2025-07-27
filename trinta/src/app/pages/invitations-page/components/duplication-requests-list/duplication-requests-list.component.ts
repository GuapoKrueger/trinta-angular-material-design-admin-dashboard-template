import { Component, OnInit } from '@angular/core';
import { ServiceInvitationService } from '../../services/service-invitation/service-invitation.service';
import { DuplicationRequestResponse } from '../../models/duplication-request.interface';
import { BaseApiResponse } from '../../../../shared/commons/base-api-response-interface';
import { AuthService } from '../../../../authentication/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente para mostrar las solicitudes de duplicación de invitaciones
 * Utiliza el método getDuplicationRequestsByNeighbor para cargar los datos
 */
@Component({
  selector: 'app-duplication-requests-list',
  templateUrl: './duplication-requests-list.component.html',
  styleUrls: ['./duplication-requests-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressSpinnerModule, 
    FormsModule, 
    MatButtonModule
  ]
})
export class DuplicationRequestsListComponent implements OnInit {
  
  // Lista de solicitudes de duplicación
  duplicationRequests: DuplicationRequestResponse[] = [];
  
  // Estados de carga y error
  loading = false;
  errorMsg: string | null = null;
  
  // Filtros
  selectedStatus: string = 'all';
  searchTerm: string = '';
  
  // ID del usuario (vecino)
  neighborId: number | null = null;

  constructor(
    private invitationService: ServiceInvitationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde AuthService
    this.neighborId = this.authService.neighboorIdGet;
    this.loadDuplicationRequests();
  }

  /**
   * Carga las solicitudes de duplicación desde el servicio
   */
  loadDuplicationRequests(): void {
    if (!this.neighborId) {
      this.errorMsg = 'No se pudo obtener el ID del usuario.';
      return;
    }
    
    this.loading = true;
    this.errorMsg = null;

    console.log('Cargando solicitudes de duplicación para el vecino con ID:', this.neighborId);
    
    this.invitationService.getDuplicationRequestsByNeighbor(this.neighborId).subscribe({
      next: (resp: BaseApiResponse<DuplicationRequestResponse[]>) => {
        this.duplicationRequests = resp.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes de duplicación:', err);
        this.errorMsg = err?.message || 'Error al cargar las solicitudes de duplicación.';
        this.loading = false;
        this.duplicationRequests = [];
      }
    });
  }

  /**
   * Filtra las solicitudes según el estado seleccionado
   */
  get filteredRequests(): DuplicationRequestResponse[] {
    let filtered = this.duplicationRequests;
    
    // Filtrar por estado
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(request => 
        request.requestStatus.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
    
    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.guestName.toLowerCase().includes(searchLower) ||
        request.accessServiceTypeName.toLowerCase().includes(searchLower) ||
        request.requestReason.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }

  /**
   * Maneja el cambio de filtro de estado
   */
  onStatusFilterChange(): void {
    // El filtro se aplica automáticamente a través del getter filteredRequests
  }

  /**
   * Maneja la búsqueda
   */
  onSearch(): void {
    // El filtro se aplica automáticamente a través del getter filteredRequests
  }

  /**
   * Recarga las solicitudes de duplicación
   */
  refresh(): void {
    this.loadDuplicationRequests();
  }

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-badge pending';
      case 'approved':
        return 'status-badge approved';
      case 'rejected':
        return 'status-badge rejected';
      default:
        return 'status-badge';
    }
  }

  /**
   * Obtiene el texto del estado en español
   */
  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  }

  /**
   * Cancela una solicitud de duplicación
   * @param request La solicitud a cancelar
   */
  cancelRequest(request: DuplicationRequestResponse): void {
    console.log('Cancelar solicitud:', request);
    // TODO: Implementar lógica de cancelación
  }

  /**
   * Duplica una solicitud
   * @param request La solicitud a duplicar
   */
  duplicateRequest(request: DuplicationRequestResponse): void {
    console.log('Duplicar solicitud:', request);
    // TODO: Implementar lógica de duplicación
  }
}
