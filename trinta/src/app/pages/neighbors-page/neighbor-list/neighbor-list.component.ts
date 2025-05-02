import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, Router } from '@angular/router';
import { NeighborService } from '../services/neighbor.service';
import { NeighborResponse } from '../models/neighbor-response.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-neighbor-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    CommonModule 
  ],
  templateUrl: './neighbor-list.component.html',
  styleUrl: './neighbor-list.component.scss'
})
export class NeighborListComponent implements OnInit {
  private router = inject(Router); 
  public neighborService = inject(NeighborService);
  displayedColumns: string[] = ['FirstName','Email', 'PhoneNumber', 'Active', 'action'];
  dataSource = new MatTableDataSource<NeighborResponse>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getNeighbors(1000, 'Id', 'asc', 0, '');
  }

  getNeighbors(size: number, sort: string, order: string, numPage: number, getInputs: string): void {
    this.neighborService.getAll(size, sort, order, numPage, getInputs).subscribe(response => {
      this.dataSource = new MatTableDataSource(response.data);
      this.dataSource.paginator = this.paginator;

      console.log(this.dataSource);
    });
  }

  onEdit(id: number): void {
    console.log('Editar vecino con ID:', id);
    // Aquí puedes redirigir a la página de edición o abrir un modal, etc.
    // Por ejemplo, redirigir a la página de edición:
    this.router.navigate(['/neighbors/update-neighbor', id]);

  }

  // Método para manejar el botón de Eliminar
  onDelete(id: number): void {
    console.log('Eliminar vecino con ID:', id);
    // Aquí puedes llamar al servicio para eliminar el vecino
    // Por ejemplo:
    // this.neighborService.deleteNeighbor(id).subscribe();
  }
}
