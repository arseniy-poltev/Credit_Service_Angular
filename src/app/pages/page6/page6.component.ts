import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MyErrorStateMatcher, ComboBoxValidator, CustomValidator, UserNameValidator } from '../../validators/validators';
import { APICallService, ApiError, Address, City, QuoteRequest, PersonalID, APICallError } from '../../services/apicall.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DataManagementService, Page6Data, PAGE6_PREFIX } from 'src/app/services/data-management.service';
import { Page6Resolve } from 'src/app/resolves/resolves';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-page6',
  templateUrl: './page6.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page6Component implements OnInit, OnDestroy {
  email = ''
  nationality = -1
  countryBirth = ''
  identityNum = ''
  issueDate = ''
  validateDate = ''
  issuingBody = ''
  issuingUF = ''
  submitted = false
  motherName = ''
  residence = -1
  addrSince = ''
  submitSuccess = false
  isSubmitting = false;
  residenceArr: Array<string> = []
  public ustomPatterns = { '0': { pattern: new RegExp('\[a-zA-Z\]') } };
  datePattern = { '0': { pattern: new RegExp('^\d{1,2}\/\d{1,2}\/\d{4}$') } };
  pattern = new RegExp('^\d{1,2}\/\d{1,2}\/\d{4}$');
  identity = 'Selecione'
  identityArr: Array<string> = ['Selecione']
  otherResidenceArr = []
  issuingBodyArr = []
  stateArr: Array<string> = ['Selecione']
  state: 'Selecione'
  emptyCity: City = new City(false, 'Selecione', -1, '')
  cityArr: Array<City> = [this.emptyCity]
  city: City = this.emptyCity
  tempCity: City = this.emptyCity;
  initFlag: boolean = true;
  matcher = new MyErrorStateMatcher();

  form6Group = new FormGroup({
    emailCtl: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    nationalityCtl: new FormControl('', [
      // Validators.compose([
      //   //CustomValidator.requireCustom
      // ])
    ]),
    countryBirthCtl: new FormControl('', [
      // Validators.required
    ]),
    identityCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.validator
      ])
    ]),
    issudeDateCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
      ])
    ]),
    identityNumCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        //Validators.pattern(/^\d$/)
      ])

    ]),
    issuingBodyCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.validator
      ])
    ]),
    issuingUFCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.validator
      ])
    ]),
    motherNameCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        UserNameValidator.validMotherName
      ])
    ]),
    addrSinceCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
      ])
    ]),
    residenceCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    stateCtl: new FormControl('', [
      Validators.compose([
        ComboBoxValidator.validator
      ])
    ]),
    cityCtl: new FormControl('', [
      Validators.compose([
        ComboBoxValidator.validator1
      ])
    ]),
    validateDateCtl: new FormControl('', [
      Validators.compose([
        // Validators.required,
        Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
      ])
    ])
  });
  get emailCtl() { return this.form6Group.get('emailCtl'); }
  get countryBirthCtl() { return this.form6Group.get('countryBirthCtl'); }
  get identityCtl() { return this.form6Group.get('identityCtl'); }
  get identityNumCtl() { return this.form6Group.get('identityNumCtl'); }
  get issudeDateCtl() { return this.form6Group.get('issudeDateCtl'); }
  get issuingBodyCtl() { return this.form6Group.get('issuingBodyCtl'); }
  get issuingUFCtl() { return this.form6Group.get('issuingUFCtl'); }
  get motherNameCtl() { return this.form6Group.get('motherNameCtl'); }
  get addrSinceCtl() { return this.form6Group.get('addrSinceCtl'); }
  get stateCtl() { return this.form6Group.get('stateCtl'); }
  get cityCtl() { return this.form6Group.get('cityCtl'); }
  get validateDateCtl() { return this.form6Group.get('validateDateCtl'); }


  constructor(private router: Router,
    private _APICallService: APICallService,
    private location: Location,
    private toastr: ToastrService,
    private _dataManagement: DataManagementService,
    private route: ActivatedRoute) {
  }

  async ngOnInit() {
    //get residence from server
    this.initFlag = true;
    this.residenceArr = this.route.snapshot.data.init;
    console.log(this.route.snapshot.data.issuingBody);
    console.log("issuing");
    this.issuingBodyArr = ['Selecione'].concat(this.route.snapshot.data.issuingBody);
    this.issuingBody = 'Selecione';
    this.stateArr = ['Selecione'].concat(this.route.snapshot.data.states);
    this.issuingUF = "Selecione";
    this.state = "Selecione";
    // this.identityArr = ['Selecione'].concat(this.route.snapshot.data.ids);
    for (var i in this.residenceArr) {
      if (Number(i) < 2)
        continue;
      this.otherResidenceArr.push({ name: this.residenceArr[i], value: Number(i) });
    }
    this.identityArr = ['Selecione'];
    this._APICallService.getIdTypes().subscribe(
      data => {
        console.log(data);
        this.identityArr = this.identityArr.concat(data as Array<string>);
      },
      error => {
        var errorMsg: ApiError = error.error;
        console.log(errorMsg);
      }
    );

    var data = this._dataManagement.get(PAGE6_PREFIX);
    if (data != null && data != undefined) {
      this.email = data.email;
      this.nationality = data.nationality;
      this.motherName = data.motherName;
      this.residence = data.residence;
      this.addrSince = data.addrSince;
      this.identity = data.identity;
      this.issueDate = data.issudeDate;
      this.validateDate = data.validateDate;
      this.identityNum = data.identityNum;
      this.issuingBody = data.organ;
      this.issuingUF = data.uf;
      this.state = data.state;
      this.city = data.city;
      this.tempCity = data.city;
    }
  }
  ngOnDestroy() {
    if (!this.submitSuccess)
      this.router.navigateByUrl('page3');
  }

  nationalityChanged() {
    //get states from server
    if (this.nationality != 0)
      return;
  }

  stateChanged() {
    //get cities from server
    this.cityArr = [this.emptyCity];
    this.city = this.emptyCity;
    if (this.nationality != 0 || this.state === "Selecione")
      return;
    this._APICallService.getCities(this.state).subscribe(
      data => {
        console.log(this.tempCity);
        this.cityArr = this.cityArr.concat(data as Array<City>);
        if (this.initFlag) {
          this.city = this.tempCity;
          this.initFlag = false;
        }
      },
      error => {
        var errorMsg: ApiError = error.error;
        console.log(errorMsg);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.city);
    if (this.form6Group.valid && this.city !== this.emptyCity) {
      this.submitSuccess = true;
      this.isSubmitting = true;
      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      quoteRequest.person.address.residenceType = this.residenceArr[this.residence];
      quoteRequest.person.addressSince = this._APICallService.transformDate(this.addrSince, false);
      quoteRequest.person.cityIdBorn = this.city.id;
      quoteRequest.person.motherName = this.motherName;
      quoteRequest.person.nationality = this.nationality == 0 ? "BRAZILIAN" : "FOREIGNER";

      var personalID = new PersonalID;
      personalID.emissionDate = this._APICallService.transformDate(this.issueDate, false);
      personalID.expirationDate = this._APICallService.transformDate(this.validateDate, false);
      personalID.personalIdType = this.identity;
      personalID.id = this.identityNum;
      //personalID.issuingBody = 'CARTORI';
      personalID.issuingBody = this.issuingBody;

      quoteRequest.person.personalIds = [];
      quoteRequest.person.personalIds.push(personalID);

      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to local storage****************
      var data = new Page6Data;
      data.email = this.email;
      data.nationality = this.nationality;
      data.motherName = this.motherName;
      data.residence = this.residence;
      data.addrSince = this.addrSince;
      data.identity = this.identity;
      data.issudeDate = this.issueDate;
      data.validateDate = this.validateDate;
      data.identityNum = this.identityNum;
      data.organ = this.issuingBody;
      data.uf = this.issuingUF;
      data.state = this.state;
      data.city = this.city;
      this._dataManagement.save(PAGE6_PREFIX, JSON.stringify(data));
      //*************************************************************/
      this._APICallService.submitSimulationsData().subscribe(
        response => {
          this._APICallService.quoteRequest = response as QuoteRequest;
          console.log(response);
          this.toastr.clear();
          this.toastr.success("Sucesso", "Etapa completada com sucesso", {
            timeOut: 1000
          });
          this.router.navigateByUrl('page5');
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
  compareCity(a: City, b: City) {
    return a.id == b.id;
  }
  onGoBack() {
    this.router.navigateByUrl('page3');
  }
}
