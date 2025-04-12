import { Component, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { RouterLink } from '@angular/router';
import { ToggleService } from './toggle.service';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, RouterLink, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {

    private _authService = inject(AuthService);
    public avatarUrl: string | null = null;

    constructor(
        public toggleService: ToggleService,
        private datePipe: DatePipe
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

        this.avatarUrl = this._authService.userAvatarUrl;
     
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Current Date
    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

}