import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ComboBoxValidator, CustomValidator, CPFValidator } from '../../validators/validators';
import { APICallService, Response, RESPONSE_SUCCESS, ComboData, Profession, QuoteRequest, ApiError, Employment, APICallError, BankAccount } from '../../services/apicall.service';
import { DataManagementService, Page2Data, PAGE2_PREFIX } from '../../services/data-management.service';
import { maybeQueueResolutionOfComponentResources } from '@angular/core/src/metadata/resource_loading';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './page2.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page2Component implements OnInit {

  userName = ''
  CPF = ''
  dateOfBirth = ''
  income: number = 0
  sex = -1 // 1:male 0:femal
  maritalStatus = -1 // 0:married 1:not married 2:separate
  doCheck = -1 //0:yes 1:no
  hasRestrictions = -1 //0:yes 1:no
  ownProperty = -1
  ownCar = -1
  occupation = 0


  bankAccSta = 0
  organ = 0
  linkOrgan = 0
  submitted = false
  otherMaritalStatus = -1
  isSubmitting = false;
  sexArr = ["F", "M"]
  maritalStatusArr = []
  benefitNum = '';
  otherMaritalStatusArr = []
  occupationArr = [{ name: "Selecione", value: 0 }]
  bankArr = [];
  bank = '';

  // professionArr = [[{ name: "Selecione", value: 0 }], [{ name: "Selecione", value: 0 }, { name: "Assalariado---1", value: 1 }, { name: "Assalariado---2", value: 2 }, { name: "Assalariado---3", value: 3 }, { name: "Assalariado---4", value: 4 }],
  // [{ name: "Selecione", value: 0 }, { name: "Funcionário público---1", value: 1 }, { name: "Funcionário público---2", value: 2 }, { name: "Funcionário público---3", value: 3 }, { name: "Funcionário público---4", value: 4 }],
  // [{ name: "Selecione", value: 0 }, { name: "Aposentado ou pensionista---1", value: 1 }, { name: "Aposentado ou pensionista---2", value: 2 }, { name: "Aposentado ou pensionista---3", value: 3 }, { name: "Aposentado ou pensionista---4", value: 4 }],
  // [{ name: "Selecione", value: 0 }, { name: "Autônomo---1", value: 1 }, { name: "Autônomo---2", value: 2 }, { name: "Autônomo---3", value: 3 }, { name: "Autônomo---4", value: 4 }],
  // [{ name: "Selecione", value: 0 }, { name: "Profissional liberal---1", value: 1 }, { name: "Profissional liberal---2", value: 2 }, { name: "Profissional liberal---3", value: 3 }, { name: "Profissional liberal---4", value: 4 }],
  // [{ name: "Selecione", value: 0 }, { name: "Empresário---1", value: 1 }, { name: "Empresário---2", value: 2 }, { name: "Empresário---3", value: 3 }, { name: "Empresário---4", value: 4 }],
  // [{ name: " Estudante ", value: 0 }]]
  degreeArr = []
  degree = ''
  emptyProf = new Profession(-1, null, "Selecione")
  professionArr = [this.emptyProf]
  profession = this.emptyProf
  tempProfession = this.emptyProf

  bankAccStaArr = [{ name: "Selecione", value: 0 },
  { name: "Não possuo conta em banco", value: 1 },
  { name: "Banco do Brasil", value: 2 },
  { name: "Bradesco", value: 3 },
  { name: "Caixa Econômica Federal", value: 4 },
  { name: "CitiBank", value: 5 },
  { name: "HSBC", value: 6 },
  { name: "Itaú Unibanco", value: 7 },
  { name: "Safra", value: 8 },
  { name: "Santander", value: 9 },
  { name: "Outros", value: 10 }]
  organArr = [{ name: "Selecione", value: 0 },
  { name: "Organ1", value: 1 },
  { name: "Organ2", value: 2 },
  { name: "Organ3", value: 3 },
  { name: "Organ4", value: 4 },
  { name: "Organ5", value: 5 },
  { name: "Organ6", value: 6 },
  { name: "Organ7", value: 7 },
  { name: "Organ8", value: 8 }]
  linkOrganArr = [{ name: "Selecione", value: 0 },
  { name: "LinkOrgan1", value: 1 },
  { name: "LinkOrgan2", value: 2 },
  { name: "LinkOrgan3", value: 3 },
  { name: "LinkOrgan4", value: 4 },
  { name: "LinkOrgan5", value: 5 },
  { name: "LinkOrgan6", value: 6 },
  { name: "LinkOrgan7", value: 7 },
  { name: "LinkOrgan8", value: 8 }]
  initFlag = false;
  form2Group = new FormGroup({
    CPFCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        CPFValidator.cpfValidate
      ])
    ]),
    sexCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    maritalStatusCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    doCheckCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    hasRestrictionsCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    ownPropertyCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    ownCarCtl: new FormControl('', [
      Validators.compose([
        CustomValidator.requireCustom
      ])
    ]),
    dateOfBirthCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
      ])
    ]),
    incomeCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        Validators.maxLength(7)
      ])
    ]),
    occupationCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.requireCombo
      ])
    ]),
    professionCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.validator2
      ])
    ]),
    organCtl: new FormControl('', [
      //Validators.compose([
      // Validators.required,
      // ComboBoxValidator.requireCombo
      //])
    ]),
    linkOrganCtl: new FormControl('', [
      //Validators.compose([
      //Validators.required,
      // ComboBoxValidator.requireCombo
      //])
    ]),
    benefitNumCtl: new FormControl('', [
      Validators.compose([
        // this.organArr[this.organ].name == "SELF_EMPLOYED" ? Validators.required : null,
        Validators.minLength(10),
        Validators.maxLength(10),
      ])
    ]),
    degreeCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.validator
      ])
    ]),
    bankAccountCtl: new FormControl('', [
      Validators.compose([
        Validators.required,
        ComboBoxValidator.requireCombo
      ])
    ])
  });

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private _dataManagement: DataManagementService,
    private _APICallService: APICallService) {
    //***************get occupation from server************* */
    console.log("3");
    //if(_APICallService.quoteRequest.quoteRequestId == null){
    //  this.router.navigateByUrl("page1");
    //}
    //****************************************************** */

  }

  async ngOnInit() {
    this.maritalStatusArr = this.route.snapshot.data.marital;
    console.log(this.route.snapshot.data.bank);
    this.bankArr = ['Selecione'].concat(this.route.snapshot.data.bank);
    this.bank = 'Selecione';
    console.log(this.bankArr);


    this.initFlag = true;
    for (var i in this.maritalStatusArr) {
      if (Number(i) < 3)
        continue;
      this.otherMaritalStatusArr.push({ name: this.maritalStatusArr[i], value: Number(i) });
    }

    this.degreeArr = ['Selecione'].concat(this.route.snapshot.data.degree);
    this.degree = "Selecione";

    var result = await this._APICallService.getOccupations();

    for (var i in result) {
      this.occupationArr.push(new ComboData(result[i], Number(i) + 1));
    }

    var data = this._dataManagement.get(PAGE2_PREFIX) as Page2Data;
    if (data != null && data != undefined) {
      this.CPF = data.cpf;
      this.dateOfBirth = data.dateOfBirth;
      this.sex = data.sex;
      this.income = data.income;
      this.maritalStatus = data.maritalStatus;
      this.doCheck = data.doCheck;
      this.hasRestrictions = data.hasRestrictions;
      this.ownProperty = data.ownProperty;
      this.ownCar = data.ownCar;
      this.occupation = data.occupation;
      this.profession = data.profession;
      this.degree = data.degree;
      this.bank = data.bankAccount;
      this.tempProfession = data.profession;
    }

  }

  selectionChange(event) {
    if (this.occupation == 0)
      return;
    this.professionArr = [this.emptyProf];
    this.profession = this.emptyProf;

    this._APICallService.getProfessions(this.occupationArr[this.occupation].name).subscribe(
      data => {
        this.professionArr = this.professionArr.concat(data as Array<Profession>);
        if (this.initFlag) {
          //this.city = this.tempCity;
          this.profession = this.tempProfession;
          this.tempProfession = this.emptyProf;
          this.initFlag = false;
        }
      },
      error => {
        var errorMsg: ApiError = error.error;
        console.log(errorMsg);
      }
    );

  }
  compareProf(a, b) {
    return a.id == b.id;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.profession);
    if (this.form2Group.valid && this.profession.id != -1) {
      this.isSubmitting = true;
      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      if(quoteRequest.bankAccount == null)
        quoteRequest.bankAccount = new BankAccount;
      quoteRequest.bankAccount.bank = this.bank;
      quoteRequest.bankAccount.account = "00000";
      quoteRequest.bankAccount.accountDigit = "0";
      quoteRequest.bankAccount.branch = "0000";
      quoteRequest.bankAccount.bankAccountType="CURRENT_ACCOUNT";
      quoteRequest.bankAccount.bankAccountSince="LESS_THAN_SIX_MONTHS";
      quoteRequest.annotated = this.hasRestrictions == 0;
      quoteRequest.person.cpf = this.CPF;
      quoteRequest.person.birthDate = this._APICallService.transformDate(this.dateOfBirth, false);
      quoteRequest.person.gender = this.sexArr[this.sex];
      quoteRequest.person.maritalStatus = this.maritalStatusArr[this.maritalStatus];
      if (quoteRequest.person.employment == null)
        quoteRequest.person.employment = new Employment;
      quoteRequest.person.employment.income = this.income;
      quoteRequest.person.employment.professionId = this.profession.id;
      quoteRequest.person.scholarity = this.degree;
      if (this.ownCar == 1) {
        quoteRequest.vehicle = null;
        quoteRequest.useVehicleAsCollateral = false;
      }
      if (this.ownProperty == 1) {
        quoteRequest.realEstate = null;
        quoteRequest.useRealEstateAsCollateral = false;
      }
      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to local storage***************
      var data: Page2Data = new Page2Data;
      data.cpf = this.CPF;

      data.dateOfBirth = this.dateOfBirth;
      data.sex = this.sex;
      data.income = this.income;
      data.maritalStatus = this.maritalStatus;
      data.doCheck = this.doCheck;
      data.hasRestrictions = this.hasRestrictions;
      data.ownProperty = this.ownProperty;
      data.ownCar = this.ownCar;
      data.occupation = this.occupation;
      data.profession = this.profession;
      data.degree = this.degree;
      data.bankAccount = this.bank;

      this._dataManagement.save(PAGE2_PREFIX, JSON.stringify(data));
      //*************************************************************/

      this._APICallService.submitSimulationsData().subscribe(
        response => {
          this._APICallService.quoteRequest = response as QuoteRequest;
          console.log(response);
          this.toastr.clear();
          this.toastr.success("Sucesso", "Etapa completada com sucesso", {
            timeOut: 1000
          });
          this.router.navigateByUrl('page3');
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
    this.router.navigateByUrl('page1');

  }
}
