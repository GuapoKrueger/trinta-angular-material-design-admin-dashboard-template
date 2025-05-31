import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { CrmComponent } from './dashboard/crm/crm.component';
import { ProjectManagementComponent } from './dashboard/project-management/project-management.component';
import { LmsComponent } from './dashboard/lms/lms.component';
import { HelpDeskComponent } from './dashboard/help-desk/help-desk.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
import { EProductsGridComponent } from './pages/ecommerce-page/e-products-grid/e-products-grid.component';
import { EProductsListComponent } from './pages/ecommerce-page/e-products-list/e-products-list.component';
import { EProductDetailsComponent } from './pages/ecommerce-page/e-product-details/e-product-details.component';
import { EOrdersListComponent } from './pages/ecommerce-page/e-orders-list/e-orders-list.component';
import { ECustomersListComponent } from './pages/ecommerce-page/e-customers-list/e-customers-list.component';
import { ESellersComponent } from './pages/ecommerce-page/e-sellers/e-sellers.component';
import { ESellerDetailsComponent } from './pages/ecommerce-page/e-seller-details/e-seller-details.component';
import { EOrderDetailsComponent } from './pages/ecommerce-page/e-order-details/e-order-details.component';
import { ECartComponent } from './pages/ecommerce-page/e-cart/e-cart.component';
import { ECheckoutComponent } from './pages/ecommerce-page/e-checkout/e-checkout.component';
import { ECreateProductComponent } from './pages/ecommerce-page/e-create-product/e-create-product.component';
import { CrmPageComponent } from './pages/crm-page/crm-page.component';
import { CContactsComponent } from './pages/crm-page/c-contacts/c-contacts.component';
import { CCustomersComponent } from './pages/crm-page/c-customers/c-customers.component';
import { CLeadsComponent } from './pages/crm-page/c-leads/c-leads.component';
import { COpportunitiesComponent } from './pages/crm-page/c-opportunities/c-opportunities.component';
import { ProjectManagementPageComponent } from './pages/project-management-page/project-management-page.component';
import { PmProjectsListComponent } from './pages/project-management-page/pm-projects-list/pm-projects-list.component';
import { PmProjectDetailsComponent } from './pages/project-management-page/pm-project-details/pm-project-details.component';
import { PmCreateProjectComponent } from './pages/project-management-page/pm-create-project/pm-create-project.component';
import { PmClientsComponent } from './pages/project-management-page/pm-clients/pm-clients.component';
import { PmTeamsComponent } from './pages/project-management-page/pm-teams/pm-teams.component';
import { PmTasksComponent } from './pages/project-management-page/pm-tasks/pm-tasks.component';
import { PmUsersComponent } from './pages/project-management-page/pm-users/pm-users.component';
import { PmKanbanBoardComponent } from './pages/project-management-page/pm-kanban-board/pm-kanban-board.component';
import { LmsPageComponent } from './pages/lms-page/lms-page.component';
import { LCoursesListComponent } from './pages/lms-page/l-courses-list/l-courses-list.component';
import { LCourseDetailsComponent } from './pages/lms-page/l-course-details/l-course-details.component';
import { LCreateCourseComponent } from './pages/lms-page/l-create-course/l-create-course.component';
import { LLessonPreviewComponent } from './pages/lms-page/l-lesson-preview/l-lesson-preview.component';
import { HelpDeskPageComponent } from './pages/help-desk-page/help-desk-page.component';
import { HdTicketsComponent } from './pages/help-desk-page/hd-tickets/hd-tickets.component';
import { HdReportsComponent } from './pages/help-desk-page/hd-reports/hd-reports.component';
import { HdAgentsComponent } from './pages/help-desk-page/hd-agents/hd-agents.component';
import { EventsListComponent } from './pages/events-page/events-list/events-list.component';
import { EventDetailsComponent } from './pages/events-page/event-details/event-details.component';
import { CreateAnEventComponent } from './pages/events-page/create-an-event/create-an-event.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';
import { InvoicesComponent } from './pages/invoices-page/invoices/invoices.component';
import { InvoiceDetailsComponent } from './pages/invoices-page/invoice-details/invoice-details.component';
import { AppsComponent } from './apps/apps.component';
import { KanbanBoardComponent } from './apps/kanban-board/kanban-board.component';
import { ToDoListComponent } from './apps/to-do-list/to-do-list.component';
import { ContactsComponent } from './apps/contacts/contacts.component';
import { PricingPageComponent } from './pages/pricing-page/pricing-page.component';
import { StarterComponent } from './starter/starter.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { TeamMembersComponent } from './pages/users-page/team-members/team-members.component';
import { UsersListComponent } from './pages/users-page/users-list/users-list.component';
import { AddUserComponent } from './pages/users-page/add-user/add-user.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { PUserProfileComponent } from './pages/profile-page/p-user-profile/p-user-profile.component';
import { PProjectsComponent } from './pages/profile-page/p-projects/p-projects.component';
import { PTeamsComponent } from './pages/profile-page/p-teams/p-teams.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ConnectionsComponent } from './settings/connections/connections.component';
import { PrivacyPolicyComponent } from './settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
import { MapsPageComponent } from './pages/maps-page/maps-page.component';
import { IconsComponent } from './icons/icons.component';
import { FeathericonsComponent } from './icons/feathericons/feathericons.component';
import { RemixiconComponent } from './icons/remixicon/remixicon.component';
import { MaterialSymbolsComponent } from './icons/material-symbols/material-symbols.component';
import { ChartsComponent } from './charts/charts.component';
import { ApexchartsComponent } from './charts/apexcharts/apexcharts.component';
import { GaugeComponent } from './charts/gauge/gauge.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { TimelinePageComponent } from './pages/timeline-page/timeline-page.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { GalleryPageComponent } from './pages/gallery-page/gallery-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { TestimonialsPageComponent } from './pages/testimonials-page/testimonials-page.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { FileManagerComponent } from './apps/file-manager/file-manager.component';
import { CalendarComponent } from './apps/calendar/calendar.component';
import { ChatComponent } from './apps/chat/chat.component';
import { EmailComponent } from './apps/email/email.component';
import { InboxComponent } from './apps/email/inbox/inbox.component';
import { ComposeComponent } from './apps/email/compose/compose.component';
import { ReadComponent } from './apps/email/read/read.component';
import { SocialFeedPageComponent } from './pages/social-feed-page/social-feed-page.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { TablesComponent } from './tables/tables.component';
import { FormsComponent } from './forms/forms.component';
import { BasicElementsComponent } from './forms/basic-elements/basic-elements.component';
import { AdvancedElementsComponent } from './forms/advanced-elements/advanced-elements.component';
import { WizardComponent } from './forms/wizard/wizard.component';
import { EditorsComponent } from './forms/editors/editors.component';
import { FileUploaderComponent } from './forms/file-uploader/file-uploader.component';
import { UiElementsComponent } from './ui-elements/ui-elements.component';
import { AlertsComponent } from './ui-elements/alerts/alerts.component';
import { AutocompleteComponent } from './ui-elements/autocomplete/autocomplete.component';
import { AvatarsComponent } from './ui-elements/avatars/avatars.component';
import { AccordionComponent } from './ui-elements/accordion/accordion.component';
import { BadgesComponent } from './ui-elements/badges/badges.component';
import { BreadcrumbComponent } from './ui-elements/breadcrumb/breadcrumb.component';
import { ButtonToggleComponent } from './ui-elements/button-toggle/button-toggle.component';
import { BottomSheetComponent } from './ui-elements/bottom-sheet/bottom-sheet.component';
import { ButtonsComponent } from './ui-elements/buttons/buttons.component';
import { CardsComponent } from './ui-elements/cards/cards.component';
import { CarouselsComponent } from './ui-elements/carousels/carousels.component';
import { CheckboxComponent } from './ui-elements/checkbox/checkbox.component';
import { ChipsComponent } from './ui-elements/chips/chips.component';
import { ColorPickerComponent } from './ui-elements/color-picker/color-picker.component';
import { ClipboardComponent } from './ui-elements/clipboard/clipboard.component';
import { ExpansionComponent } from './ui-elements/expansion/expansion.component';
import { DragDropComponent } from './ui-elements/drag-drop/drag-drop.component';
import { DividerComponent } from './ui-elements/divider/divider.component';
import { DialogComponent } from './ui-elements/dialog/dialog.component';
import { DatepickerComponent } from './ui-elements/datepicker/datepicker.component';
import { IconComponent } from './ui-elements/icon/icon.component';
import { GridListComponent } from './ui-elements/grid-list/grid-list.component';
import { FormFieldComponent } from './ui-elements/form-field/form-field.component';
import { UtilitiesComponent } from './ui-elements/utilities/utilities.component';
import { VideosComponent } from './ui-elements/videos/videos.component';
import { TreeComponent } from './ui-elements/tree/tree.component';
import { TabsComponent } from './ui-elements/tabs/tabs.component';
import { TableComponent } from './ui-elements/table/table.component';
import { ToolbarComponent } from './ui-elements/toolbar/toolbar.component';
import { TypographyComponent } from './ui-elements/typography/typography.component';
import { StepperComponent } from './ui-elements/stepper/stepper.component';
import { SnackbarComponent } from './ui-elements/snackbar/snackbar.component';
import { SliderComponent } from './ui-elements/slider/slider.component';
import { SlideToggleComponent } from './ui-elements/slide-toggle/slide-toggle.component';
import { SidenavComponent } from './ui-elements/sidenav/sidenav.component';
import { SelectComponent } from './ui-elements/select/select.component';
import { RatioComponent } from './ui-elements/ratio/ratio.component';
import { RadioComponent } from './ui-elements/radio/radio.component';
import { ProgressBarComponent } from './ui-elements/progress-bar/progress-bar.component';
import { PaginationComponent } from './ui-elements/pagination/pagination.component';
import { MenusComponent } from './ui-elements/menus/menus.component';
import { ListboxComponent } from './ui-elements/listbox/listbox.component';
import { ListComponent } from './ui-elements/list/list.component';
import { InputComponent } from './ui-elements/input/input.component';
import { TooltipComponent } from './ui-elements/tooltip/tooltip.component';
import { NeighborhoodsPageComponent } from './pages/neighborhoods-page/neighborhoods-page.component';
import { NeighborhoodListComponent } from './pages/neighborhoods-page/neighborhood-list/neighborhood-list.component';
import { AddNeighborhoodComponent } from './pages/neighborhoods-page/add-neighborhood/add-neighborhood.component';
import { NeighborListComponent } from './pages/neighbors-page/neighbor-list/neighbor-list.component';
import { AddNeighborComponent } from './pages/neighbors-page/add-neighbor/add-neighbor.component';
import { NeighborsPageComponent } from './pages/neighbors-page/neighbors-page.component';
import { InvitationsPageComponent } from './pages/invitations-page/invitations-page.component';
import { AddInvitationsComponent } from './pages/invitations-page/add-invitations/add-invitations.component';
import { ShareInvitationComponent } from './pages/invitations-page/share-invitation/share-invitation.component';
import { InvitationDetailComponent } from './pages/invitations-page/invitation-detail/invitation-detail.component';
import { authGuard } from './shared/guards/auth.guard';
import { UpdateNeighborComponent } from './pages/neighbors-page/update-neighbor/update-neighbor.component';
import { UpdateNeighborhoodComponent } from './pages/neighborhoods-page/update-neighborhood/update-neighborhood.component';
import { InvitationsListComponent } from './pages/invitations-page/invitations-list/invitations-list.component';
import { HomeComponent } from './pages/home/home.component';
import path from 'path';
import { Component } from '@angular/core';
import { HomeVisitasComponent } from './pages/home/home-visitas/home-visitas.component';
import { HomeMenuComponent } from './pages/home/home-menu/home-menu.component';
import { EventInvitationComponent } from './pages/invitations-page/event-invitation/event-invitation.component';
import { HomeEventComponent } from './pages/home/home-event/home-event.component';
import { EventInvitationDetailComponent } from './pages/invitations-page/event-invitation-detail/event-invitation-detail.component';


export const routes: Routes = [
    // {path: '', component: EcommerceComponent, canActivate : [authGuard]},
    {path: '', component: HomeMenuComponent, canActivate : [authGuard]},
    {
        path: 'home', 
        component: HomeComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'visitas', component: HomeVisitasComponent, canActivate: [authGuard] },
            { path: 'eventos', component: HomeEventComponent, canActivate: [authGuard] }
        ]
    },
    {path: 'crm', component: CrmComponent},
    {path: 'project-management', component: ProjectManagementComponent},
    {path: 'lms', component: LmsComponent},
    {path: 'help-desk', component: HelpDeskComponent},
    {
        path: 'apps',
        component: AppsComponent,
        children: [
            {path: '', component: ToDoListComponent},
            {path: 'kanban-board', component: KanbanBoardComponent},
            {path: 'file-manager', component: FileManagerComponent},
            {path: 'calendar', component: CalendarComponent},
            {path: 'contacts', component: ContactsComponent},
            {path: 'chat', component: ChatComponent},
            {
                path: 'email',
                component: EmailComponent,
                children: [
                    {path: '', component: InboxComponent},
                    {path: 'compose', component: ComposeComponent},
                    {path: 'read', component: ReadComponent}
                ]
            }
        ]
    },
    {
        path: 'ecommerce-page',
        component: EcommercePageComponent,
        children: [
            {path: '', component: EProductsGridComponent},
            {path: 'products-list', component: EProductsListComponent},
            {path: 'product-details', component: EProductDetailsComponent},
            {path: 'create-product', component: ECreateProductComponent},
            {path: 'cart', component: ECartComponent},
            {path: 'checkout', component: ECheckoutComponent},
            {path: 'orders-list', component: EOrdersListComponent},
            {path: 'order-details', component: EOrderDetailsComponent},
            {path: 'customers-list', component: ECustomersListComponent},
            {path: 'sellers', component: ESellersComponent},
            {path: 'seller-details', component: ESellerDetailsComponent},
        ],
        canActivate : [authGuard]
    },
    {path: 'notifications', component: NotificationsPageComponent},
    {
        path: 'icons',
        component: IconsComponent,
        children: [
            {path: '', component: MaterialSymbolsComponent},
            {path: 'feathericons', component: FeathericonsComponent},
            {path: 'remixicon', component: RemixiconComponent},
        ]
    },   
    {path: 'starter', component: StarterComponent},
    {
        path: 'users',
        component: UsersPageComponent,
        children: [
            {path: '', component: TeamMembersComponent},
            {path: 'users-list', component: UsersListComponent},
            {path: 'add-user', component: AddUserComponent},
        ]
    },
    {
        path: 'profile',
        component: ProfilePageComponent,
        children: [
            {path: '', component: PUserProfileComponent},
            {path: 'teams', component: PTeamsComponent},
            {path: 'projects', component: PProjectsComponent},
        ]
    },
    {path: 'my-profile', component: MyProfileComponent},
    {
        path: 'settings',
        component: SettingsComponent,
        children: [
            {path: '', component: AccountSettingsComponent},
            {path: 'change-password', component: ChangePasswordComponent},
            {path: 'connections', component: ConnectionsComponent},
            {path: 'privacy-policy', component: PrivacyPolicyComponent},
            {path: 'terms-conditions', component: TermsConditionsComponent}
        ]
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'lock-screen', component: LockScreenComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'logout', component: LogoutComponent}
        ]
    },
    // Here add new pages component
    {path: 'starter', component: StarterComponent},
    {
        path: 'neighborhoods',
        component: NeighborhoodsPageComponent,
        children: [
            {path: '', component: NeighborhoodListComponent },
            {path: 'neighborhood-list', component: NeighborhoodListComponent},
            {path: 'add-neighborhood', component: AddNeighborhoodComponent},
            {path: 'update-neighborhood/:id', component: UpdateNeighborhoodComponent},
        ],
        canActivate : [authGuard]
    },
    {path: 'starter', component: StarterComponent},
    {
        path: 'neighbors',
        component: NeighborsPageComponent,
        children: [
            {path: '', component: NeighborListComponent },
            {path: 'neighbor-list', component: NeighborListComponent},
            {path: 'add-neighbor', component: AddNeighborComponent},
            {path: 'update-neighbor/:id', component: UpdateNeighborComponent},
        ],
        canActivate : [authGuard]
    },
    {path: 'starter', component: StarterComponent},
    {
        path: 'invitations',
        component: InvitationsPageComponent,
        children: [
            {path: '', component: ShareInvitationComponent },
            {path: 'share-invitation', component: ShareInvitationComponent},
            {path: 'add-invitations', component: AddInvitationsComponent},
            {path: 'invitations-list', component: InvitationsListComponent},
            {path: 'event-invitation', component: EventInvitationComponent}
        ],
        canActivate : [authGuard]
    },
    {
        path: 'invitation',
        component: InvitationsPageComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'detail/:token', component: InvitationDetailComponent},
        ]
    },
    {
        path: 'eventinvitation',
        component: InvitationsPageComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'detail/:token', component: EventInvitationDetailComponent},
        ]
    },

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];