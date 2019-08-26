import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MyErrorStateMatcher, ComboBoxValidator, CustomValidator, UserNameValidator } from '../../validators/validators';
import { APICallService, Response, RESPONSE_SUCCESS, QuoteRequest, ApiError, APICallError } from '../../services/apicall.service';
import { DataManagementService, Page7Data, PAGE7_PREFIX } from '../../services/data-management.service';
import { ToastrService } from 'ngx-toastr';
import { Page7Resolve } from 'src/app/resolves/resolves';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-page7',
  templateUrl: './page7.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page7Component implements OnInit {

  submitted = false
  company = ''
  admissionDate = ''
  commercialPhone = ''
  proofIncome = -1
  isSubmitting = false;
  proofIncomeArr = [];
  otherProofIncome = -1
  otherProofIncomeArr = []

  form7Group = new FormGroup({
    companyCtl: new FormControl('', [
      Validators.required
    ]),
    proofIncomeCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    admissionDateCtl: new FormControl('', [
      Validators.required,
      Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    ]),
    commercialPhoneCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(11),
      ])
    ])
  });
  get companyCtl() { return this.form7Group.get('companyCtl'); }
  get proofIncomeCtl() { return this.form7Group.get('proofIncomeCtl'); }
  get admissionDateCtl() { return this.form7Group.get('admissionDateCtl'); }
  get commercialPhoneCtl() { return this.form7Group.get('commercialPhoneCtl'); }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private _dataManagement: DataManagementService,
    private _APICallService: APICallService) {
  }

  ngOnInit() {
    this.proofIncomeArr = this.route.snapshot.data.init;
    for (var i in this.proofIncomeArr) {
      if (Number(i) < 2)
        continue;
      this.otherProofIncomeArr.push({ name: this.proofIncomeArr[i], value: Number(i) });
    }
    // var quoteRequest = this._APICallService.quoteRequest;
    // if (quoteRequest.quoteRequestId != null && quoteRequest.person != null && quoteRequest.person.employment != null) {
    //   this.admissionDate = this._APICallService.transformDate(quoteRequest.person.employment.admissionDate,true);
    //   this.company = quoteRequest.person.employment.companyName;
    // }

    //get data from local
    var data = this._dataManagement.get(PAGE7_PREFIX) as Page7Data;
    if (data != null && data != undefined) {
      this.company = data.companyName;
      this.admissionDate = data.admissionDate;
      this.proofIncome = data.prootIncome;
      this.commercialPhone = data.phoneNumber;
    }
  }
  onGoBack() {
    this.router.navigateByUrl('page4');
  }
  onSubmit() {
    this.submitted = true;
    if (this.form7Group.valid) {
      this.isSubmitting = true;
      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      quoteRequest.person.employment.admissionDate = this._APICallService.transformDate(this.admissionDate, false);
      quoteRequest.person.employment.companyName = this.company;
      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to local storage****************
      var data = new Page7Data;
      data.companyName = this.company;
      data.admissionDate = this.admissionDate;
      data.prootIncome = this.proofIncome;
      data.phoneNumber = this.commercialPhone;
      this._dataManagement.save(PAGE7_PREFIX, JSON.stringify(data));
      //*************************************************************/
      this._APICallService.submitSimulationsData().subscribe(
        response => {
          this._APICallService.quoteRequest = response as QuoteRequest;
          console.log(response);
          this.toastr.clear();
          this.toastr.success("Sucesso", "Etapa completada com sucesso", {
            timeOut: 1000
          });
          this.router.navigateByUrl('page6');
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

}
