import { Component, inject, OnInit, Inject } from '@angular/core'; // Import Inject
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Import MAT_DIALOG_DATA
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NeighborhoodService } from '../../../neighborhoods-page/services/neighborhood.service'; // Adjust path if needed
import { Subdivision, Street, Neighborhood } from '../../../neighborhoods-page/models/neighborhood-request.interface'; // Adjust path if needed
import { NeighborhoodResponse } from '../../../neighborhoods-page/models/neighborhood-response.interface'; // Adjust path if needed
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module'; // Adjust path if needed
import { Address } from '../../models/neighbor-request.interface';
import { NeighborService } from '../../services/neighbor.service';

@Component({
  selector: 'app-add-address-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FeathericonsModule
  ],
  templateUrl: './add-address-dialog.component.html',
  styleUrl: './add-address-dialog.component.scss'
})
export class AddAddressDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private neighborhoodService = inject(NeighborhoodService);
  private neighborService = inject(NeighborService);

  
  public dialogRef = inject(MatDialogRef<AddAddressDialogComponent>);
  isEditMode = false; // Flag to track if editing

  addressForm: FormGroup;
  neighborhoods: Neighborhood[] = [];
  subdivisions: Subdivision[] = [];
  streets: Street[] = [];

  constructor(
    // Inject MAT_DIALOG_DATA
    @Inject(MAT_DIALOG_DATA) public data: Address | null
  ) {
    this.addressForm = this.fb.group({
      neighborhoodId: ['', Validators.required],
      subdivisionId: [{ value: '', disabled: true }, Validators.required],
      streetId: [{ value: '', disabled: true }, Validators.required],
      number: ['', [Validators.required, Validators.maxLength(10)]]
    });

    if (this.data) {
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.loadNeighborhoods(); // Load neighborhoods first

    // Listen for changes in neighborhood selection
    this.addressForm.get('neighborhoodId')?.valueChanges.subscribe(neighborhoodId => {
      // Only reset if not initializing in edit mode or if the user changes the selection
      if (!this.isEditMode || this.addressForm.get('neighborhoodId')?.dirty) {
          this.addressForm.get('subdivisionId')?.reset({ value: '', disabled: true });
          this.addressForm.get('streetId')?.reset({ value: '', disabled: true });
          this.subdivisions = [];
          this.streets = [];
      }
      if (neighborhoodId) {
        this.loadSubdivisions(neighborhoodId);
        this.addressForm.get('subdivisionId')?.enable();
      }
    });

    // Listen for changes in subdivision selection
    this.addressForm.get('subdivisionId')?.valueChanges.subscribe(subdivisionId => {
       // Only reset if not initializing in edit mode or if the user changes the selection
       if (!this.isEditMode || this.addressForm.get('subdivisionId')?.dirty) {
           this.addressForm.get('streetId')?.reset({ value: '', disabled: true });
           this.streets = [];
       }
      if (subdivisionId) {
        this.loadStreets(subdivisionId);
        this.addressForm.get('streetId')?.enable();
      }
    });

    // If editing, patch the form after neighborhoods are loaded
    // This is handled within the loadNeighborhoods callback now
    // if (this.isEditMode && this.data) {
    //     this.patchFormForEdit();
    // }
  }

  loadNeighborhoods(): void {
    const size = 1000;
    const sort = 'Name'; // Use 'Name' from NeighborhoodResponse
    const order = 'asc';
    const numPage = 0;
    const getInputs = '';

    this.neighborhoodService.getAll(size, sort, order, numPage, getInputs).subscribe(response => {
      if (response.isSuccess && response.data) {
        this.neighborhoods = response.data;
        // If editing, trigger subdivision loading after neighborhoods are loaded
        if (this.isEditMode && this.data?.neighborhoodId) {
            this.addressForm.patchValue({ neighborhoodId: this.data.neighborhoodId }, { emitEvent: false }); // Patch without triggering change yet
            this.loadSubdivisions(this.data.neighborhoodId); // Now load subdivisions
        }
      } else {
        console.error("Error loading neighborhoods or data format incorrect:", response.message, response.data);
        this.neighborhoods = []; // Clear on error or incorrect format
      }
    }, error => {
        console.error("Error fetching neighborhoods:", error);
        this.neighborhoods = []; // Clear on fetch error
    });
  }

  loadSubdivisions(neighborhoodId: number): void {
    this.neighborService.getByNeighborhoodId(neighborhoodId).subscribe(response => {
      if (response.isSuccess && response.data) {
        this.subdivisions = response.data;
        this.addressForm.get('subdivisionId')?.enable(); // Ensure enabled
        // If editing, trigger street loading after subdivisions are loaded
        if (this.isEditMode && this.data?.subdivisionId) {
            this.addressForm.patchValue({ subdivisionId: this.data.subdivisionId }, { emitEvent: false }); // Patch without triggering change yet
            this.loadStreets(this.data.subdivisionId); // Now load streets
        }
      } else {
        console.error("Error loading subdivisions:", response.message);
        this.subdivisions = [];
        this.addressForm.get('subdivisionId')?.disable();
      }
    });
  }

  loadStreets(subdivisionId: number): void {
    this.neighborService.getBySubdivisionId(subdivisionId).subscribe(response => {
      if (response.isSuccess && response.data) {
        this.streets = response.data;
        this.addressForm.get('streetId')?.enable(); // Ensure enabled
         // If editing, patch the streetId and number now
         if (this.isEditMode && this.data) {
            this.addressForm.patchValue({ 
                streetId: this.data.streetId,
                number: this.data.number // Patch number here as well
            }, { emitEvent: false });
         }
      } else {
        console.error("Error loading streets:", response.message);
        this.streets = [];
        this.addressForm.get('streetId')?.disable();
      }
    });
  }

  // patchFormForEdit is no longer needed as patching is handled sequentially in load callbacks
  // patchFormForEdit(): void { ... }


  onSave(): void {
    if (this.addressForm.valid) {
      const selectedNeighborhood = this.neighborhoods.find(n => n.id === this.addressForm.value.neighborhoodId);
      const selectedSubdivision = this.subdivisions.find(s => s.id === this.addressForm.value.subdivisionId);
      const selectedStreet = this.streets.find(st => st.id === this.addressForm.value.streetId);

      const addressData: Address = {
        // Keep the original ID if editing, otherwise generate a new one (or let backend handle it)
        id: this.isEditMode && this.data ? this.data.id : 0, // Use existing ID if editing
        neighborhoodId: this.addressForm.value.neighborhoodId,
        neighborhoodName: selectedNeighborhood?.name || '', // Use 'Name'
        subdivisionId: this.addressForm.value.subdivisionId,
        subdivisionName: selectedSubdivision?.name || '',
        streetId: this.addressForm.value.streetId,
        streetName: selectedStreet?.name || '',
        number: this.addressForm.value.number,
        IsNew: this.data?.IsNew ?? true // Use ?? to default only if undefined/null

      };
      this.dialogRef.close(addressData);
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}