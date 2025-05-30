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
    { label: 'Registrar una visita', route: '/invitations/share-invitation', img: 'assets/images/pages/home/visit.png' },
    { label: 'Reporte visitas', route: '/invitations/invitations-list', img: 'assets/images/pages/home/report.png' }
  ];
}
