import { Component, OnInit } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { AuthService } from '../../authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgScrollbarModule, MatExpansionModule, RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule, AsyncPipe],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

    constructor(
        private toggleService: ToggleService, 
        public authService: AuthService,
        public router: Router
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit() {
        // Inicializar el rol del usuario si no está cargado
        this.authService.initializeUserRole();
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Mat Expansion
    panelOpenState = false;

    logoutAndRedirect() {
        this.authService.logout();
        this.router.navigate(['/authentication/login']);
    }
}