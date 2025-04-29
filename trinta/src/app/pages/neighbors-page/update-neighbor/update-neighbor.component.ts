import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { Neighborhood, Street, Subdivision } from '../../neighborhoods-page/models/neighborhood-request.interface';
import { NeighborService } from '../services/neighbor.service';
import { NeighborhoodService } from '../../neighborhoods-page/services/neighborhood.service';
import { NeighborByIdResponse } from '../models/neighbor-response.interface';
import Swal from 'sweetalert2';
import { Neighbor } from '../models/neighbor-request.interface';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-update-neighbor',
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
    MatTableModule,
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectionList,
    NgxMaskDirective
  ],
    providers: [
    provideNgxMask() 
  ],
  templateUrl: './update-neighbor.component.html',
  styleUrl: './update-neighbor.component.scss'
})
export class UpdateNeighborComponent implements OnInit{

  private fb = inject(FormBuilder);
  private router = inject(Router);
  neighborhoods: Neighborhood[] = [];
  subdivisions: Subdivision[] = [];
  streets: Street[] = [];
  private _neighborService = inject(NeighborService);
  private _neighborhoodService = inject(NeighborhoodService);
  neighborForm!: FormGroup;
  imagenBase64?: string;
  neighborId?: number;
  urlImagenActual?: string;
  hidePassword = true;

  initForm(): void {
    this.neighborForm = this.fb.group({
      id:[],
      FirstName: ['', Validators.required, Validators.maxLength(50)],
      LastName: ['', Validators.required, Validators.maxLength(50)],
      MiddleName: ['', Validators.required, Validators.maxLength(50)],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      Foto: new FormControl<File | null>(null),
    });
  
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initForm();
    this.getNeighbors(1000, 'Id', 'asc', 0, '');
    const idParam = this.route.snapshot.paramMap.get('id');
    this.neighborId = idParam ? parseInt(idParam, 10) : undefined;

    if (this.neighborId) {
      this.neighborById(this.neighborId);
    }
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

  neighborById(neighborId: number): void {
    this._neighborService
      .neighborById(neighborId)
      .subscribe((resp: NeighborByIdResponse) => {

        this.neighborForm.reset({
          id: resp.id,
          FirstName: resp.firstName,
          LastName: resp.lastName,
          MiddleName: resp.middleName,
          Email: resp.email,
          PhoneNumber: resp.phoneNumber,
          Foto: resp.avatarUrl
        });

        this.urlImagenActual = resp.avatarUrl;
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
        this.urlImagenActual = undefined;
        // this.neighborForm.controls.Foto.setValue(file);
        };
    }
  }

  onSubmit(): void {

    const neighborData: Neighbor = {
      id: Number(this.neighborForm.get('id')?.value) || 0,
      FirstName: String(this.neighborForm.get('FirstName')?.value || ''),
      LastName: String(this.neighborForm.get('LastName')?.value || ''),
      MiddleName: String( this.neighborForm.get('MiddleName')?.value || ''),
      Email: String( this.neighborForm.get('Email')?.value || ''),
      PhoneNumber:String(this.neighborForm.get('PhoneNumber')?.value || ''),
      Foto: this.neighborForm.get('Foto')?.value as File|| null,
      UserName: String(this.neighborForm.get('UserName')?.value || ''),
      Password: String(this.neighborForm.get('Password')?.value || '')
    };

      if(typeof neighborData.Foto === "string")
      {
        neighborData.Foto = undefined;
      }
      
      this._neighborService.UpdateNeighbor(neighborData).subscribe({
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
          }
        },
        error: (error) => {
          console.error('Error saving neighbor:', error);
        },
      });
  }

}
