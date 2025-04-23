import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxEditorModule, Editor, Toolbar, Validators } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { UsersService } from '../services/users.service';
import { PermissionsService } from '../services/permissions.service'; // Import PermissionsService
import { FooterComponent } from '../../../common/footer/footer.component';
import { Fraccionmiento, Permission, UserCreate } from '../models/user-request.interface';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NeighborhoodService } from '../../neighborhoods-page/services/neighborhood.service';
import { FraccionamientosService } from '../services/fraccionamientos.service';

@Component({
    selector: 'app-add-user',
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
        RouterLinkActive,
        ReactiveFormsModule,
        CommonModule,
        MatCheckboxModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './add-user.component.html',
    styleUrl: './add-user.component.scss'
})

export class AddUserComponent implements OnInit{
 
    private fb = inject(FormBuilder);
    private _userServices = inject(UsersService);
    private permissionsService = inject(PermissionsService); // Inject PermissionsService
    private FraccionamientosService = inject(FraccionamientosService); // Inject FraccionamientosService

    hidePassword = true;
    hidePasswordConfirm = true;
    public multiple: boolean = false;
    imagenBase64?: string;
    permissions: Permission[] = []; // Array to store permissions
    fraccionamientos: Fraccionmiento[] = []; // Array to store fraccionamientos

    form = this.fb.group({
        firstName: ['', Validators.required],
        middleName: ['',Validators.required],
        lastName:['',Validators.required],
        userName:['',Validators.required],
        password:['',Validators.required],
        confirmPassword:['',Validators.required],
        role:['',Validators.required],
        foto: new FormControl<File | null>(null),
        email: ['',Validators.required],
        permissions: this.fb.array([]), // Initialize as a FormArray
        fraccionamientos: this.fb.array([]) // Initialize as a FormArray
    });

    ngOnInit(): void {
        // this.permissionsService.getPermissions().subscribe(data => {
        //     this.permissions = data; // Assign fetched permissions to the array
        // });

        this.permissionsService.getPermissions().subscribe(data => {
          this.permissions = data.map(item => ({
              id: item.id.toString(),
              name: item.name,
              description: item.description,
              checked: false
          }));
        });


        this.FraccionamientosService.getAll(1000, 'name', 'asc', 0, '').subscribe(resp => {
          this.fraccionamientos = (resp.data as { id: number; name: string }[]).map(item => ({
            id: item.id.toString(), // Converting to string to match the interface
            name: item.name,
            checked: false
          }));
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
            this.form.controls.foto.setValue(file);
            };
        }
    }

    onSubmit(){
    
        const user = this.form.value as UserCreate;

        console.log(user);

        const selectedFracs = this.fraccionamientos
        .filter(f => f.checked).map(f => ({ id: Number(f.id), name: f.name }));
    
        const selectedPerms = this.permissions
          .filter(p => p.checked).map(f => ({ id: Number(f.id), name: f.name }));

        user.fraccionamientos = selectedFracs; // Map selected IDs to Fraccionmiento objects
        user.permissions = selectedPerms; // Assign selected permissions to the user object


        this._userServices.createUser(user).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario',
                    text: response.message,
                  });
              } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                  });
                console.error('Error al crear la invitación:', response.message);
              }
            },
            error: (err) => {
              console.error('Error en la creación de la invitación:', err);
            }
          });

    }

}