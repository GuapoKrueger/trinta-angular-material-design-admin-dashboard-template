import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { NeighborhoodResponse } from '../models/neighborhood-response.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NeighborhoodService } from '../services/neighborhood.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-neighborhood-list',
  standalone: true,
  imports: 
  [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    
  ],
  templateUrl: './neighborhood-list.component.html',
  styleUrl: './neighborhood-list.component.scss'
})
export class NeighborhoodListComponent implements OnInit {
  private router = inject(Router); 
  public neighborhoodService = inject(NeighborhoodService);
  displayedColumns: string[] = ['name', 'city', 'municipal', 'state', 'action'];
  dataSource = new MatTableDataSource<NeighborhoodResponse>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    // private neighborhoodService: NeighborhoodService
  ) {}

  ngOnInit(): void {
    this.getNeighborhoods(10, 'Id', 'asc', 0, '');
  }

  getNeighborhoods(size: number, sort: string, order: string, numPage: number, getInputs: string): void {
    this.neighborhoodService.getAll(size, sort, order, numPage, getInputs).subscribe(response => {
      this.dataSource = new MatTableDataSource(response.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  onEdit(id: number): void {
    console.log('Editar fraccionamiento con ID:', id);
    // Aquí puedes redirigir a la página de edición o abrir un modal, etc.
    // Por ejemplo, redirigir a la página de edición:
    this.router.navigate(['/neighborhoods/update-neighborhood', id]);

  }

  // Método para manejar el botón de Eliminar
  onDelete(id: number): void {
    console.log('Eliminar fraccionamiento con ID:', id);
    // Aquí puedes llamar al servicio para eliminar el vecino
    // Por ejemplo:
    // this.neighborService.deleteNeighbor(id).subscribe();
  }


}
