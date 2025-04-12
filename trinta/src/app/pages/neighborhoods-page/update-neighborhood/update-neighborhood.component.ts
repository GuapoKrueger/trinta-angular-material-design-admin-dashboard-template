import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NeighborhoodService } from '../services/neighborhood.service';
import { NeighborhoodByIdResponse, Subdivision } from '../models/neighborhood-response.interface';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxEditorModule } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-neighborhood',
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
  templateUrl: './update-neighborhood.component.html',
  styleUrl: './update-neighborhood.component.scss'
})
export class UpdateNeighborhoodComponent implements OnInit{

  neighborhoodId?: number;
  neighborhoodForm!: FormGroup;
  private _neighborhoodService = inject(NeighborhoodService);
  private fb = inject(FormBuilder);
  selectedSubdivisionIndex: number | null = null;
  subdivisionName: string = '';
  streetName: string = '';
  private router = inject(Router);
  subDivisionControl = new FormControl();

  constructor(private route: ActivatedRoute) {
    this.neighborhoodForm = new FormGroup({
      clothes: this.subDivisionControl,
    });
  }

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    this.neighborhoodId = idParam ? parseInt(idParam, 10) : undefined;

    this.initForm();

    if (this.neighborhoodId) {
      this.neighborhoodById(this.neighborhoodId);
    }
  }

  initForm(): void {
    this.neighborhoodForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      city: ['', Validators.required],
      municipal: ['', Validators.required],
      state: [true, Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      hasSubdivision: [false],
      subdivisions: this.fb.array([])
      // startHour: ['',Validators.required],
      // endHour: ['',Validators.required]
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
  
  neighborhoodById(neighborhoodId: number): void {
    this._neighborhoodService
      .neighborhoodById(neighborhoodId)
      .subscribe((resp: NeighborhoodByIdResponse) => {

        this.neighborhoodForm.reset({
          id: resp.id,
          name: resp.name,
          city: resp.city,
          municipal: resp.municipal,
          state: resp.state,
          latitude: resp.latitude,
          longitude: resp.longitude,
          hasSubdivision: resp.hasSubdivision
          // startHour: resp.startHour,
          // endHour: resp.endHour
        });

        this.loadSubdivisions(resp.subdivisions);

      });
  }

  loadSubdivisions(subdivisions: Subdivision[]): void {
    this.subdivisions.clear(); // Limpiar el FormArray antes de cargar los datos

    subdivisions.forEach(sub => {
      const subdivisionForm = this.fb.group({
        id: [sub.id],
        name: [sub.name, Validators.required],
        delete: [false],
        streets: this.fb.array(sub.streets.map(street => this.fb.group({
          id: [street.id],
          name: [street.name, Validators.required],
          delete: [false]
        })))
      });

      this.subdivisions.push(subdivisionForm);
    });
  }

  onSubdivisionSelected(index: number): void {
    this.selectedSubdivisionIndex = index;
  }

  addSubdivision(): void {
    if (this.subdivisionName.trim() !== '' && !this.isDuplicateSubdivision(this.subdivisionName)) {
      const subdivisionForm = this.fb.group({
        id: [null],
        name: [this.subdivisionName.trim(), Validators.required],
        delete: [false],
        streets: this.fb.array([])
      });
      this.subdivisions.push(subdivisionForm);
      this.neighborhoodForm.patchValue({ hasSubdivision: true });
      this.subdivisionName = '';
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
          id: [null],
          name: [this.streetName.trim(), Validators.required],
          delete: [false]
        }));
        this.streetName = ''; 
      }
    } else {
      Swal.fire('Error', 'El nombre de la calle está vacío o ya existe.', 'error');
    }
  }

  removeSubdivision(index: number): void {
    const subdivision = this.subdivisions.at(index);
    const streets = subdivision.get('streets') as FormArray;
    const subdivisionId = subdivision.get('id')?.value;
  
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
          if (subdivisionId) {
            // Si la subdivisión ya está registrada (tiene un ID), marcarla como eliminada
            subdivision.get('delete')?.setValue(true);
            // Marcar todas las calles asociadas como eliminadas
            streets.controls.forEach(street => street.get('delete')?.setValue(true));
          } else {
            // Si es una nueva subdivisión que aún no está registrada, eliminarla del FormArray
            this.subdivisions.removeAt(index);
          }
          this.selectedSubdivisionIndex = null;
        }
      });
    } else {
      if (subdivisionId) {
        // Si la subdivisión ya está registrada (tiene un ID), marcarla como eliminada
        subdivision.get('delete')?.setValue(true);
      } else {
        // Si es una nueva subdivisión que aún no está registrada, eliminarla del FormArray
        this.subdivisions.removeAt(index);
      }
      this.selectedSubdivisionIndex = null;
    }
  }
  
  
  
  removeStreet(streetIndex: number): void {
    const streetsArray = this.selectedSubdivisionStreets;
    const street = streetsArray.at(streetIndex);
    const streetId = street.get('id')?.value;
  
    if (streetId) {
      // Si la calle ya está registrada (tiene un ID), marcarla como eliminada
      street.get('delete')?.setValue(true);
    } else {
      // Si es una nueva calle que aún no está registrada, eliminarla del FormArray
      streetsArray.removeAt(streetIndex);
    }
  }
  

  isDuplicateSubdivision(name: string): boolean {
    return this.subdivisions.controls.some(sub => sub.get('name')?.value.trim().toLowerCase() === name.trim().toLowerCase());
  }

  isDuplicateStreet(name: string): boolean {
    return this.selectedSubdivisionStreets.controls.some(street => street.get('name')?.value.trim().toLowerCase() === name.trim().toLowerCase());
  }

  trackByFn(index: number): number {
    return index;
  }

  onSubmit(): void {
    
    if (this.neighborhoodForm.invalid) {
      return Object.values(this.neighborhoodForm.controls).forEach((controls) => {
          controls.markAllAsTouched();
          Swal.fire({
            title: 'Error!',
            text: 'Por favor completa los campos requeridos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
    }

    const updatedNeighborhood = this.neighborhoodForm.value;
    updatedNeighborhood.startHour = this.convertToTimeSpanFormat(updatedNeighborhood.startHour);
    updatedNeighborhood.endHour = this.convertToTimeSpanFormat(updatedNeighborhood.endHour);
    console.log(updatedNeighborhood);

    this._neighborhoodService.neighborhoodUpdate(updatedNeighborhood).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire('Éxito', 'El fraccionamiento ha sido actualizado correctamente.', 'success');
          this.router.navigate(['/neighborhoods/neighborhood-list']);
        } else {
          Swal.fire('Error al actualizar el fraccionamiento', response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al actualizar el vecindario:', error);
        Swal.fire('Error al actualizar el fraccionamiento', error, 'error');
      }
    });
  }

  private convertToTimeSpanFormat(time: string): string {
    if (!time) return '00:00:00'; // Valor predeterminado si el tiempo no está definido
    return time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time; // Agrega segundos si no existen
  }

}
