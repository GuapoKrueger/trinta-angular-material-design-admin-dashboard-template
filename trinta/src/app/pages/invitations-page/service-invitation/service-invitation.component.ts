import { UsersService } from '../../users-page/services/users.service';
import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { InvitationService } from '../services/invitation.service';
import { Invitation } from '../models/invitation-request.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'
import { AuthService } from '../../../authentication/services/auth.service';
import { ToggleService } from '../../../common/header/toggle.service';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AddressResponse, NeighborAddressResponse } from '../../neighbors-page/models/neighbor-response.interface';
import { NeighborService } from '../../neighbors-page/services/neighbor.service';
import { InvitationByIdNeighborResponse, AccessServiceType } from '../models/invitation-response.interface';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { Address } from '../../neighbors-page/models/neighbor-request.interface';
import { VigilanteList } from '../../users-page/models/user-combo.interface';
import { ServiceInvitationRequest } from '../models/service-invitation-request.interface';
import { ServiceInvitationService } from '../services/service-invitation/service-invitation.service';

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
  selector: 'app-service-invitation',
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
        MatDatepickerModule, 
        MatNativeDateModule, 
        MatSlideToggleModule, 
        MatSelectModule,
        CommonModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatIconModule
  ],
  providers: [
  ],
  templateUrl: './service-invitation-nuevo.component.html',
  styleUrl: './service-invitation-nuevo.component.scss'
})
export class ServiceInvitationComponent implements OnInit {

  now = new Date();

  form: FormGroup;
  private fb = inject(FormBuilder);
  private _serviceInvitationService = inject(ServiceInvitationService);
  private _authService = inject(AuthService);
  private _neighborService = inject(NeighborService);
  private router = inject(Router);
  private location = inject(Location);
  private _usersService = inject(UsersService);
  public IdNeighbor : number;
  public Adresses: NeighborAddressResponse[];
  public accessServiceTypes: AccessServiceType[] = [];
  public token: string = '';
  public guardsList: VigilanteList[] = [];
  private invitationDataToLoad: any;
  public isDuplicationrequestedByGateKeeper: boolean = false;
  public duplicationRequestId: number | null = null;

  constructor(        
    public toggleService: ToggleService,
    private route: ActivatedRoute
  )
  {
    this.IdNeighbor = this._authService.neighboorIdGet;
    
    // Store invitation data from navigation state
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['invitationData']) {
      this.invitationDataToLoad = nav.extras.state['invitationData'];
    } else if (this.location.getState() && (this.location.getState() as any).invitationData) {
      this.invitationDataToLoad = ((this.location.getState() as any).invitationData);
    }
    
    this._neighborService.getNeighborAddresses(this.IdNeighbor).subscribe({
      next: (response) => {
        this.Adresses = response.data; // Aquí extraes el arreglo de NeighborAddressResponse[]
        this.loadInvitationDataIfAvailable();
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

    // Load access service types
    this.loadAccessServiceTypes();

    // Inicializar el formulario
    this.form = this.fb.group(
      {
        accessServiceTypeId: [{value:''}, Validators.required], // indica el tipo de servicio al que se le dará acceso paqueteria, comida, etc.
        guestName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]], // indica el nombre del servicio por ejemplo "Mercadolibre", "Sushi Roll", etc.
        neighborAddressId: [{ value: '' }, Validators.required], // dirección del vecino
        gatekeeperUserId: [null, Validators.required], // ID del vigilante asignado
        accessType: ['1', Validators.required], // tipo de acceso, por ejemplo: 1 vehicular, 2 peatonal
        notes: ['', [Validators.maxLength(250)]], // notas adicionales sobre la invitación
        startTime: [{ value: this.convertToLocalTime(new Date()), disabled: false}, [Validators.required]], // fecha de inicio de la invitación
        endTime: [{ value: this.convertToLocalTime(new Date()), disabled: false }, [Validators.required]], // fecha de fin de la invitación
      },
      { validators: dateRangeValidator }
    );

    // Cargar lista de vigilantes
    this._usersService.getUsersByRole('vigilante').subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.guardsList = response.data;
          console.log('Vigilantes cargados:', this.guardsList);
        } else {
          this.guardsList = [];
        }
      },
      error: (err) => {
        this.guardsList = [];
        console.error('Error al cargar vigilantes', err);
      }
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

    // Eliminar valueChanges de isReusable, ya que siempre será 'No' y estará deshabilitado
  }

  // Mapea el nombre del servicio al ícono de Material Symbols
  private serviceIconMap: Record<string, string> = {
    'Paqueteria': 'local_shipping',
    'Proveedor': 'store',
    'Comida': 'restaurant',
    'Repartidor': 'delivery_dining',
    'Servicio de limpieza': 'cleaning_services',
    'Servicio generales': 'build',
    'Otros': 'dashboard_customize'
  };

  getServiceIcon(name?: string): string {
    const key = (name || '').trim();
    return this.serviceIconMap[key] ?? 'help_outline';
  }


  private loadAccessServiceTypes(): void {
    this._serviceInvitationService.getAccessServiceType().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.accessServiceTypes = response.data;
          this.loadInvitationDataIfAvailable();
        }
      },
      error: (error) => {
        console.error('Error loading access service types:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los tipos de servicio.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private loadInvitationDataIfAvailable(): void {
    if (this.invitationDataToLoad && this.accessServiceTypes.length > 0 && this.Adresses && this.Adresses.length > 0) {
      // Verificar si es una duplicación
      if (this.invitationDataToLoad.isDuplicationrequestedByGateKeeper) {
        this.isDuplicationrequestedByGateKeeper = true;
        this.duplicationRequestId = this.invitationDataToLoad.duplicationRequestId;
        console.log('Cargando datos de duplicación:', {
          isDuplicationrequestedByGateKeeper: this.isDuplicationrequestedByGateKeeper,
          duplicationRequestId: this.duplicationRequestId
        });
      }

      // Usar accessServiceTypeId directamente si está disponible, sino buscar por nombre
      let accessServiceTypeId = this.invitationDataToLoad.accessServiceTypeId || '';
      if (!accessServiceTypeId) {
        const serviceType = this.accessServiceTypes.find(type => type.name === this.invitationDataToLoad.accessServiceTypeName);
        accessServiceTypeId = serviceType?.id || '';
      }

      // Usar neighborAddressId directamente si está disponible, sino buscar por fullAddress
      let neighborAddressId = this.invitationDataToLoad.neighborAddressId;
      if (!neighborAddressId) {
        const address = this.Adresses?.find(addr => addr.fullAddress === this.invitationDataToLoad.fullAddress);
        neighborAddressId = address?.id || (this.Adresses && this.Adresses.length > 0 ? this.Adresses[0].id : null);
      }

      let accessTypeValue = '1'; 
      if (this.invitationDataToLoad.accessType) {
        const normalized = this.invitationDataToLoad.accessType.toLowerCase();
        if (normalized === 'vehicular') {
          accessTypeValue = '1';
        } else if (normalized === 'peatonal') {
          accessTypeValue = '2';
        }
      }

      // Llenar el formulario con los datos recibidos
      this.form.patchValue({
        guestName: this.invitationDataToLoad.guestName || '',
        neighborAddressId: neighborAddressId,
        startTime: this.invitationDataToLoad.startTime ? new Date(this.invitationDataToLoad.startTime) : this.convertToLocalTime(new Date()),
        endTime: this.invitationDataToLoad.endTime ? new Date(this.invitationDataToLoad.endTime) : this.convertToLocalTime(new Date()),
        accessType: accessTypeValue,
        notes: this.invitationDataToLoad.notes || '',
        accessServiceTypeId: accessServiceTypeId,
        gatekeeperUserId: this.invitationDataToLoad.gatekeeperUserId || null
      });

      // Mostrar mensaje informativo si es una duplicación
      if (this.isDuplicationrequestedByGateKeeper) {
        Swal.fire({
          title: 'Duplicación de invitación',
          text: 'Se han cargado los datos de la solicitud de duplicación. Revisa y modifica los campos según sea necesario.',
          icon: 'info',
          confirmButtonText: 'Entendido'
        });
      }

      // Clear the data to prevent reloading
      this.invitationDataToLoad = null;
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

    // Obtener fechas sin desfase
    const rawStart = this.form.value.startTime ? new Date(this.form.value.startTime) : new Date();
    const rawEnd = this.form.value.endTime ? new Date(this.form.value.endTime) : new Date();
    const startStr = this.toLocalISOString(rawStart);
    const endStr = this.toLocalISOString(rawEnd);

    
    const invitation: ServiceInvitationRequest = {
      accessServiceTypeId: this.form.value.accessServiceTypeId ?? '',
      startTime: startStr as any,
      endTime: endStr as any,
      neighborId: this.IdNeighbor,
      isValid: true,
      guestName: this.form.value.guestName ?? '',
      accessType: String(this.form.value.accessType),
      neighborAddressId: this.form.value.neighborAddressId ?? 0,
      gatekeeperUserId: this.form.value.gatekeeperUserId ?? 0,
      notes: this.form.value.notes ? this.form.value.notes.trim() : '',
      ...(this.isDuplicationrequestedByGateKeeper && this.duplicationRequestId && {
        duplicationRequestId: this.duplicationRequestId
      })
    };

    // Debug: Verificar el payload completo
    console.log('=== DEBUG INVITATION PAYLOAD ===');
    console.log('isDuplicationrequestedByGateKeeper:', this.isDuplicationrequestedByGateKeeper);
    console.log('duplicationRequestId:', this.duplicationRequestId);
    console.log('Final invitation payload:', invitation);
    console.log('================================');

    // Llamamos al servicio para crear la invitación
    if(this.token===''){
      this._serviceInvitationService.createInvitation(invitation).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.token = response.message;
          this.form.disable(); // Bloquear edición tras generar
          this.showInvitationCreatedMessage();
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
        console.error('Error al crear la invitación:', err);
        // Limpiar errores previos
        Object.keys(this.form.controls).forEach(field => {
          this.form.get(field)?.setErrors(null);
        });
        // Soporta errores como array (err.error.Errors)
        if (err && err.status === 400 && err.error && Array.isArray(err.error.Errors)) {
          err.error.Errors.forEach((item: any) => {
            const control = this.form.get(this.mapServerFieldToFormControl(item.PropertyName));
            if (control) {
              control.setErrors({ server: item.ErrorMessage });
              control.markAsTouched();
            }
          });
        }
        // Mensaje general
        Swal.fire({
          title: 'Error de validación',
          text: err.error?.title || err.error?.Message || 'Revisa los campos marcados en el formulario.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    });
    } else {
      this.showInvitationCreatedMessage();
    }
  }

  /**
   * Mapea el nombre del campo del backend al nombre del control en el formulario
   */
  private mapServerFieldToFormControl(serverField: string): string {
    // Ajusta los nombres según correspondan
    const map: Record<string, string> = {
      AccessServiceTypeId: 'accessServiceTypeId',
      StartTime: 'startTime',
      EndTime: 'endTime',
      NeighborId: 'neighborId', // No hay control directo, pero se mapea por si acaso
      GuestName: 'guestName',
      AccessType: 'accessType',
      NeighborAddressId: 'neighborAddressId',
      GatekeeperUserId: 'gatekeeperUserId',
      Notes: 'notes',
    };
    return map[serverField] || serverField;
  }

  private showInvitationCreatedMessage(): void {
    Swal.fire({
      title: '¡Invitación creada exitosamente!',
      text: 'La invitación de servicio ha sido generada correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.askForNewInvitation();
    });
  }

  private askForNewInvitation(): void {
    Swal.fire({
      title: '¿Deseas crear una nueva invitación?',
      text: 'Puedes crear otra invitación o regresar a la página principal.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear nueva',
      cancelButtonText: 'No, ir al inicio'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clearInvitationForm();
        this.form.enable();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  compartir(token: string): void {
     const shareUrl = `https://www.passo.mx/invitation/detail/${token}`;

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
        ['accessServiceTypeId', 'name', 'neighborAddressId'].forEach((field) => {
          const control = this.form.get(field);
          if (control && !control.valid && this.token==='') {
            invalidFields.push(field);
          }
        });
        break;
  
      case 2:
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
        this.form.get('accessServiceTypeId')?.markAsTouched();
        this.form.get('name')?.markAsTouched();
        this.form.get('neighborAddressId')?.markAsTouched();
        break;
      case 2:
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
      //return new Date(dateString);
    }
    
    // Si ya es un Date, devolverlo directamente
    return dateString;
  }

  getFullAddress(): string {
    if (!this.Adresses || this.Adresses.length === 0) {
      return 'No hay direcciones disponibles';
    }
    
    const address = this.Adresses.find(addr => addr.id === this.form.value.neighborAddressId);
    return address?.fullAddress || '';
  }

  getServiceTypeName(): string {
    if (!this.accessServiceTypes || this.accessServiceTypes.length === 0) {
      return 'No hay tipos de servicio disponibles';
    }
    
    const serviceType = this.accessServiceTypes.find(service => service.id === this.form.value.accessServiceTypeId);
    return serviceType?.name || 'Tipo de servicio no encontrado';
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
      accessServiceTypeId: '',
      guestName: '',
      neighborAddressId: this.Adresses?.[0]?.id ?? null,
      gatekeeperUserId: null,
      startTime: this.convertToLocalTime(new Date()),
      endTime: this.convertToLocalTime(new Date()),
      accessType: '1',
      notes: ''
    });
  }

  private toLocalISOString(date: Date): string {
     const tzOffset = date.getTimezoneOffset() * 60000; // ms
     const local = new Date(date.getTime() - tzOffset);
     return local.toISOString().slice(0,10);
   }
}
