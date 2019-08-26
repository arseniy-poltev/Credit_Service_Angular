import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { Page3Component } from './pages/page3/page3.component';
import { Page4Component } from './pages/page4/page4.component';
import { Page5Component } from './pages/page5/page5.component';
import { Page6Component } from './pages/page6/page6.component';
import { Page7Component } from './pages/page7/page7.component';
import { Page8Component } from './pages/page8/page8.component';
import { Page9Component } from './pages/page9/page9.component';
import { Page6Resolve, Page7Resolve, VehicleYearResolve, VehicleBrandResolve, BankAccountIntervalResolve, BankAccountTypeResolve, BankResolve, MaritalStatuseResolve, ScholarityResolve, LoanReasonResolve, IssuinBodyResolve, StateResolve } from './resolves/resolves';
import { ErrorComponent } from './pages/error/error.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  
  { path: '', redirectTo: '/page1', pathMatch: 'full' },
  { path: 'page1', component: Page1Component },
  { path: 'page2', component: Page2Component, resolve: { marital: MaritalStatuseResolve, degree: ScholarityResolve, bank:BankResolve} },
  { path: 'page3', component: Page3Component, resolve: { init: LoanReasonResolve } },
  { path: 'response', component: Page5Component },
  { path: 'page4', component: Page6Component, resolve: { init: Page6Resolve, issuingBody: IssuinBodyResolve, states: StateResolve} },
  { path: 'page5', component: Page7Component, resolve: { init: Page7Resolve } },
  { path: 'page6', component: Page8Component, resolve: { year: VehicleYearResolve, brand: VehicleBrandResolve } },
  {
    path: 'page7', component: Page9Component, resolve:
    {
      interval: BankAccountIntervalResolve,
      type: BankAccountTypeResolve,
      bank: BankResolve
    }
  },
  {path:'error',component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
