import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home-visitas',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgForOf],
  templateUrl: './home-visitas.component.html',
  styleUrl: './home-visitas.component.scss'
})
export class HomeVisitasComponent {
  cards = [
    { 
      titulo: 'Registrar visita',
      subtitulo: 'Para que amigos y familiares puedan entrar a visitarte.',
      route: '/invitations/share-invitation', 
      img: 'assets/images/pages/home/visit.png' 
    },
    { 
      titulo: 'Reporte visitas',
      subtitulo: 'Donde podrás consultar todas las visitas que has recibido.',
      route: '/invitations/invitations-list', 
      img: 'assets/images/pages/home/report.png' 
    }
  ];
}
