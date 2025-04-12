import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Neighborhood, Street, Subdivision } from '../../neighborhoods-page/models/neighborhood-request.interface';
import { NeighborService } from '../services/neighbor.service';
import { NeighborhoodService } from '../../neighborhoods-page/services/neighborhood.service';
import { Neighbor } from '../models/neighbor-request.interface';
import Swal from 'sweetalert2';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-add-neighbor',
  standalone: true,
  imports: [
    RouterLink, 
    MatCardModule, 
    MatButtonModule, 
    MatMenuModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FeathericonsModule, 
    NgxEditorModule, 
    MatDatepickerModule, 
    FileUploadModule, 
    MatSelectModule, 
    MatRadioModule,
    MatButtonModule, 
    MatTableModule,
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectionList,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask() 
  ],
  templateUrl: './add-neighbor.component.html',
  styleUrl: './add-neighbor.component.scss'
})
export class AddNeighborComponent implements OnInit {
  private fb = inject(FormBuilder);
  private readonly router = inject(Router);
  neighborForm: FormGroup;
  neighborhoods: Neighborhood[] = [];
  subdivisions: Subdivision[] = [];
  streets: Street[] = [];
  private _neighborService = inject(NeighborService);
  private _neighborhoodService = inject(NeighborhoodService);
  imagenBase64?: string;
  hidePassword = true;

  ngOnInit(): void {
    this.neighborForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50)]],
      LastName: ['', [Validators.required, Validators.maxLength(50)]],
      MiddleName: ['', [Validators.required, Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      PhoneNumber: ['', [Validators.required, 
        Validators.maxLength(10),
        Validators.minLength(10), 
       //  Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
       ]
   ],
      NeighborhoodId: ['', [Validators.required]],
      SubdivisionId: ['', [Validators.required]],
      StreetId: ['', [Validators.required]],
      HouseNumber: ['', [Validators.required]],
      Foto: [null],
      UserName: ['', [Validators.required, Validators.maxLength(15)]],
      Password: ['', [Validators.required, Validators.maxLength(15)]]
    });

    this.getNeighbors(1000, 'Id', 'asc', 0, '');
  }

  getNeighbors(size: number, sort: string, order: string, numPage: number, getInputs: string): void {
    this._neighborhoodService.getAll(size, sort, order, numPage, getInputs).subscribe(response => {
      this.neighborhoods = response.data;
    });
  }

  onNeighborhoodChange(neighborhoodId: number) {
    this.subdivisions = [];
    this.streets = [];
    this._neighborService.getByNeighborhoodId(neighborhoodId).subscribe({
      next: (response) => {
        this.subdivisions = response.data;
      },
      error: (error) => {
        console.error('Error loading subdivisions:', error);
      },
    });
  }

  onSubdivisionChange(subdivisionId: number) {
    this.streets = [];
    this._neighborService.getBySubdivisionId(subdivisionId).subscribe({
      next: (response) => {
        this.streets = response.data;
      },
      error: (error) => {
        console.error('Error loading streets:', error);
      },
    });
  }

  onSubmit(): void {    
    if (this.neighborForm.invalid) {
      return Object.values(this.neighborForm.controls).forEach((controls) => {
          controls.markAllAsTouched();
          Swal.fire({
            title: 'Error!',
            text: 'Es necesario capturar la información del residente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }

      const neighborData: Neighbor = {
      id: Number(this.neighborForm.get('id')?.value) || 0,
      FirstName: String(this.neighborForm.get('FirstName')?.value || ''),
      LastName: String(this.neighborForm.get('LastName')?.value || ''),
      MiddleName: String( this.neighborForm.get('MiddleName')?.value || ''),
      Email: String( this.neighborForm.get('Email')?.value || ''),
      PhoneNumber:String(this.neighborForm.get('PhoneNumber')?.value || ''),
      NeighborhoodId: Number(this.neighborForm.get('NeighborhoodId')?.value) || 0,
      SubdivisionId: Number(this.neighborForm.get('SubdivisionId')?.value) || 0,
      StreetId: Number(this.neighborForm.get('StreetId')?.value) || 0,
      HouseNumber: String(this.neighborForm.get('HouseNumber')?.value || ''),
      Foto: this.neighborForm.get('Foto')?.value as File|| null,
      UserName: String(this.neighborForm.get('UserName')?.value || ''),
      Password: String(this.neighborForm.get('Password')?.value || '')
    };
      
      // console.log(neighborData);
      // Llamar al servicio para guardar los datos del vecino
      this._neighborService.createNeighbor(neighborData).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Residente',
                text: response.message,
              });
              this.router.navigate(['/neighbors/neighbor-list']);
          } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message,
              });
            console.error('Error al crear el residente:', response.message);
          }
          // Aquí podrías agregar alguna acción post-submit, como redirigir o limpiar el formulario
        },
        error: (error) => {
          console.error('Error saving neighbor:', error);
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length > 0){
        const file: File = input.files[0];

        const lector = new FileReader();
        lector.readAsDataURL(file);
        lector.onload = () => {
        
        this.imagenBase64 = lector.result as string;
        this.neighborForm.controls['Foto'].setValue(file);
        };
    }
  }

  private markFormGroupTouched(formGroup: any) {
    Object.keys(formGroup.controls).forEach((controlName) => {
      formGroup.get(controlName)?.markAsTouched();
    });
  }
  
  formatPhoneNumber() {
    const control = this.neighborForm.get('PhoneNumber');
    if (control) {
      let value = control.value || '';
  
      // Elimina caracteres no numéricos
      value = value.replace(/\D/g, '');
  
      // Aplica el formato (000) 000-0000
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
  
      if (value.length >= 6) {
        value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
      } else if (value.length >= 3) {
        value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
  
      control.setValue(value, { emitEvent: false });
    }
  }
  

}
