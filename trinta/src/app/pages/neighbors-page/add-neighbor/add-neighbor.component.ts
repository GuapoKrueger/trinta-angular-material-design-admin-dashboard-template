import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Import MatTableDataSource and MatTableModule
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog
import { CommonModule } from '@angular/common';
import { NeighborService } from '../services/neighbor.service';
import { Neighbor, Address } from '../models/neighbor-request.interface'; // Keep only one import for Address
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
// Import your address dialog component here
import { AddAddressDialogComponent } from './add-address-dialog/add-address-dialog.component';

@Component({
  selector: 'app-add-neighbor',
  standalone: true,
  imports: [
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
    MatTableModule, // Add MatTableModule
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    MatIconModule // Add MatIconModule
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
  private _neighborService = inject(NeighborService);
  private dialog = inject(MatDialog); // Inject MatDialog

  neighborForm: FormGroup;
  imagenBase64?: string;
  hidePassword = true;

  // Address Table properties
  displayedColumns: string[] = ['neighborhoodName', 'subdivisionName', 'streetName', 'number', 'actions'];
  addresses: Address[] = []; // Array to hold addresses
  dataSource = new MatTableDataSource<Address>(this.addresses); // DataSource for the table

  ngOnInit(): void {
    this.neighborForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50)]],
      LastName: ['', [Validators.required, Validators.maxLength(50)]],
      MiddleName: ['', [Validators.required, Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      PhoneNumber: ['', [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
       ]
   ],
      Foto: [null],
      UserName: ['', [Validators.required, Validators.maxLength(15)]],
      Password: ['', [Validators.required, Validators.maxLength(15)]]
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


    // Next, check if the addresses list is empty
    if (this.addresses.length === 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Es necesario agregar al menos una dirección para el residente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return; // Stop execution if no addresses are added
    }

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
      addresses: this.addresses // Assign the addresses from the component property
    };


    // set al addresess id = 0
    this.addresses.forEach((address) => {
      address.id = 0; // Set ID to 0 for new addresses
    });

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

      value = value.replace(/\D/g, '');

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

  // --- Address Management Methods ---

  openAddAddressDialog(addressToEdit?: Address): void { // Accept optional address
    const dialogRef = this.dialog.open(AddAddressDialogComponent, {
      width: '500px',
      disableClose: true,
      data: addressToEdit ? { ...addressToEdit } : null // Pass a copy of the address data if editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Check if the dialog returned an address
        if (addressToEdit) {
          // Update existing address
          const index = this.addresses.findIndex(a => a.id === addressToEdit.id);
          if (index > -1) {
            this.addresses[index] = result; // Replace with updated data
          }
        } else {
          // Add new address
          this.addAddress(result);
        }
        this.dataSource.data = [...this.addresses]; // Refresh table data
      }
    });
  }

  addAddress(address: Address): void {
    // Ensure unique temporary ID if needed, or handle ID generation properly
    if (!address.id) {
        address.id = Date.now(); // Simple temporary ID generation
    }
    this.addresses.push(address);
    // No need to update dataSource here, it's done in openAddAddressDialog afterClosed
  }

  editAddress(addressToEdit: Address): void {
    this.openAddAddressDialog(addressToEdit); // Open dialog in edit mode
  }

  removeAddress(addressToRemove: Address): void {
    this.addresses = this.addresses.filter(address => address.id !== addressToRemove.id);
    this.dataSource.data = [...this.addresses]; // Refresh table data
  }
}
