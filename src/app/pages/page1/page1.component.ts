import { Component, NgModule, Directive, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MyErrorStateMatcher, TermsValidator, AmPValidator, UserNameValidator } from '../../validators/validators';
import { APICallService, Response, RESPONSE_SUCCESS, QuoteRequest, ApiError, Person, APICallError } from '../../services/apicall.service';
import { DataManagementService, Page1Data, PAGE1_PREFIX } from '../../services/data-management.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './page1.component.html',
  styleUrls: ['../../app.component.css']
})

export class Page1Component {
  form1Group = new FormGroup({
    emailCtl: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    usernameCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        UserNameValidator.validUsername
      ])
    ]),
    amountCtl: new FormControl('', [
      // Validators.compose([
      //   Validators.required,
      //   Validators.min(100),
      //   Validators.pattern('[0-9]*')
      // ])
      Validators.compose([
        AmPValidator.validAmP
      ])

    ]),
    periodCtl: new FormControl('', [
      Validators.compose([
        AmPValidator.validAmP
      ])
    ]),
    termsCtl: new FormControl('', [
      Validators.compose([
        TermsValidator.validTerms
      ])
    ])
  });
  matcher = new MyErrorStateMatcher();

  amountOptions = [false, false, false, false, false];
  periodOptions = [false, false, false, false, false];
  amount = -1;
  period = 0;
  amountArry = [2000, 3000, 5000, 10000];
  periodOArry = [6, 12, 18, 24];
  periodArray = [];

  periodComboArr = [];
  amountComboArr = [];

  amountRequired = false;
  periodRequired = false;
  amountMinCase = false;
  terms = false;
  startUp = true;
  submitted = false;
  email = '';
  fullName = '';
  isSubmitting = false;

  constructor(private router: Router,
    private _APICallService: APICallService,
    private toastr: ToastrService,
    private dataManagement: DataManagementService,
    private cookieService: CookieService) {

    var i;
    for (i = 30; i <= 72; i += 6) {
      this.periodComboArr.push(i);
    }
    for (i = 15000; i <= 50000; i += 5000) {
      this.amountComboArr.push(i);
    }
    var data = this.dataManagement.get(PAGE1_PREFIX) as Page1Data;
    if (data !== undefined && data != null) {

      this.amount = data.loanAmount;
      this.period = data.loanLengthMonths;
      this.email = data.email;
      this.fullName = data.fullName;
      if (this.amountArry.indexOf(this.amount) != -1)
        this.amountOptions[this.amountArry.indexOf(this.amount)] = true;
      if (this.periodOArry.indexOf(this.period) != -1)
        this.periodOptions[this.periodOArry.indexOf(this.period)] = true;
    }

    // var quoteRequest = this._APICallService.quoteRequest;
    // if (quoteRequest.quoteRequestId != null) {
    //   this.amount = quoteRequest.loanAmount;
    //   this.period = quoteRequest.loanLengthMonths;
    //   if (quoteRequest.person != null) {
    //     this.email = quoteRequest.person.email;
    //     this.fullName = quoteRequest.person.fullName;
    //   }
    //   if (this.amountArry.indexOf(this.amount) != -1)
    //     this.amountOptions[this.amountArry.indexOf(this.amount)] = true;
    //   if (this.periodOArry.indexOf(this.period) != -1)
    //     this.periodOptions[this.periodOArry.indexOf(this.period)] = true;
    // }
  }



  selectPeriod(period) {
    this.period = period != 'otherValue' ? Number(period) : this.period;
    this.periodRequired = this.period == 0;
    for (var i = 0; i < 4; i++) {
      this.periodOptions[i] = false;
    }
    switch (period) {
      case '9':
        this.periodOptions[0] = true;
        break;
      case '12':
        this.periodOptions[1] = true;
        break;
      case '18':
        this.periodOptions[2] = true;
        break;
      case '24':
        this.periodOptions[3] = true;
        break;
      default:
        this.periodOptions[4] = !this.periodOptions[4];
        if (!this.periodOptions[4])
          this.period = 0;
        this.periodRequired = false;
        break;
    }
  }

  selectAmount(amount) {
    this.amount = amount != 'otherValue' ? Number(amount) : this.amount;
    this.amountRequired = this.amount == 0;
    for (var i = 0; i < 4; i++) {
      this.amountOptions[i] = false;
    }
    switch (amount) {
      case '2000':
        this.amountOptions[0] = true;
        break;
      case '3000':
        this.amountOptions[1] = true;
        break;
      case '5000':
        this.amountOptions[2] = true;
        break;
      case '10000':
        this.amountOptions[3] = true;
        break;
      default:
        this.amountOptions[4] = !this.amountOptions[4];
        if (!this.amountOptions[4])
          this.amount = -1;
        this.amountRequired = false;
        this.amountMinCase = this.amountOptions[4];
        break;
    }
  }

  submit() {
    this.submitted = true;
    this.periodRequired = this.period == 0;
    this.startUp = false;
    if (this.form1Group.valid) {
      this.isSubmitting = true;

      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      quoteRequest.loanAmount = this.amount;
      quoteRequest.loanLengthMonths = this.period;
      if (quoteRequest.person == null)
        quoteRequest.person = new Person();
      quoteRequest.person.fullName = this.fullName;
      quoteRequest.person.email = this.email;
      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to local storage****************
      var pageData: Page1Data = new Page1Data;
      pageData.loanAmount = this.amount;
      pageData.loanLengthMonths = this.period;
      pageData.fullName = this.fullName;
      pageData.email = this.email;
      this.dataManagement.save(PAGE1_PREFIX, JSON.stringify(pageData));
      //*************************************************************/

      this._APICallService.submitSimulationsData().subscribe(
        response => {
          this._APICallService.quoteRequest = response as QuoteRequest;
          console.log(response);
          this.cookieService.set('quoteId', this._APICallService.quoteRequest.quoteRequestId.toString());
          this.toastr.clear();
          this.toastr.success("Sucesso", "Etapa completada com sucesso", {
            timeOut: 1000
          });
          this.router.navigateByUrl('page2');
          this.isSubmitting = false;
        },
        error => {
          console.log(error);
          this.toastr.clear();
          this.isSubmitting = false;
          if (error instanceof HttpErrorResponse) {
            if (error.error == null && error.status == 403) {
              this.toastr.error("Acesso Negado", "403", {
                disableTimeOut: true,
                closeButton: true
              });
              return;
            }
            if (error.error.hasOwnProperty("subErrors")) {
              var resError = error.error as ApiError;
              for (var i in resError.subErrors) {
                this.toastr.error(resError.subErrors[i].message, resError.subErrors[i].field, {
                  disableTimeOut: true,
                  closeButton: true
                });
              }
            } else {
              console.log("other");
              var resError1 = error.error as APICallError;
              this.toastr.error(resError1.error, resError1.error, {
                disableTimeOut: true,
                closeButton: true
              });
            }
          } else {
            this.toastr.error("Estamos com problemas temporários. Pode voltar em 10 minutinhos?", "Error Code:" + error.status, {
              disableTimeOut: true,
              closeButton: true
            });
          }
        }

      )
    }
  }
}
