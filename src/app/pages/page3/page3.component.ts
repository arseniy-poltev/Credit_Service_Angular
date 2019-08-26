import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { MyErrorStateMatcher, TermsValidator, AmPValidator, UserNameValidator, ComboBoxValidator, PhoneNumberValidator } from '../../validators/validators';
import { APICallService, Response, RESPONSE_SUCCESS, AddressData, ApiError, Address, QuoteRequest, ZipCodeResponse, APICallError } from '../../services/apicall.service';
import { DataManagementService, Page3Data, PAGE3_PREFIX } from '../../services/data-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './page3.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page3Component implements OnInit {

  zipCode = ''
  street = ''
  number = ''
  complement = ''
  neighborhood = ''
  city = ''
  state = ''
  cellPhone = ''
  otherPhone = ''
  submitted = false
  terms = false;
  whatsAppTerms = false;
  isSubmitting = false;
  loanReason = '';
  loanReasonArr = [];
  zipRes: ZipCodeResponse;
  form3Group = new FormGroup({
    zipCodeCtl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    streetCtl: new FormControl('', [
      Validators.required
    ]),
    numberCtl: new FormControl('', [
      Validators.required
    ]),
    complementCtl: new FormControl('', [
      //Validators.required
    ]),
    neighborhoodCtl: new FormControl('', [
      Validators.required
    ]),
    cityCtl: new FormControl('', [
      // Validators.required

    ]),
    stateCtl: new FormControl('', [
      // Validators.required
    ]),
    cellPhoneCtl: new FormControl('', [
      Validators.required,
      PhoneNumberValidator.validPhoneNumber
    ]),
    otherPhoneCtl: new FormControl('', [
      //Validators.required
      Validators.minLength(10),
      Validators.maxLength(11),
    ]),
    termsCtl: new FormControl('', [
      Validators.compose([
        TermsValidator.validTerms
      ])
    ]),
    whatsAppTermsCtl: new FormControl('', [
      //Validators.compose([
      // TermsValidator.validTerms
      //])
    ]),
    loanReasonCtl: new FormControl('', [
      Validators.compose([
        ComboBoxValidator.validator
      ])
    ]),
  });
  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _dataManagement: DataManagementService,
    private _APICallService: APICallService) {


  }

  ngOnInit() {
    this.loanReasonArr = ['Selecione'].concat(this.route.snapshot.data.init);
    this.loanReason = 'Selecione';
    console.log(this.loanReasonArr);
    var data = this._dataManagement.get(PAGE3_PREFIX) as Page3Data;
    if (data != null && data != undefined) {
      this.zipCode = data.zipCode;
      this.street = data.street;
      this.number = data.number;
      this.neighborhood = data.neighborhood;
      this.complement = data.complement;
      this.city = data.city;
      this.state = data.state;
      this.cellPhone = data.cellPhone;
      this.otherPhone = data.otherPhone;
      this.loanReason = data.loadReason;
    }
    // var quoteRequest = this._APICallService.quoteRequest;
    // if (quoteRequest.quoteRequestId != null && quoteRequest.person.address != null) {
    //   this.zipCode = quoteRequest.person.address.zipCode;
    //   this.number = quoteRequest.person.address.number;
    //   this.street = quoteRequest.person.address.address;
    //   this.complement = quoteRequest.person.address.complement;
    //   this.neighborhood = quoteRequest.person.address.neighborhood;
    //   this.loanReason = quoteRequest.loanReason;
    //   this.cellPhone = quoteRequest.person.mobilePhone;
    // }
  }

  get zipCodeCtl() { return this.form3Group.get('zipCodeCtl'); }
  get streetCtl() { return this.form3Group.get('streetCtl'); }
  get numberCtl() { return this.form3Group.get('numberCtl'); }
  get complementCtl() { return this.form3Group.get('complementCtl'); }
  get neighborhoodCtl() { return this.form3Group.get('neighborhoodCtl'); }
  get cityCtl() { return this.form3Group.get('cityCtl'); }
  get stateCtl() { return this.form3Group.get('stateCtl'); }
  get cellPhoneCtl() { return this.form3Group.get('cellPhoneCtl'); }
  get otherPhoneCtl() { return this.form3Group.get('otherPhoneCtl'); }
  get termsCtl() { return this.form3Group.get('termsCtl'); }
  get whatsAppTermsCtl() { return this.form3Group.get('whatsAppTermsCtl'); }
  get loanReasonCtl() { return this.form3Group.get('loanReasonCtl'); }
  CEPChanged() {
    if (this.zipCodeCtl.valid && this.zipCode.length == 8) {
      this._APICallService.getAddress(this.zipCode).subscribe(
        data => {
          console.log(data);
          this.zipRes = data as ZipCodeResponse;
          this.cityCtl.setValue(this.zipRes.city.cityName);
          this.neighborhoodCtl.setValue(this.zipRes.neighborhood);
          this.stateCtl.setValue(this.zipRes.city.state);
          this.streetCtl.setValue(this.zipRes.address);
        },
        error => {
          var errorMsg: ApiError = error.error;
          console.log(errorMsg);
        }
      )
    } else {
      this.neighborhoodCtl.setValue('');
      this.cityCtl.setValue('');
      this.streetCtl.setValue('');
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form3Group.valid && this.zipRes != undefined) {
      this.isSubmitting = true;
      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      if (quoteRequest.person.address == null)
        quoteRequest.person.address = new Address;
      quoteRequest.person.address.address = this.zipRes.address;
      quoteRequest.person.address.cityId = this.zipRes.city.id;
      quoteRequest.person.address.complement = this.complement;
      quoteRequest.person.address.neighborhood = this.neighborhood;
      quoteRequest.person.address.number = this.number;
      quoteRequest.person.address.zipCode = this.zipCode;
      quoteRequest.person.phone = this.otherPhone;
      quoteRequest.loanReason = this.loanReason;
      quoteRequest.person.mobilePhone = this.cellPhone;
      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to local storage****************
      var data: Page3Data = new Page3Data;
      data.zipCode = this.zipCode;
      data.street = this.street;
      data.number = this.number;
      data.complement = this.complement;
      data.neighborhood = this.neighborhood;
      data.city = this.city;
      data.state = this.state;
      data.cellPhone = this.cellPhone;
      data.otherPhone = this.otherPhone;
      data.loadReason = this.loanReason;
      this._dataManagement.save(PAGE3_PREFIX, JSON.stringify(data));
      //*************************************************************/

      this._APICallService.submitSimulationsData().subscribe(
        response => {
          this._APICallService.quoteRequest = response as QuoteRequest;
          console.log(response);
          this.toastr.clear();
          this.toastr.success("Sucesso", "Etapa completada com sucesso", {
            timeOut: 1000
          });
          this.router.navigateByUrl("page4");
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
      );
    }
  }
  onGoBack() {
    this.router.navigateByUrl('page2');
  }

}
