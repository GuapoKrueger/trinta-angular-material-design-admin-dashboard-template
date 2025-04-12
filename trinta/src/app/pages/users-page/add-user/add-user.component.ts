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
import { FooterComponent } from '../../../common/footer/footer.component';
import { UserCreate } from '../models/user-request.interface';
import Swal from 'sweetalert2';

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
        ReactiveFormsModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './add-user.component.html',
    styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit{
 
    private fb = inject(FormBuilder);
    private _userServices = inject(UsersService);

    hidePassword = true;
    hidePasswordConfirm = true;
    public multiple: boolean = false;
    imagenBase64?: string;

    form = this.fb.group({
        firstName: ['', Validators.required],
        middleName: ['',Validators.required],
        lastName:['',Validators.required],
        userName:['',Validators.required],
        password:['',Validators.required],
        confirmPassword:['',Validators.required],
        role:['',Validators.required],
        foto: new FormControl<File | null>(null),
        email: ['',Validators.required]
    });

    ngOnInit(): void {
        
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