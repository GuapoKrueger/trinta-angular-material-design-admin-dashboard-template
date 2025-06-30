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
      { 
        titulo: 'Compartir un passo',
        subtitulo: 'Para que tus visitas ingresen fácilmente a tu domicilio.',
        route: '/home/visitas', 
        img: 'assets/images/pages/home/share_passo.png' 
      },
      { 
        titulo: 'Enviar passo',
        subtitulo: 'Si necesitas que alguien mas autorice el acceso en tu nombre.',
        route: '/home/acceso-servicios', 
        img: 'assets/images/pages/home/Send_passo.png' 
      },
      { 
        titulo: 'Passo al evento',
        subtitulo: 'Cuando emites una invitación para todos tus invitados.',
        route: '/home/eventos', 
        img: 'assets/images/pages/home/Evento_passo2.png' 
      }
    ];
}


