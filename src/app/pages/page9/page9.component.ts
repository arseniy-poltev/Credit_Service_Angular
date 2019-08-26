import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MyErrorStateMatcher, ComboBoxValidator, CustomValidator, UserNameValidator } from '../../validators/validators';
import { APICallService, Response, RESPONSE_SUCCESS, QuoteRequest, ApiError, BankAccount, APICallError, QuoteResponse } from '../../services/apicall.service';
import { DataManagementService, Page9Data,Page2Data,PAGE2_PREFIX, PAGE9_PREFIX } from '../../services/data-management.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-page9',
  templateUrl: './page9.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page9Component implements OnInit{

  submitted = false
  bank = ''
  accountType = -1
  agency = ''
  account = ''
  digit = ''
  howLong = -1
  isSubmitting = false;
  bankArr = []
  howLongArr = []
  accountTypeArr = []
  sliceTypeArr: Array<Array<string>> = []
  bankDescription = ["Banco do Brasil", "Bradesco", "Caixa Econômica Federal", "Itau", "Santander", "Não tenho conta", "Outros"];

  form9Group = new FormGroup({
    bankCtl: new FormControl('', [
      Validators.compose([
        ComboBoxValidator.requireCombo
      ])
    ]),
    accountTypeCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    agencyCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ])
    ]),
    accountCtl: new FormControl('', [
      Validators.compose([
        Validators.required
      ])
    ]),
    digitCtl: new FormControl('', [
      Validators.compose([
        Validators.required
      ])
    ]),
    howLongCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
  });
  get bankCtl() { return this.form9Group.get('bankCtl'); }
  get accountTypeCtl() { return this.form9Group.get('accountTypeCtl'); }
  get agencyCtl() { return this.form9Group.get('agencyCtl'); }
  get accountCtl() { return this.form9Group.get('accountCtl'); }
  get digitCtl() { return this.form9Group.get('digitCtl'); }
  get howLongCtl() { return this.form9Group.get('howLongCtl'); }


  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private _dataManagement: DataManagementService,
    private _APICallService: APICallService) {
  }

  ngOnInit() {
    this.howLongArr = this.route.snapshot.data.interval;
    this.accountTypeArr = this.route.snapshot.data.type;
    this.bankArr = ['Selecione'].concat(this.route.snapshot.data.bank);
    this.bank = 'Selecione';
    console.log(this.bankArr);

    for (var i in this.accountTypeArr) {
      var k = Number(i);
      if (k % 2 == 0) {
        this.sliceTypeArr.push([]);
      }
      this.sliceTypeArr[Math.floor(k / 2)].push(this.accountTypeArr[i]);
    }
    console.log(this.sliceTypeArr);
    //get data from local
    var data = this._dataManagement.get(PAGE9_PREFIX) as Page9Data;
    var data2 = this._dataManagement.get(PAGE2_PREFIX) as Page2Data;
    if (data != null && data != undefined) {
      
      this.account = data.account;
      this.digit = data.accountDigit;
      this.accountType = data.bankAccountType;
      this.howLong = data.bankAccountSince;
      this.agency = data.branch;
    }
    if(data2 != null && data2 != undefined){
	this.bank = data2.bankAccount;
    }

    // var quoteRequest = this._APICallService.quoteRequest;
    // if (quoteRequest.quoteRequestId != null && quoteRequest.bankAccount != null) {
    //   this.digit = quoteRequest.bankAccount.accountDigit;
    //   this.bank = quoteRequest.bankAccount.bank;
    //   this.account = quoteRequest.bankAccount.account;
    //   this.accountType = this.accountTypeArr.indexOf(quoteRequest.bankAccount.bankAccountType);
    //   this.howLong = this.howLongArr.indexOf(quoteRequest.bankAccount.bankAccountSince);
    //   this.agency = quoteRequest.bankAccount.branch;
    // }
  }
  onGoBack() {
    var page2Data = this._dataManagement.get(PAGE2_PREFIX) as Page2Data;
    if (page2Data != null && page2Data != undefined) {
      var youOwnCar = page2Data.ownCar == 0;
      var youOwnProperty = page2Data.ownProperty == 0;
      if (!youOwnCar && !youOwnProperty) {
          this.router.navigateByUrl('page5');
          return;
      }
    }
    
    this.router.navigateByUrl('page6');
  }
  onSubmit() {
    this.submitted = true;
    if (this.form9Group.valid) {
      this.isSubmitting = true;
      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      if (quoteRequest.bankAccount == null)
        quoteRequest.bankAccount = new BankAccount;
      quoteRequest.annotated = true;
      quoteRequest.bankAccount.account = this.account;
      quoteRequest.bankAccount.accountDigit = this.digit;
      quoteRequest.bankAccount.bank = this.bank;
      quoteRequest.bankAccount.bankAccountType = this.accountTypeArr[this.accountType];
      quoteRequest.bankAccount.bankAccountSince = this.howLongArr[this.howLong];
      quoteRequest.bankAccount.branch = this.agency;
      console.log(quoteRequest);
      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to local storage****************
      var data = new Page9Data;
      data.bank = this.bank;
      data.account = this.account;
      data.accountDigit = this.digit;
      data.bankAccountType = this.accountType;
      data.bankAccountSince = this.howLong;
      data.branch = this.agency;
      var data2 = this._dataManagement.get(PAGE2_PREFIX) as Page2Data;
      data2.bankAccount = this.bank;
      this._dataManagement.save(PAGE9_PREFIX, JSON.stringify(data));
      this._dataManagement.save(PAGE2_PREFIX, JSON.stringify(data2));
      //*************************************************************/
      this._APICallService.submitSimulations().subscribe(
        response => {
          // this._APICallService.quoteRequest = response as QuoteRequest;
          this.toastr.clear();
          this.toastr.success("Sucesso", "Sua proposta está sendo processada agora ...", {
            timeOut: 1000
          });
          var res = response as QuoteResponse;
          console.log(res);
          this.cookieService.set("quoteResponseId",res.quoteResponseId.toString());
          this.router.navigateByUrl('response');
          //this.cookieService.delete("quoteId");
          //this._dataManagement.clear();

          //this.router.navigateByUrl('page9');
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
            if (error.error.body.hasOwnProperty("subErrors")) {
              var resError = error.error.body as ApiError;
              for(var i in resError.subErrors){
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
