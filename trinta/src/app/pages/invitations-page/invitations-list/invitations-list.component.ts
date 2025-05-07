import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { InvitationByIdNeighborResponse } from '../models/invitation-response.interface';
import { InvitationService } from '../services/invitation.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { PhoneNumberPipe } from '../../../shared/pipes/phone-number.pipe';

@Component({
  selector: 'app-invitations-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    CommonModule,
    MatIconModule,
    FeathericonsModule,
    PhoneNumberPipe
  ],
  templateUrl: './invitations-list.component.html',
  styleUrl: './invitations-list.component.scss'
})
export class InvitationsListComponent implements OnInit {
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
  dataSource = new MatTableDataSource<InvitationByIdNeighborResponse>();

  // Pagination properties
  pageSizeOptions: number[] = [5, 10, 15];
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Getter for current page items
  get pagedInvitations(): InvitationByIdNeighborResponse[] {
    const data = this.dataSource.data;
    const start = this.pageIndex * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  // Handle page changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  constructor(private invitationService: InvitationService, private router: Router) {}

  ngOnInit(): void {
    const neighborId = JSON.parse(localStorage.getItem('IdNeighbor') || '0'); // Obtener IdNeighbor
    if (neighborId > 0) {
      this.getInvitations(neighborId, 1000, 'Id', 'desc', 0, '');
    }
  }

  getInvitations(
    neighborId: number,
    size: number,
    sort: string,
    order: string,
    numPage: number,
    getInputs: string
  ): void {
    this.invitationService
      .getAllByNeighborId(neighborId, size, sort, order, numPage, getInputs)
      .subscribe({
        next: (response) => {
          console.log(response.data);
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error('Error al cargar invitaciones:', err);
        },
      });
  }

  onViewDetails(invitation: InvitationByIdNeighborResponse): void {
    console.log('Detalles de la invitación:', invitation);
  }

  onDelete(invitation: InvitationByIdNeighborResponse): void {
    console.log('Eliminar invitación:', invitation);
  }

  onDuplicate(element: any): void {
    this.router.navigate(['/invitations/share-invitation'], { state: { invitationData: element } });
  }
  
}
