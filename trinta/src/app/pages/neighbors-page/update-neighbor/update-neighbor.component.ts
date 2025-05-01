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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Neighborhood, Street, Subdivision } from '../../neighborhoods-page/models/neighborhood-request.interface';
import { NeighborService } from '../services/neighbor.service';
import { NeighborhoodService } from '../../neighborhoods-page/services/neighborhood.service';
import { NeighborByIdResponse } from '../models/neighbor-response.interface';
import Swal from 'sweetalert2';
import { Neighbor, Address } from '../models/neighbor-request.interface';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { AddAddressDialogComponent } from '../add-neighbor/add-address-dialog/add-address-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

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
    NgxMaskDirective,
    MatIconModule
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
  private dialog = inject(MatDialog);
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
  addresses: Address[] = [];
  dataSource = new MatTableDataSource<Address>(this.addresses);
  displayedColumns: string[] = ['neighborhoodName', 'subdivisionName', 'streetName', 'number', 'actions'];

  initForm(): void {
    this.neighborForm = this.fb.group({
      id:[],
      FirstName: ['', [Validators.required, Validators.maxLength(50)]], // Moved maxLength to sync validators
      LastName: ['', [Validators.required, Validators.maxLength(50)]], // Moved maxLength to sync validators
      MiddleName: ['', [Validators.required, Validators.maxLength(50)]], // Moved maxLength to sync validators
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      Foto: new FormControl<File | null>(null),
    });
  
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    this.neighborId = idParam ? parseInt(idParam, 10) : undefined;

    if (this.neighborId) {
      this.neighborById(this.neighborId);
    }
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

        // Load addresses from the response
        if (resp.addresses && resp.addresses.length > 0) {
          this.addresses = resp.addresses.map((addr, index) => ({
            ...addr,
            id: addr.id, // Assign temporary unique IDs for table operations
            number: addr.houseNumber, // Map houseNumber to number
            IsNew: false
          }));
          this.dataSource.data = [...this.addresses];
        } else {
          this.addresses = [];
          this.dataSource.data = [];
        }
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
        };
    }
  }

  onSubmit(): void {

    // Check if there are any addresses
    if (this.addresses.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe agregar al menos una dirección.',
      });
      return; // Stop the submission
    }

    // Map addresses for the request, renaming 'number' back to 'houseNumber'
    const addressesForRequest = this.addresses.map(addr => ({
      id: addr.id || 0, 
      neighborhoodId: addr.neighborhoodId,
      subdivisionId: addr.subdivisionId,
      streetId: addr.streetId,
      houseNumber: addr.number,
      number: addr.number, 
      IsNew: addr.IsNew 
    }));

    //set id to 0 if isnew = true
    addressesForRequest.forEach(address => {
      if (address.IsNew) {
        address.id = 0;
      }
    });

    const neighborData: Neighbor = {
      id: Number(this.neighborForm.get('id')?.value) || 0,
      FirstName: String(this.neighborForm.get('FirstName')?.value || ''),
      LastName: String(this.neighborForm.get('LastName')?.value || ''),
      MiddleName: String( this.neighborForm.get('MiddleName')?.value || ''),
      Email: String( this.neighborForm.get('Email')?.value || ''),
      PhoneNumber:String(this.neighborForm.get('PhoneNumber')?.value || ''),
      Foto: this.neighborForm.get('Foto')?.value as File|| null,
      UserName: String(this.neighborForm.get('UserName')?.value || ''),
      Password: String(this.neighborForm.get('Password')?.value || ''),
      addresses: addressesForRequest // Include addresses in the payload
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

  openAddAddressDialog(addressToEdit?: Address): void {
    const dialogRef = this.dialog.open(AddAddressDialogComponent, {
      width: '500px',
      disableClose: true,
      data: addressToEdit ? { ...addressToEdit } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const existingIndex = this.addresses.findIndex(a => a.id === result.id);

        if (addressToEdit && existingIndex > -1) {
            this.addresses[existingIndex] = result;
        } else if (addressToEdit && this.addresses.some(a => a.id === addressToEdit.id)) {
            const editIndex = this.addresses.findIndex(a => a.id === addressToEdit.id);
            if (editIndex > -1) {
                this.addresses[editIndex] = result;
            } else {
                 if (!result.id || this.addresses.some(a => a.id === result.id)) {
                    result.id = Date.now();
                 }
                 this.addresses.push(result);
            }
        } else {
          if (!result.id || this.addresses.some(a => a.id === result.id)) {
              result.id = Date.now();
          }
          this.addresses.push(result);
        }
        this.dataSource.data = [...this.addresses];
      }
    });
  }

  editAddress(addressToEdit: Address): void {
    this.openAddAddressDialog(addressToEdit);
  }

  removeAddress(addressToRemove: Address): void {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará la dirección: ${addressToRemove.streetName || 'N/A'} #${addressToRemove.number || 'N/A'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addresses = this.addresses.filter(address => address.id !== addressToRemove.id);
          this.dataSource.data = [...this.addresses];
          Swal.fire(
            'Eliminada',
            'La dirección ha sido eliminada.',
            'success'
          );
        }
      });
  }

}
