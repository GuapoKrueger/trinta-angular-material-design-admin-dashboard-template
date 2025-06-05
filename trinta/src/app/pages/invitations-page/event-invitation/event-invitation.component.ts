import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AddressResponse, NeighborAddressResponse } from '../../neighbors-page/models/neighbor-response.interface';
import { NeighborService } from '../../neighbors-page/services/neighbor.service';
import { InvitationByIdNeighborResponse } from '../models/invitation-response.interface';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { EventInvitation } from '../models/event-invitation-request.inteface';
import { EventInvitationService } from '../services/event-invitation.service';
import { environment as env } from '../../../../environments/environment.development';


export const dateAndTimeRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const sDate = group.get('startTime')!.value;
  const eDate = group.get('endTime')!.value;
  const sHour = group.get('startTimeHour')!.value;
  const eHour = group.get('endTimeHour')!.value;

  // Validar fecha
  if (sDate && eDate && new Date(sDate) > new Date(eDate)) {
    return { dateRangeInvalid: true };
  }
  // Validar hora (solo si ambas hay valor)
  if (sHour && eHour) {
    const [sh, sm] = sHour.split(':').map(Number);
    const [eh, em] = eHour.split(':').map(Number);
    if ((sh * 60 + sm) > (eh * 60 + em)) {
      return { timeRangeInvalid: true };
    }
  }
  return null;
};
@Component({
  selector: 'app-event-invitation',
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
      MatSlideToggleModule, 
      StWithFormsComponent,
      MatSelectModule,
      CommonModule,
      NgxMaskDirective,
      NgxMaskPipe,
      MatRadioModule,
      MatButtonToggleModule,
      MatIconModule
    ],
  providers: [
    provideNgxMask() 
  ],
  templateUrl: './event-invitation.component.html',
  styleUrl: './event-invitation.component.scss'
})
export class EventInvitationComponent implements OnInit{

  now = new Date();

  form: FormGroup;
  private fb = inject(FormBuilder);
  private _invitationService = inject(EventInvitationService);
  private _authService = inject(AuthService);
  private _neighborService = inject(NeighborService);
  private router = inject(Router);
  private location = inject(Location);
  public IdNeighbor : number;
  public Adresses: NeighborAddressResponse[];
  public token: string = '';
  public imagePreview: string|ArrayBuffer|null = null;

  constructor(        
    public toggleService: ToggleService
  ){
    this.IdNeighbor = this._authService.userIdGet;

    this._neighborService.getNeighborAddresses(this.IdNeighbor).subscribe({
      next: (response) => {
        this.Adresses = response.data; // Aquí extraes el arreglo de NeighborAddressResponse[]
      },
      error: (error) => {
        console.error('Error al obtener las direcciones:', error);
        this.Adresses = []; // Opcional: asignar arreglo vacío en caso de error
      }
    });

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
        // phoneNumber: ['', [Validators.required, 
        //                    Validators.maxLength(10),
        //                    Validators.minLength(10), 
        //                   ]
        //               ],
        neighborAddressId: [{ value: '' }, Validators.required], // Renamed from location
        startTime: [{ value: this.convertToLocalTime(new Date()), disabled: false}, [Validators.required]],
        endTime: [{ value: this.convertToLocalTime(new Date()), disabled: false }, [Validators.required]],
        // isReusable: [{ value: 'No', disabled: true }, Validators.required],
        // accessType: ['1', Validators.required],
        startTimeHour: [null, Validators.required],
        endTimeHour: [null, Validators.required],
        image: [null, [Validators.required, this.fileValidator(['png','jpg'], 2_000_000)]]
      },
      { validators: dateAndTimeRangeValidator }
    );

    // Auto-sync endTime with startTime when it changes
    this.form.get('startTime')?.valueChanges.subscribe(value => {
      this.form.get('endTime')?.setValue(value);
    });

    // Convertir startTime y endTime a objetos Date si son strings
    if (this.form.controls['startTime'].value) {
      const startTimeValue = this.form.controls['startTime'].value;
      this.form.controls['startTime'].setValue(new Date(startTimeValue));
    }
  
    if (this.form.controls['endTime'].value) {
      const endTimeValue = this.form.controls['endTime'].value;
      this.form.controls['endTime'].setValue(new Date(endTimeValue));
    }
  
    // Asignar el valor al control 'neighborId' después de inicializar el formulario
    if (this.Adresses && this.Adresses.length > 0) {
        this.form.controls['neighborAddressId'].setValue(this.Adresses[0].id); // Renamed from location
    } else {
        this.form.controls['neighborAddressId'].setValue(null); // Renamed from location
    }

    // this.form.get('isReusable')!.valueChanges.subscribe((value) => {
    //   const today = new Date();
    
    //   if (value === 'Si') {
    //     // Habilitar los campos y aplicar validaciones
    //     this.form.get('startTime')?.setValidators([Validators.required]);
    //     this.form.get('endTime')?.setValidators([Validators.required]);
    //     this.form.get('startTime')?.enable();
    //     this.form.get('endTime')?.enable();
    //   } else {
    //     // Deshabilitar los campos y establecer valores predeterminados
    //     this.form.get('startTime')?.clearValidators();
    //     this.form.get('endTime')?.clearValidators();
    //     this.form.get('startTime')?.setValue(today);
    //     this.form.get('endTime')?.setValue(today);
    //     this.form.get('startTime')?.disable();
    //     this.form.get('endTime')?.disable();
    
    //     // Marcar los campos como válidos manualmente
    //     this.form.get('startTime')?.updateValueAndValidity({ onlySelf: true });
    //     this.form.get('endTime')?.updateValueAndValidity({ onlySelf: true });
    //   }
    
    //   // Actualizar validaciones
    //   this.form.get('startTime')?.updateValueAndValidity();
    //   this.form.get('endTime')?.updateValueAndValidity();
    // });
    
    // Recuperar datos del estado de navegación
    let invitationData: InvitationByIdNeighborResponse | undefined;
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['invitationData']) {
      invitationData = nav.extras.state['invitationData'] as InvitationByIdNeighborResponse;
    } else if (this.location.getState() && (this.location.getState() as any).invitationData) {
      invitationData = ((this.location.getState() as any).invitationData) as InvitationByIdNeighborResponse;
    }

    if (invitationData) {
      // Llenar el formulario con los datos recibidos
      this.form.patchValue({
        name: invitationData.guestName || '',
        // phoneNumber: invitationData.phoneNumber || '',
        neighborAddressId: invitationData.neighborAddressId ? invitationData.neighborAddressId : this.Adresses[0].id, // Renamed from location
        startTime: invitationData.startTime ? new Date(invitationData.startTime) : this.convertToLocalTime(new Date()),
        endTime: invitationData.endTime ? new Date(invitationData.endTime) : this.convertToLocalTime(new Date()),
        isReusable: 'Si',
        accessType: invitationData.accessType ? String(invitationData.accessType) : '1'
      });
    }
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
    // // Si ya existe un token, preguntar si desea generar una nueva invitación
    // if (this.token) {
    //   Swal.fire({
    //     title: 'Invitación ya generada',
    //     text: '¿Deseas generar una nueva invitación?',
    //     icon: 'question',
    //     showCancelButton: true,
    //     confirmButtonText: 'Sí, generar nueva',
    //     cancelButtonText: 'No, usar existente'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.token = '';
    //       this.form.reset();
    //       this.form.enable();
    //     } else {
    //       this.compartir(this.token);
    //     }
    //   });
    //   return;
    // }

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

    // 1) Combina fecha y hora de inicio
    const rawStartDate = this.form.value.startTime
      ? new Date(this.form.value.startTime)
      : new Date();
    const startHour = this.form.value.startTimeHour;
    if (startHour) {
      const [sh, sm] = startHour.split(':').map(Number);
      rawStartDate.setHours(sh, sm, 0, 0);
    }

    // 2) Combina fecha y hora de fin (si lo necesitas)
    const rawEndDate = this.form.value.endTime
      ? new Date(this.form.value.endTime)
      : new Date();
    const endHour = this.form.value.endTimeHour;
    if (endHour) {
      const [eh, em] = endHour.split(':').map(Number);
      rawEndDate.setHours(eh, em, 0, 0);
    }






    const invitation: EventInvitation = {
      phoneNumber: this.form.value.phoneNumber ?? '',
      startTime: rawStartDate,
      endTime: rawEndDate,
      isReusable: 'Si',
      neighborId: this.IdNeighbor,
      isValid: true,
      GuestName: this.form.value.name ?? '',
      // accessType: parseInt(this.form.value.accessType),
      neighborAddressId: this.form.value.neighborAddressId ?? 0,
      image: this.form.value.image ?? null
    };

    // Llamamos al servicio para crear la invitación
    if(this.token===''){
    this._invitationService.createEventInvitation(invitation).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.token = response.message;
           this.form.disable();           // Bloquear edición tras generar
            this.compartir(response.message); 
        } else {
          Swal.fire({
            title: 'Error al crear la invitación',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error al crear la invitación',
          text: err,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }else
  {
    this.compartir(this.token);
  }






  }

  compartir(token: string): void {
    const shareUrl = `https://www.passo.mx/eventinvitation/detail/${token}`;

    // const baseUrl = window.location.origin;
    // const shareUrl = `${baseUrl}/eventinvitation/detail/${token}`;

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
        ['name', 'email'].forEach((field) => {
          const control = this.form.get(field);
          if (control && !control.valid && this.token==='') {
            invalidFields.push(field);
          }
        });
        break;
  
      case 2:
        // this.form.get('isReusable')?.enable();

        // // Parchear el valor para que Angular lo considere en la validación
        // this.form.patchValue({
        //   isReusable: this.form.get('isReusable')?.value || false, // Asegurar que el valor se incluya
        // });

        // // Volver a deshabilitar el campo después de parcharlo
        // this.form.get('isReusable')?.disable();
  
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
        // this.form.get('phoneNumber')?.markAsTouched();
        break;
      case 2:
        // this.form.get('isReusable')?.markAsTouched();
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

  getFullAddress(): string {
    const address = this.Adresses.find(addr => addr.id === this.form.value.neighborAddressId);
    return address?.fullAddress || 'Dirección no encontrada';
  }

  onClose(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, permanecer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      }
    });
  }

  newInvitation(): void {
    // 1) Si ya existe token, preguntamos
    if (this.token) {
      Swal.fire({
        title: 'Nueva invitación',
        text: '¿Deseas generar una nueva invitación?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, generar nueva',
        cancelButtonText: 'No, mantener actual'
      }).then((result) => {
        if (result.isConfirmed) {
          this.clearInvitationForm();
        }
      });
      return;
    }
    // 2) Si no hay token, limpiamos directamente
    this.clearInvitationForm();
  }

  /** Reestablece token y devuelve el form al estado inicial */
  private clearInvitationForm(): void {
    this.token = '';
    this.form.reset({
      name: '',
      email: '',
      phoneNumber: '',
      neighborAddressId: this.Adresses?.[0]?.id ?? null,
      startTime: this.convertToLocalTime(new Date()),
      endTime: this.convertToLocalTime(new Date()),
      isReusable: 'No',
      accessType: '1'
    });
    // Volver a deshabilitar los campos según el flujo original
    this.form.get('startTime')?.disable();
    this.form.get('endTime')?.disable();
    // this.form.get('isReusable')?.disable();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (file) {
      this.form.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }


  fileValidator(allowedExt: string[], maxSize: number): ValidatorFn {
    return (ctrl: AbstractControl) => {
      const f: File = ctrl.value;
      if (!f) return null;
      const ext = f.name.split('.').pop()!.toLowerCase();
      if (!allowedExt.includes(ext)) return { badExt: true };
      if (f.size > maxSize)        return { tooLarge: true };
      return null;
    };
  }

  
}

