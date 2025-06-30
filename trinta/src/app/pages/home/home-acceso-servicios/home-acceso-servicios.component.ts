import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterModule } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home-acceso-servicios',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgForOf, RouterModule],
  templateUrl: './home-acceso-servicios.component.html',
  styleUrl: './home-acceso-servicios.component.scss'
})
export class HomeAccesoServiciosComponent {
    cards = [
      { 
        titulo: 'Registrar eventos',
        subtitulo: 'Para que te ayuden abrir a paqueteria, proveedores, repartidores, etc.',
        route: '/invitations/service-visit', 
        img: 'assets/images/pages/home/Send_Add.png' 
      },
      { 
        titulo: 'Reporte eventos',
        subtitulo: 'Donde podrás consultar todos los accesos que has enviado.',
        route: '/invitations/service-visit-list', 
        img: 'assets/images/pages/home/Send_Report.png' 
      }
    ];
}
