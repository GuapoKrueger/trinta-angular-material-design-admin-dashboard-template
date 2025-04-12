import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NeighborhoodService } from '../services/neighborhood.service';
import { Neighborhood } from '../models/neighborhood-request.interface';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxEditorModule } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-add-neighborhood',
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
    MatIconModule 
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-neighborhood.component.html',
  styleUrl: './add-neighborhood.component.scss'
})

export class AddNeighborhoodComponent implements OnInit {

  neighborhoodForm: FormGroup;
  form: FormGroup;
  selectedSubdivisionIndex: number | null = null;
  subdivisionName: string = '';
  streetName: string = '';
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private _neighborhoodService = inject(NeighborhoodService);


  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  subDivisionControl = new FormControl();

  constructor() {
    this.form = new FormGroup({
      clothes: this.subDivisionControl,
    });
  }

  ngOnInit(): void {

    this.neighborhoodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(40)]], // ✅ Corrección
      city: ['', [Validators.required, Validators.maxLength(40)]], // ✅ Corrección
      municipal: ['', [Validators.required, Validators.maxLength(40)]], // ✅ Corrección
      state: [true],
      latitude: ['', [Validators.required, Validators.pattern(/^-?\d{1,3}\.\d{6,9}$/)]], // ✅ Corrección
      longitude: ['', [Validators.required, Validators.pattern(/^-?\d{1,3}\.\d{6,9}$/)]], // ✅ Corrección
      hasSubdivision: [false],
      subdivisions: this.fb.array([])
    });

    this.subDivisionControl.valueChanges.subscribe((selectedSubdivisionName: string) => {
      this.selectedSubdivisionIndex = this.findSubdivisionIndexByName(selectedSubdivisionName);
    });
  }

  get subdivisions(): FormArray {
    return this.neighborhoodForm.get('subdivisions') as FormArray;
  }

  get selectedSubdivisionStreets(): FormArray {

    if (this.selectedSubdivisionIndex !== null && this.selectedSubdivisionIndex >= 0) {
      const subdivision = this.subdivisions.at(this.selectedSubdivisionIndex);
      return subdivision.get('streets') as FormArray;
    }
    return this.fb.array([]);
  }

  addSubdivision(): void {
    if (this.subdivisionName.trim() !== '' && !this.isDuplicateSubdivision(this.subdivisionName)) {
      const subdivisionForm = this.fb.group({
        name: [this.subdivisionName.trim(), [Validators.required, Validators.maxLength(40)]], // ✅ Corrección
        streets: this.fb.array([])
      });
      this.subdivisions.push(subdivisionForm);
      this.neighborhoodForm.patchValue({ hasSubdivision: true });
      this.subdivisionName = '';
      this.logNeighborhood();
    } else {
      Swal.fire('Error', 'El nombre de la subdivisión está vacío o ya existe.', 'error');
    }
  }

  findSubdivisionIndexByName(name: string | string[]): number {
    const nameToCompare = Array.isArray(name) ? name.join(' ').trim() : name.trim();

    return this.subdivisions.controls.findIndex(sub => {
        const subName = sub.get('name')?.value;

        if (typeof subName !== 'string') {
            return false;
        }

        return subName.trim() === nameToCompare;
    });
}

  onSubdivisionSelected(index: number): void {
    this.selectedSubdivisionIndex = index;
  }

  addStreet(): void {

    if(this.selectedSubdivisionIndex === null)
    {
      Swal.fire('Error', 'Debe seleccionar una subdivisión.', 'info');
      return;
    }

    if (this.selectedSubdivisionIndex !== null && this.streetName.trim() !== '' && !this.isDuplicateStreet(this.streetName)) {
      const streetsArray = this.selectedSubdivisionStreets;
      if (streetsArray) {
        streetsArray.push(this.fb.group({
          name: [this.streetName.trim(), [Validators.required, Validators.maxLength(40)]] // ✅ Corrección
        }));
        this.streetName = ''; 
        this.logNeighborhood();
      }
    } else {
      Swal.fire('Error', 'El nombre de la calle está vacío o ya existe.', 'error');
    }
  }

  logNeighborhood(): void {
    const neighborhood: Neighborhood = this.neighborhoodForm.value;
  }

  trackByFn(index: number): number {
    return index;
  }

  onSubmit(): void {

    // if (this.neighborhoodForm.invalid) {
    //   return Object.values(this.neighborhoodForm.controls).forEach((controls) => {
    //       controls.markAllAsTouched();
    //       Swal.fire({
    //         title: 'Error!',
    //         text: 'Por favor completa los campos requeridos.',
    //         icon: 'error',
    //         confirmButtonText: 'Aceptar'
    //       });
    //     });
    // }

    const neighborhood: Neighborhood = {
      ...this.neighborhoodForm.value,
      state: this.neighborhoodForm.value.state === 'True' || this.neighborhoodForm.value.state === true
    };
        console.log('Neighborhood:', neighborhood);
        
        this._neighborhoodService.neighborhoodCreate(neighborhood).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                Swal.fire('Éxito', 'El fraccionamiento ha sido creado correctamente.', 'success');
                this.router.navigate(['/neighborhoods/neighborhood-list']);
              } else {
                Swal.fire('Error al crear el fraccionamiento', response.message, 'error');
              }
            },
            error: (error) => {
              Swal.fire('Error al crear el fraccionamiento', error, 'error');
            }
        });

  }

  removeSubdivision(index: number): void {
    const subdivision = this.subdivisions.at(index);
    const streets = subdivision.get('streets') as FormArray;

    if (streets.length > 0) {
      Swal.fire({
        title: 'Confirmación',
        text: 'La subdivisión tiene calles asociadas. ¿Desea eliminarla junto con las calles?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.subdivisions.removeAt(index);
          this.selectedSubdivisionIndex = null;
        }
      });
    } else {
      this.subdivisions.removeAt(index);
      this.selectedSubdivisionIndex = null;
    }
  }
  
  removeStreet(streetIndex: number): void {
    const streetsArray = this.selectedSubdivisionStreets;
    if (streetsArray) {
      streetsArray.removeAt(streetIndex);
    }
  }

  isDuplicateSubdivision(name: string): boolean {
    return this.subdivisions.controls.some(sub => sub.get('name')?.value.trim().toLowerCase() === name.trim().toLowerCase());
  }

  isDuplicateStreet(name: string): boolean {
    return this.selectedSubdivisionStreets.controls.some(street => street.get('name')?.value.trim().toLowerCase() === name.trim().toLowerCase());
  }

  validateNumber(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/[\d.-]/.test(inputChar)) {
      event.preventDefault();
    }
  }
  
}


