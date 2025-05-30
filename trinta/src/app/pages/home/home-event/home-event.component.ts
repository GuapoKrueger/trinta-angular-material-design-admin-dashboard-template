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
      { label: 'Registrar eventos', route: '/invitations/event-invitation', img: 'assets/images/pages/home/visit.png' },
      { label: 'Reporte eventos', route: '/invitations/event-list', img: 'assets/images/pages/home/report.png' }
    ];
}
