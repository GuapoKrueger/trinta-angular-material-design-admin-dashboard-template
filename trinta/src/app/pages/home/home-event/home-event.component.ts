import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterModule } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home-event',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgForOf, RouterModule],
  templateUrl: './home-event.component.html',
  styleUrl: './home-event.component.scss'
})
export class HomeEventComponent {
    cards = [
         { 
            titulo: 'Registrar eventos',
            subtitulo: 'Para que amigos y familiares puedan entrar a visitarte.',
            route: '/invitations/event-invitation', 
            img: 'assets/images/pages/home/Eventos.png' 
          },
          { 
            titulo: 'Reporte eventos',
            subtitulo: 'Donde podrás consultar todas las visitas que has recibido.',
            route: '/invitations/event-list', 
            img: 'assets/images/pages/home/ReporEventos.png' 
          }
    ];
}
