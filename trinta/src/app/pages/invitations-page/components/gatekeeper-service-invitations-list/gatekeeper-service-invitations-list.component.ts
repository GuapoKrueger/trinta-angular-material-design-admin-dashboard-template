import { Component, OnInit } from '@angular/core';
import { ServiceInvitationService } from '../../services/service-invitation/service-invitation.service';
import { ServiceInvitationResponse } from '../../models/service-invitation-response.interface';
import { ServiceInvitationRequest } from '../../models/service-invitation-request.interface';
import { BaseApiResponse } from '../../../../shared/commons/base-api-response-interface';
import { AuthService } from '../../../../authentication/services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { InvitationSocketService } from '../../services/invitation-socket.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TgwAsynchronouslyLoadingTcComponent } from '../../../../ui-elements/tabs/tgw-asynchronously-loading-tc/tgw-asynchronously-loading-tc.component';
import { UtwaCustomLabelTemplateComponent } from '../../../../ui-elements/tabs/utwa-custom-label-template/utwa-custom-label-template.component';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';

/**
 * Componente exclusivo para el rol de vigilante (gatekeeper).
 * Muestra la lista de invitaciones de servicio que puede ver el vigilante.
 */
@Component({
  selector: 'app-gatekeeper-service-invitations-list',
  templateUrl: './gatekeeper-service-invitations-list.component.html',
  styleUrls: ['./gatekeeper-service-invitations-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatProgressSpinnerModule, 
    FormsModule, 
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    TgwAsynchronouslyLoadingTcComponent, 
    UtwaCustomLabelTemplateComponent, 
    DatePipe,
    MatCardModule,
      FeathericonsModule
  ]
})
export class GatekeeperServiceInvitationsListComponent implements OnInit {
  // Listas para las invitaciones mostradas
  activeInvitations: ServiceInvitationResponse[] = [];
  inactiveInvitations: ServiceInvitationResponse[] = [];
  
  loading = false;
  errorMsg: string | null = null;
  loadingMore = false;
  
  // Estado de tabs
  activeTab: 'active' | 'inactive' = 'active';
  
  // Búsqueda
  searchTerm: string = '';
  
  // Paginación real
  activeCurrentPage = 1;
  inactiveCurrentPage = 1;
  recordsPerPage = 5;
  
  // Control de si hay más páginas
  hasMoreActivePages = true;
  hasMoreInactivePages = true;
  
  gatekeeperId: number | null = null;

  // Tab group where the tab content is loaded lazily (when activated)
    tabLoadTimes: Date[] = [];
    getTimeLoaded(index: number) {
        if (!this.tabLoadTimes[index]) {
            this.tabLoadTimes[index] = new Date();
        }
        return this.tabLoadTimes[index];
    }

    // Tab group with paginated tabs
    lotsOfTabs = new Array(30).fill(0).map((_, index) => `Tab ${index}`);

  constructor(
    private invitationService: ServiceInvitationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private invitationSocket: InvitationSocketService 
  ) {}

  ngOnInit(): void {
    // Obtener el ID del vigilante desde AuthService
    this.gatekeeperId = this.authService.userIdGet;
    this.loadInitialInvitations();

    if (this.gatekeeperId) {
      this.invitationSocket.joinGatekeeper(this.gatekeeperId);

      this.invitationSocket.newInvitation$.subscribe((newInvitation) => {
        if (this.activeTab === 'active') {
          this.activeInvitations.unshift(newInvitation);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Nueva invitación recibida',
            showConfirmButton: false,
            timer: 5000
          });
        }
      });
    }

  }

  /**
   * Cambia el tab activo
   */
  setActiveTab(tab: 'active' | 'inactive'): void {
    this.activeTab = tab;
    // Si el tab no tiene datos, cargar la primera página
    if (tab === 'active' && this.activeInvitations.length === 0) {
      this.loadInitialInvitations();
    } else if (tab === 'inactive' && this.inactiveInvitations.length === 0) {
      this.loadInitialInvitations();
    }
  }

  /**
   * Maneja la búsqueda de invitaciones
   */
  onSearch(): void {
    // Resetear todo y buscar desde la página 1
    this.resetPagination();
    this.loadInitialInvitations();
  }

  /**
   * Ver más invitaciones - carga la siguiente página y concatena resultados
   */
  onViewMore(): void {
    if (this.loadingMore) return;
    
    this.loadingMore = true;
    
    if (this.activeTab === 'active') {
      this.activeCurrentPage++;
      this.loadMoreInvitations('active');
    } else {
      this.inactiveCurrentPage++;
      this.loadMoreInvitations('inactive');
    }
  }

  /**
   * Obtiene las invitaciones del tab actual
   */
  get currentInvitations(): ServiceInvitationResponse[] {
    return this.activeTab === 'active' ? this.activeInvitations : this.inactiveInvitations;
  }

  /**
   * Obtiene las invitaciones visibles (todas las cargadas del tab actual)
   */
  get visibleInvitations(): ServiceInvitationResponse[] {
    return this.activeTab === 'active' ? this.activeInvitations : this.inactiveInvitations;
  }

  /**
   * Verifica si hay más páginas para cargar
   */
  get hasMorePages(): boolean {
    return this.activeTab === 'active' ? this.hasMoreActivePages : this.hasMoreInactivePages;
  }

  /**
   * Método para abrir acceso utilizando el endpoint del backend
   */
  openAccess(invitation: ServiceInvitationResponse): void {
    if (!this.gatekeeperId) {
      this.errorMsg = 'No se pudo obtener el ID del vigilante.';
      return;
    }

    if (invitation.isUsed) {
      this.errorMsg = 'Esta invitación ya ha sido utilizada.';
      return;
    }

    // Mostrar confirmación antes de proceder
    Swal.fire({
      title: 'Confirmar apertura',
      text: `¿Está seguro que desea abrir el acceso para ${invitation.guestName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, abrir acceso',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDoorOpen(invitation);
      }
    });
  }

  /**
   * Ejecuta la apertura de la puerta después de la confirmación
   */
  private performDoorOpen(invitation: ServiceInvitationResponse): void {

    this.loading = true;
    this.errorMsg = null;

    this.invitationService.openDoorByGatekeeper(this.gatekeeperId!, invitation.token).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          // Marcar la invitación como usada localmente
          invitation.isUsed = true;
          
          // Recargar las invitaciones para actualizar la vista
          this.resetPagination();
          this.loadInitialInvitations();
          
          Swal.fire({
            title: '¡Acceso abierto!',
            text: `Acceso abierto exitosamente para ${invitation.guestName}`,
            icon: 'success',
            timer: 3000,
            timerProgressBar: true
          });
        } else {
          this.errorMsg = response.message || 'Error al abrir el acceso.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al abrir acceso:', error);
        
        if (error.errors && error.errors.length > 0) {
          this.errorMsg = error.errors.join('. ');
        } else if (error.title) {
          this.errorMsg = error.title;
        } else {
          this.errorMsg = error?.message || 'Error al abrir el acceso. Intente nuevamente.';
        }
        
        this.loading = false;
      }
    });
  }

  /**
   * Abre el modal para duplicar una invitación inactiva
   */
  duplicateInvitation(invitation: ServiceInvitationResponse): void {
    Swal.fire({
      title: '¿Por qué quieres duplicar el acceso?',
      input: 'textarea',
      inputPlaceholder: 'Escribe el motivo de la duplicación...',
      inputAttributes: {
        'aria-label': 'Motivo de duplicación'
      },
      showCancelButton: true,
      confirmButtonText: 'Duplicar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value || value.trim().length < 1) {
          return 'Debes proporcionar un motivo válido';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.performDuplication(invitation, result.value.trim());
      }
    });
  }

  /**
   * Ejecuta la duplicación de la invitación después de la confirmación
   */
  private performDuplication(invitation: ServiceInvitationResponse, reason: string): void {
    if (!this.gatekeeperId) {
      this.errorMsg = 'No se pudo obtener el ID del vigilante.';
      return;
    }

    this.loading = true;
    this.errorMsg = null;

    // Usar el nuevo método de solicitud de duplicación
    this.invitationService.createDuplicationRequest(
      invitation.id,
      this.gatekeeperId,
      reason
    ).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Solicitud enviada!',
            text: `Se ha enviado la solicitud de duplicación para ${invitation.guestName}. El administrador la revisará próximamente.`,
            icon: 'success',
            timer: 4000,
            timerProgressBar: true
          });
        } else {
          this.errorMsg = response.message || 'Error al enviar la solicitud de duplicación.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al solicitar duplicación:', error);
        
        if (error.errors && error.errors.length > 0) {
          this.errorMsg = error.errors.join('. ');
        } else if (error.title) {
          this.errorMsg = error.title;
        } else {
          this.errorMsg = error?.message || 'Error al solicitar la duplicación. Intente nuevamente.';
        }
        
        this.loading = false;
      }
    });
  }

  /**
   * Obtiene el día formateado para mostrar en la fecha
   */
  getFormattedDay(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate().toString().padStart(2, '0');
  }

  /**
   * Obtiene el mes abreviado para mostrar en la fecha
   */
  getFormattedMonth(dateString: string): string {
    const date = new Date(dateString);
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
                   'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[date.getMonth()];
  }

  /**
   * Obtiene la hora formateada para mostrar
   */
  getFormattedTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  /**
   * Resetea la paginación para ambas listas
   */
  private resetPagination(): void {
    this.activeCurrentPage = 1;
    this.inactiveCurrentPage = 1;
    this.hasMoreActivePages = true;
    this.hasMoreInactivePages = true;
    this.activeInvitations = [];
    this.inactiveInvitations = [];
  }

  /**
   * Carga las invitaciones iniciales del tab actual
   */
  loadInitialInvitations(): void {
    if (!this.gatekeeperId) {
      this.errorMsg = 'No se pudo obtener el ID del vigilante.';
      return;
    }
    
    this.loading = true;
    this.errorMsg = null;
    
    // Cargar la primera página del tab actual
    const isActive = this.activeTab === 'active';
    const currentPage = isActive ? this.activeCurrentPage : this.inactiveCurrentPage;
    const stateFilter: 'active' | 'inactive' = isActive ? 'active' : 'inactive';
    
    this.invitationService.getInvitationsByGatekeeperFiltered(
      this.gatekeeperId,
      this.recordsPerPage,
      currentPage,
      stateFilter,
      this.searchTerm
    ).subscribe({
      next: (resp: BaseApiResponse<ServiceInvitationResponse[]>) => {
        const data = resp.data || [];
        
        // Ya no necesitamos filtrar aquí, el backend lo hace
        if (isActive) {
          this.activeInvitations = data;
        } else {
          this.inactiveInvitations = data;
        }
        
        // Verificar si hay más páginas
        this.updateHasMorePages(data.length, isActive);
        
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err?.message || 'Error al cargar invitaciones.';
        this.loading = false;
        if (isActive) {
          this.activeInvitations = [];
        } else {
          this.inactiveInvitations = [];
        }
      }
    });
  }

  /**
   * Carga más invitaciones para el tab especificado
   */
  private loadMoreInvitations(tab: 'active' | 'inactive'): void {
    if (!this.gatekeeperId) {
      this.loadingMore = false;
      return;
    }
    
    const isActive = tab === 'active';
    const currentPage = isActive ? this.activeCurrentPage : this.inactiveCurrentPage;
    const stateFilter: 'active' | 'inactive' = isActive ? 'active' : 'inactive';
    
    this.invitationService.getInvitationsByGatekeeperFiltered(
      this.gatekeeperId,
      this.recordsPerPage,
      currentPage,
      stateFilter,
      this.searchTerm
    ).subscribe({
      next: (resp: BaseApiResponse<ServiceInvitationResponse[]>) => {
        const data = resp.data || [];
        
        // Ya no necesitamos filtrar aquí, el backend lo hace
        // Concatenar con los datos existentes
        if (isActive) {
          this.activeInvitations = [...this.activeInvitations, ...data];
        } else {
          this.inactiveInvitations = [...this.inactiveInvitations, ...data];
        }
        
        // Verificar si hay más páginas
        this.updateHasMorePages(data.length, isActive);
        
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Error al cargar más invitaciones:', err);
        this.loadingMore = false;
        
        // Revertir el incremento de página en caso de error
        if (isActive) {
          this.activeCurrentPage--;
        } else {
          this.inactiveCurrentPage--;
        }
      }
    });
  }


  /**
   * Actualiza el estado de si hay más páginas disponibles
   */
  private updateHasMorePages(dataLength: number, isActive: boolean): void {
    const hasMore = dataLength >= this.recordsPerPage;
    
    if (isActive) {
      this.hasMoreActivePages = hasMore;
    } else {
      this.hasMoreInactivePages = hasMore;
    }
  }
}
