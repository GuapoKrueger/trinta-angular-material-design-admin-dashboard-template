import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgForOf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  cards = [
    { label: 'Registrar visita', route: '/invitations/share-invitation', img: 'assets/images/pages/home/visit.png' },
    { label: 'Reporte visitas', route: '/invitations/invitations-list', img: 'assets/images/pages/home/report.png' }
  ];
}
