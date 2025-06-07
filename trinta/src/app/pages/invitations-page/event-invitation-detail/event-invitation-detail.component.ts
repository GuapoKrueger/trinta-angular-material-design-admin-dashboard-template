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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { environment as env } from '../../../../environments/environment.development';


@Component({
  selector: 'app-event-invitation-detail',
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
    MatButtonToggleModule,
    MatIconModule],
  templateUrl: './event-invitation-detail.component.html',
  styleUrl: './event-invitation-detail.component.scss'
})
export class EventInvitationDetailComponent {
    // isToggled
    isToggled = false;
    token: string | null = null;
    invitationDetails: InvitationResponse | null = null;
    isAccessSelected = false;
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
              // this.imagenBase64 = response.avatarUrl;
              // this.imagenBase64 = response.ImageEventoURL;
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
    // const shareUrl = `https://api.passo.mx/api/Door/open/${this.token}`;
    //const apiUrl = env.api;  
    //const fullUrl = `${apiUrl}Door/open/${this.token}`;

    if (this.token) {
      this._invitationService.openDoor(this.token, this.invitationDetails?.accessType).subscribe({
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


  onAccessTypeChange(value: number) {
    if (!this.invitationDetails) return;
    this.invitationDetails.accessType = value.toString();
    this.isAccessSelected = true; 
  }


}
