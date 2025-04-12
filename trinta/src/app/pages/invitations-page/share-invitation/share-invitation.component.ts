import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatCardModule } from '@angular/material/card';
import { StepperOverviewComponent } from '../../../ui-elements/stepper/stepper-overview/stepper-overview.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StWithFormsComponent } from '../../../ui-elements/slide-toggle/st-with-forms/st-with-forms.component';
import { MatSelectModule } from '@angular/material/select';
import { InvitationService } from '../services/invitation.service';
import { Invitation } from '../models/invitation-request.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'
import { AuthService } from '../../../authentication/services/auth.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToggleService } from '../../../common/header/toggle.service';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;

  if (startTime && endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start > end) {
      return { dateRangeInvalid: true };
    }
  }

  return null;
};

@Component({
  selector: 'app-share-invitation',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FeathericonsModule,
    MatCardModule,
    StepperOverviewComponent,
    MatDatepickerModule, 
    MatNativeDateModule, 
    FeathericonsModule,
    MatSlideToggleModule, 
    StWithFormsComponent,
    MatSelectModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatRadioModule 
  ],
  providers: [
    provideNgxMask() 
  ],
  templateUrl: './share-invitation.component.html',
  styleUrl: './share-invitation.component.scss'
})
export class ShareInvitationComponent implements OnInit{

  now = new Date();

  form: FormGroup;
  private fb = inject(FormBuilder);
  private _invitationService = inject(InvitationService);
  private _authService = inject(AuthService);
  public IdNeighbor : number;
  public Location: string;

  constructor(        
    public toggleService: ToggleService
  ){
    this.IdNeighbor = this._authService.userIdGet;
    this.Location = this._authService.userLocation;
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.toggleService.closeSidebar();
    }, 0);

    // Inicializar el formulario
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
        email: ['', [Validators.email, Validators.maxLength(60)]],
        phoneNumber: ['', [Validators.required, 
                           Validators.maxLength(10),
                           Validators.minLength(10), 
                          //  Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
                          ]
                      ],
        location: [{ value: '', disabled: true }, Validators.required],
        startTime: [{ value: this.convertToLocalTime(new Date()), disabled: true}, [Validators.required]],
        endTime: [{ value: this.convertToLocalTime(new Date()), disabled: true }, [Validators.required]],
        isReusable: [{ value: 'No', disabled: true }, Validators.required],
        accessType: ['1', Validators.required]
        // startTimeHour: ['',Validators.required],
        // endTimeHour: ['',Validators.required]
      },
      { validators: dateRangeValidator }
    );

    // Convertir startTime y endTime a objetos Date si son strings
    if (this.form.controls['startTime'].value) {
      const startTimeValue = this.form.controls['startTime'].value;
      this.form.controls['startTime'].setValue(new Date(startTimeValue));
    }
  
    if (this.form.controls['endTime'].value) {
      const endTimeValue = this.form.controls['endTime'].value;
      this.form.controls['endTime'].setValue(new Date(endTimeValue));
    }
  
    // Asignar el valor al control 'location' después de inicializar el formulario
    this.form.controls['location'].setValue(this.Location);

    this.form.get('isReusable')!.valueChanges.subscribe((value) => {
      const today = new Date();
    
      if (value === 'Si') {
        // Habilitar los campos y aplicar validaciones
        this.form.get('startTime')?.setValidators([Validators.required]);
        this.form.get('endTime')?.setValidators([Validators.required]);
        this.form.get('startTime')?.enable();
        this.form.get('endTime')?.enable();
      } else {
        // Deshabilitar los campos y establecer valores predeterminados
        this.form.get('startTime')?.clearValidators();
        this.form.get('endTime')?.clearValidators();
        this.form.get('startTime')?.setValue(today);
        this.form.get('endTime')?.setValue(today);
        this.form.get('startTime')?.disable();
        this.form.get('endTime')?.disable();
    
        // Marcar los campos como válidos manualmente
        this.form.get('startTime')?.updateValueAndValidity({ onlySelf: true });
        this.form.get('endTime')?.updateValueAndValidity({ onlySelf: true });
      }
    
      // Actualizar validaciones
      this.form.get('startTime')?.updateValueAndValidity();
      this.form.get('endTime')?.updateValueAndValidity();
    });
    
    
    

    // this.form.get('phoneNumber')?.valueChanges.subscribe((value) => {
    //   console.log('Valor ingresado:', value);
    //   // if (value) {
    //   //   const cleanedValue = value.replace(/\s+/g, '').trim();
    //   //   console.log('Valor después de trim:', cleanedValue);
    
    //   //   this.form.get('phoneNumber')?.setValue(cleanedValue, { emitEvent: false });
    //   // }
    // });
    
    

  }

  private validateDateRange(): boolean {
    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;
    
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffInMs = end.getTime() - start.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 7) {
        // Si la fecha de fin es mayor a 7 días desde la fecha de inicio
        return false;
      }
    }
    return true;
  }
  
  onSubmit() {

    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);

      Swal.fire({
        title: 'Error!',
        text: 'La invitación tiene datos sin capturar.Favor de capturar la información de la invitación antes de compartirla.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Realiza la validación de rango de fechas
    if (!this.validateDateRange()) {
      Swal.fire({
        title: 'Error de fecha!',
        text: 'La fecha de la invitación no puede ser más de 7 días después de la fecha de inicio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // const startTime = this.form.value.startTimeHour;
    // const endTime = this.form.value.endTimeHour;
  
    // // Convertir las horas a `TimeSpan` en formato de 24 horas
    // const startHours = +startTime.split(':')[0];
    // const startMinutes = +startTime.split(':')[1];
    // const endHours = +endTime.split(':')[0];
    // const endMinutes = +endTime.split(':')[1];

    const invitation: Invitation = {
      phoneNumber: this.form.value.phoneNumber ?? '',
      startTime: this.form.value.startTime ? new Date(this.form.value.startTime) : new Date(),
      endTime: this.form.value.endTime ? new Date(this.form.value.endTime) : new Date(),
      isReusable: this.form.value.isReusable ?? 'No',
      neighborId: this.IdNeighbor,
      isValid: true,
      GuestName: this.form.value.name ?? '',
      accessType: parseInt(this.form.value.accessType)
    };

    // Llamamos al servicio para crear la invitación

    // console.log(invitation);

    this._invitationService.createInvitation(invitation).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.compartir(response.message); // Compartimos la invitación con el token generado
        } else {
          // console.error('Error al crear la invitación:', response.message);
          Swal.fire({
            title: 'Error al crear la invitación',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      error: (err) => {
        // console.error('Error en la creación de la invitación:', err);
        Swal.fire({
          title: 'Error al crear la invitación',
          text: err,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    });

  }

  compartir(token: string): void {
     const shareUrl = `https://www.passo.mx/invitation/detail/${token}`;
    // const shareUrl = `https://cheery-buttercream-03c2f4.netlify.app/invitation/detail/${token}`;
    // alert(token);
    // localStorage.setItem('invitationToken', token);
    // const shareUrl = `https://746d-177-230-96-73.ngrok-free.app/invitation/detail`;

    const message = `¡Has recibido una invitación! Para acceder, pulsa en el siguiente enlace: ${shareUrl}. Gracias por usar nuestro servicio.`;
    
  
    if (navigator.share) {
      navigator.share({
        title: `Passo te abre las puertas.`,
        text: `No hay que pensarlo mucho, un Passo y estás dentro, Vamos!. ¡Haz clic!.`, 
        url: shareUrl
      }).then(() => {
        console.log('Invitación compartida exitosamente');
      }).catch(console.error);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'La función de compartir no está disponible en este navegador.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private markFormGroupTouched(formGroup: any) {
    Object.keys(formGroup.controls).forEach((controlName) => {
      formGroup.get(controlName)?.markAsTouched();
    });
  }

  // onStepChange(event: any, stepper: MatStepper): void {
  //   console.log(stepper);
  //   console.log('inicio steep' ,stepper.selectedIndex);
  //   const inicioSteep = stepper.selectedIndex;
  //   const currentStep = event.previouslySelectedIndex + 1;
  //   console.log('siguiente' ,currentStep);
  
  //   if (!this.isStepValid(currentStep)) {
  //     this.markStepControlsAsTouched(currentStep);
  //     Swal.fire({
  //       title: 'Error!',
  //       text: 'Completa los campos requeridos antes de avanzar.',
  //       icon: 'error',
  //       confirmButtonText: 'Aceptar',
  //     });
  
  //     // Revertir al paso anterior
  //     stepper.selectedIndex = inicioSteep;
  //     stepper.previous();
  //     console.log('regresar' ,stepper.selectedIndex);
  //     console.log(stepper.previous());
  //   }
  // }

  onStepNext(step: number, stepper: MatStepper): void {
    switch (step) {
      case 1:
        if (!this.isStepValid(1)) {
          this.markStepControlsAsTouched(1);
          Swal.fire({
            title: 'Error!',
            text: 'Completa los campos requeridos antes de avanzar.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          return; // Detener el avance
        }
        break;
      case 2:
        if (!this.isStepValid(2)) {
          this.markStepControlsAsTouched(2);
          Swal.fire({
            title: 'Error!',
            text: 'Completa los campos requeridos antes de avanzar.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          return; // Detener el avance
        }
        break;
    }
  
    // Avanzar al siguiente paso usando el MatStepper
    stepper.next();
  }
  
  isStepValid(step: number): boolean {
    const invalidFields: string[] = [];
  
    switch (step) {
      case 1:
        ['name', 'email', 'phoneNumber'].forEach((field) => {
          const control = this.form.get(field);
          if (control && !control.valid) {
            invalidFields.push(field);
          }
        });
        break;
  
      case 2:
        // ['isReusable'].forEach((field) => {
        //   const control = this.form.get(field);
        //   if (control && !control.valid) {
        //     invalidFields.push(field);
        //   }
        // });

        this.form.get('isReusable')?.enable();

        // Parchear el valor para que Angular lo considere en la validación
        this.form.patchValue({
          isReusable: this.form.get('isReusable')?.value || false, // Asegurar que el valor se incluya
        });

        // Volver a deshabilitar el campo después de parcharlo
        this.form.get('isReusable')?.disable();
  
        // Considera solo si los campos están habilitados
        if (this.form.get('startTime')?.enabled && !this.form.get('startTime')?.valid) {
          invalidFields.push('startTime');
        }
        if (this.form.get('endTime')?.enabled && !this.form.get('endTime')?.valid) {
          invalidFields.push('endTime');
        }
  
        if (this.form.hasError('dateRangeInvalid')) {
          invalidFields.push('dateRange');
        }
        break;
  
      default:
        return true;
    }
  
    if (invalidFields.length > 0) {
      console.warn(`Campos inválidos en el paso ${step}:`, invalidFields);
    }
  
    return invalidFields.length === 0;
  }
  
  markStepControlsAsTouched(step: number): void {
    switch (step) {
      case 1:
        this.form.get('name')?.markAsTouched();
        this.form.get('email')?.markAsTouched();
        this.form.get('phoneNumber')?.markAsTouched();
        break;
      case 2:
        this.form.get('isReusable')?.markAsTouched();
        this.form.get('startTime')?.markAsTouched();
        this.form.get('endTime')?.markAsTouched();
        break;
    }
  }

  convertToLocalTime(dateString: string | Date): Date {
    if (!dateString) return new Date();
    
    // Si es un string, agregar "Z" y convertirlo a Date
    if (typeof dateString === 'string') {
      return new Date(dateString + 'Z');
    }
  
    // Si ya es un Date, devolverlo directamente
    return dateString;
  }
  
}
