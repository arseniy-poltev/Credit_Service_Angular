import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { DisableControlDirective } from './directives/disable-control.directive';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { Page3Component } from './pages/page3/page3.component';
import { Page4Component } from './pages/page4/page4.component';
import { Page5Component } from './pages/page5/page5.component';
import { Page6Component } from './pages/page6/page6.component';
import { Page7Component } from './pages/page7/page7.component';
import { Page8Component } from './pages/page8/page8.component';
import { Page9Component } from './pages/page9/page9.component';
import { DateMaskDirective } from './directives/date-mask.directive';
import { HttpClientModule } from '@angular/common/http';
import { APICallService } from './services/apicall.service';
import { DataManagementService } from './services/data-management.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CurrencyMaskModule } from "ngx-currency-mask";
import { enableProdMode } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LimitNumberDirective } from './directives/limitnumber.directive';
import { Page6Resolve, Page7Resolve, VehicleBrandResolve, VehicleYearResolve, BankAccountIntervalResolve, BankAccountTypeResolve, BankResolve, MaritalStatuseResolve, ScholarityResolve, LoanReasonResolve, IssuinBodyResolve, StateResolve } from './resolves/resolves';
import { ErrorComponent } from './pages/error/error.component';
import { ToastrModule } from 'ngx-toastr';
import { TranslationPipePipe } from './pipes/translation-pipe.pipe';
import { NgBrazil } from 'ng-brazil';

enableProdMode();

export function init_app(apiCallService: APICallService) {
  //return () => apiCallService.loadInitialData();
  return () => apiCallService.initializeApp();
}


@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component,
    Page3Component,
    Page4Component,
    DisableControlDirective,
    Page5Component,
    Page6Component,
    Page7Component,
    Page8Component,
    Page9Component,
    DateMaskDirective,
    LimitNumberDirective,
    ErrorComponent,
    TranslationPipePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CurrencyMaskModule,
    NgBrazil,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      // positionClass: 'toast-top-left',
      //preventDuplicates: true,
    })
  ],
  providers: [
    APICallService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [APICallService], multi: true },
    DataManagementService,
    Page6Resolve,
    Page7Resolve,
    VehicleYearResolve,
    VehicleBrandResolve,
    BankAccountIntervalResolve,
    BankAccountTypeResolve,
    BankResolve,
    MaritalStatuseResolve,
    ScholarityResolve,
    CookieService,
    LoanReasonResolve,
    IssuinBodyResolve,
    StateResolve
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
