import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterModule } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [MatCardModule, RouterLink, NgForOf, RouterModule],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.scss'
})
export class HomeMenuComponent {
    cards = [
      { label: 'Visitas', route: '/home/visitas', img: 'assets/images/pages/home/visit.png' },
      { label: 'Eventos', route: '/home/eventos', img: 'assets/images/pages/home/Eventos.png' }
    ];
}


