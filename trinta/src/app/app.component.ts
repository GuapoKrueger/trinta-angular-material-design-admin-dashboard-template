declare let $: any;
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from '../app/common/header/toggle.service';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterOutlet, Router, NavigationCancel, NavigationEnd, RouterLink } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './shared/commons/custom-paginator-intl';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, RouterLink, SidebarComponent, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        },
        {
            provide: MatPaginatorIntl, 
            useValue: CustomPaginatorIntl()
        }
    ]
})
export class AppComponent {

    title = 'Passo';
    routerSubscription: any;
    location: any;

    constructor(
        public router: Router,
        public toggleService: ToggleService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Toggle Service
    isToggled = false;

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Settings Button Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // ngOnInit
    ngOnInit(){
        if (isPlatformBrowser(this.platformId)) {
            this.recallJsFuntions();
        }
    }

    // recallJsFuntions
    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
            this.location = this.router.url;
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.scrollToTop();
        });
    }
    scrollToTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
    }

    // Método para verificar si la URL contiene el prefijo /invitation/detail
  isInvitationDetailRoute(): boolean {
    // Obtiene la URL actual y verifica si contiene el prefijo /invitation/detail
    const url = this.router.url;
    return url.startsWith('/invitation/detail') || url.startsWith('/eventinvitation/detail');;
  }

}