import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { BaseApiResponse } from '../../shared/commons/base-api-response-interface';
import { LoginResponse } from '../model/login-response.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [RouterLink, MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit{
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly cd = inject(ChangeDetectorRef);
    authForm: FormGroup;


    initForm(): void {
        this.authForm = this.fb.group({
            userName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    // Password Hide
    hide = true;
  
    onSubmit() {
        if (this.authForm.invalid) {
          Object.values(this.authForm.controls).forEach((control) => {
            control.markAllAsTouched();
          });
          return;
        }
      
        this.authService.login(this.authForm.value).subscribe({
          next: (response: BaseApiResponse<LoginResponse>) => {
            if (response.isSuccess) {
              Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Tu viaje comienza con un solo Passo. ¡Bienvenido!.',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
              });
      
              // Redirigir después de mostrar el mensaje
              setTimeout(() => {
                this.router.navigate(['/invitations/share-invitation']);
              }, 2000);
            } else {
              // Mostrar mensaje de error del backend
              Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: response.message,
                confirmButtonText: 'Intentar de nuevo'
              });
            }
          },
          error: (error) => {
            // Capturar errores en caso de fallo en la petición
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.',
              confirmButtonText: 'Cerrar'
            });
            console.error(error);
          }
        });
      }
      

}