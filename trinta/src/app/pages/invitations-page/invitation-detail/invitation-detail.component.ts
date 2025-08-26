import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, ActivatedRoute  } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { InvitationService } from '../services/invitation.service';
import { InvitationResponse } from '../models/invitation-response.interface';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-invitation-detail',
  standalone: true,
  imports: [
    RouterLink, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule, 
    ReactiveFormsModule, 
    NgIf, 
    FeathericonsModule,
    MatCardModule, 
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatIcon,
    MatDividerModule 
  ],
  templateUrl: './invitation-detail-nuevo.component.html',
  styleUrl: './invitation-detail-nuevo.component.scss'
})
export class InvitationDetailComponent implements OnInit {
    // isToggled
    isToggled = false;
    token: string | null = null;
    invitationDetails: InvitationResponse | null = null;
    imagenBase64?: string;

    private _invitationService = inject(InvitationService);

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute
  ) {
      
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');

    if (this.token) {
      this._invitationService.invitationByToken(this.token).subscribe({
          next: (response) => {
              this.invitationDetails = response;
              this.imagenBase64 = response.avatarUrl;
              console.log(response);
          },
          error: (error) => {
              Swal.fire({
                title: 'Error.',
                text:  error,
                icon: 'error',
              });
          }
      });
    }
  }
 
  onSubmit() {
    // const shareUrl = `https://localhost:44307/api/Door/open/${this.token}`;
    const shareUrl = `https://api.passo.mx/api/Door/open/${this.token}`;

    if (this.token) {
      this._invitationService.openDoor(this.token).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            // console.log('Puerta abierta con éxito');
            // Puedes mostrar un mensaje o redirigir al usuario
            Swal.fire({
              title: "Bienvenido !!",
              text: "Gracias por dar el Passo con nosotros. Tu acceso al fraccionamiento está listo. ¡Que tengas una gran estancia!.",
              icon: "success"
            });
          } else {
            Swal.fire({
              title: 'Error en la solicitud para abrir la puerta.', 
              text:  response.message,
              icon: 'error',
            });
          }
        },
        error: (error) => {
          Swal.fire({
            title: 'Error en la solicitud para abrir la puerta.',
            text:  error,
            icon: 'error',
          });
        }
      });
    }
  }


}
