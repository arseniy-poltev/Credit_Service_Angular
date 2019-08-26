import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MyErrorStateMatcher, ComboBoxValidator, CustomValidator, UserNameValidator } from '../../validators/validators';
import { APICallService, Response, RESPONSE_SUCCESS, ComboData, VehicleBrand, Vehicle, ApiError, QuoteRequest, SubVehicle, RealEstate, APICallError } from '../../services/apicall.service';
import { DataManagementService, PAGE2_PREFIX, Page2Data, PAGE8_PREFIX, Page8Data } from '../../services/data-management.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-page8',
  templateUrl: './page8.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page8Component implements OnInit {
  submitted = false
  propertyValue = ''
  isFinanced = -1
  isPropertyOkay = -1
  isVehicleFunded = -1
  isSubmitting = false;
  yearOfVehicleArr = []
  yearOfVehicle = ''
  initFlag = true;
  isLoading = false;
  emptyVehicle: Vehicle = new Vehicle(-1, '', 'Selecione', '', '', '');
  modelOfVehicleArr = [this.emptyVehicle]
  modelOfVehicle = this.emptyVehicle
  emptyBrand: VehicleBrand = new VehicleBrand('Selecione', -1);
  brandOfVehicleArr = [this.emptyBrand];
  brandOfVehicle = this.emptyBrand;

  youOwnCar: boolean = false;
  youOwnProperty: boolean = false;

  useVehicle = -1;
  useRealEstate = -1;

  tempVehicle = this.emptyVehicle;

  controls = [
    new FormControl('', Validators.required),
    new FormControl('', CustomValidator.requireCustom),
    new FormControl('', CustomValidator.requireCustom),
    new FormControl('', CustomValidator.requireCustom),

    new FormControl('', ComboBoxValidator.validator),
    new FormControl('', ComboBoxValidator.validator),
    new FormControl('', ComboBoxValidator.validator),
    new FormControl('', CustomValidator.requireCustom),
  ];
  firstGroup = new FormGroup({
    propertyValueCtl: new FormControl('', Validators.required),
    isFinancedCtl: new FormControl('', CustomValidator.requireCustom),
    isPropertyOkayCtl: new FormControl('', CustomValidator.requireCustom),
    useRealEstateCtl: new FormControl('', CustomValidator.requireCustom),
  });
  secondGroup = new FormGroup({
    yearOfVehicleCtl: new FormControl('', ComboBoxValidator.validator),
    brandOfVehicleCtl: new FormControl('', ComboBoxValidator.validator2),
    modelOfVehicleCtl: new FormControl('', ComboBoxValidator.validator2),
    isVehicleFundedCtl: new FormControl('', CustomValidator.requireCustom),
    useVehicleCtl: new FormControl('', CustomValidator.requireCustom),
  });

  form8Group: FormGroup;

  get propertyValueCtl() { return this.firstGroup.get('propertyValueCtl'); }
  get isFinancedCtl() { return this.firstGroup.get('isFinancedCtl'); }
  get isPropertyOkayCtl() { return this.firstGroup.get('isPropertyOkayCtl'); }
  get yearOfVehicleCtl() { return this.secondGroup.get('yearOfVehicleCtl'); }
  get brandOfVehicleCtl() { return this.secondGroup.get('brandOfVehicleCtl'); }
  get modelOfVehicleCtl() { return this.secondGroup.get('modelOfVehicleCtl'); }
  get isVehicleFundedCtl() { return this.secondGroup.get('isVehicleFundedCtl'); }
  get useRealEstateCtl() { return this.firstGroup.get('useRealEstateCtl'); }
  get useVehicleCtl() { return this.secondGroup.get('useVehicleCtl'); }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private _dataManagement: DataManagementService,
    private _APICallService: APICallService) {
    var page2Data = this._dataManagement.get(PAGE2_PREFIX) as Page2Data;
    if (page2Data != null && page2Data != undefined) {
      this.youOwnCar = page2Data.ownCar == 0;
      this.youOwnProperty = page2Data.ownProperty == 0;
    }
    if (!this.youOwnCar && !this.youOwnProperty) {
      this.router.navigateByUrl('page7');
      return;
    }
  }

  ngOnInit() {



    if (this.youOwnProperty && !this.youOwnCar) {
      this.form8Group = this.firstGroup;
    } else if (this.youOwnCar && !this.youOwnProperty) {
      this.form8Group = this.secondGroup;
    } else {
      this.form8Group = new FormGroup({
        ...this.firstGroup.controls,
        ...this.secondGroup.controls
      })
    }

    this.initFlag = true;
    this.yearOfVehicleArr = ['Selecione'].concat(this.route.snapshot.data.year);
    this.yearOfVehicle = "Selecione";

    this.brandOfVehicleArr = [this.emptyBrand].concat(this.route.snapshot.data.brand);
    this.brandOfVehicle = this.emptyBrand;
    console.log(this.brandOfVehicleArr);

    //get data from local
    var data = this._dataManagement.get(PAGE8_PREFIX) as Page8Data;
    if (data != null && data != undefined) {
      this.propertyValue = data.value;
      this.isFinanced = data.isRealEstateFinanced;
      this.isPropertyOkay = data.isRealEstateDocumented;
      this.isVehicleFunded = data.isVehicleFinanced;
      this.yearOfVehicle = data.vehicleYear;
      this.brandOfVehicle = data.vehicleBrand;
      this.modelOfVehicle = data.vehicle;
      this.useRealEstate = data.useRealEstate;
      this.useVehicle = data.useVehicle;
      this.tempVehicle = data.vehicle;
    }
  }

  yearOrBrandChanged() {
    //get cities from server
    this.modelOfVehicleArr = [this.emptyVehicle];
    this.modelOfVehicle = this.emptyVehicle;
    if (this.yearOfVehicle === 'Selecione' || this.brandOfVehicle.brand === 'Selecione')
      return;

    this._APICallService.getVehicle(this.brandOfVehicle.brand, this.yearOfVehicle).subscribe(
      data => {
        console.log(data);
        this.modelOfVehicleArr = this.modelOfVehicleArr.concat(data as Array<Vehicle>);
        if (this.initFlag) {
          console.log(this.tempVehicle);
          this.modelOfVehicle = this.tempVehicle;
          this.initFlag = false;
        }
      },
      error => {
        var errorMsg: ApiError = error.error;
        console.log(errorMsg);
      }
    );
  }
  compareBrand(a: VehicleBrand, b: VehicleBrand) {
    return a.id == b.id;
  }

  compareVehicle(a: Vehicle, b: Vehicle) {
console.log("vehicle");
    return a.id == b.id;
  }

  onGoBack() {
    this.router.navigateByUrl('page5');
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.modelOfVehicle);
    if (this.form8Group.valid) {
      this.isSubmitting = true;
      //*****************setting data to quote request****************
      var quoteRequest = this._APICallService.quoteRequest;
      if (this.youOwnCar) {
        if (quoteRequest.vehicle == null)
          quoteRequest.vehicle = new SubVehicle;
        quoteRequest.vehicle.fipeCode = this.modelOfVehicle.fipeCode;
        quoteRequest.vehicle.hasDebt = this.isVehicleFunded == 0;
        quoteRequest.vehicle.value = this.modelOfVehicle.priceBrl;
        quoteRequest.useVehicleAsCollateral = (this.useVehicle == 0) && (this.isVehicleFunded == 1);
      } else {
        quoteRequest.vehicle = null;
        quoteRequest.useVehicleAsCollateral = false;
      }

      if (this.youOwnProperty) {
        if (quoteRequest.realEstate == null)
          quoteRequest.realEstate = new RealEstate;
        quoteRequest.realEstate.value = this.propertyValue;
        quoteRequest.realEstate.debtValue = 1 - this.isFinanced;
        quoteRequest.realEstate.hasDeed = this.isPropertyOkay == 0;
        quoteRequest.realEstate.address = quoteRequest.person.address;
        quoteRequest.useRealEstateAsCollateral = (this.useRealEstate == 0) && (this.isPropertyOkay == 0) && (this.isFinanced == 1);
      } else {
        quoteRequest.realEstate = null;
        quoteRequest.useRealEstateAsCollateral = false;
      }

      this._APICallService.quoteRequest = quoteRequest;
      //*************************************************************/

      //*****************setting data to quote request****************
      var data = new Page8Data;
      data.value = this.propertyValue;
      data.isRealEstateFinanced = this.isFinanced;
      data.isRealEstateDocumented = this.isPropertyOkay;
      data.isVehicleFinanced = this.isVehicleFunded;
      data.vehicleYear = this.yearOfVehicle;
      data.vehicleBrand = this.brandOfVehicle;
      data.vehicle = this.modelOfVehicle;
      data.useRealEstate = this.useRealEstate;
      data.useVehicle = this.useVehicle;
      this._dataManagement.save(PAGE8_PREFIX, JSON.stringify(data));
      //*************************************************************/

      this._APICallService.submitSimulationsData().subscribe(
        response => {
          this._APICallService.quoteRequest = response as QuoteRequest;
          console.log(response);
          this.toastr.clear();
          this.toastr.success("Sucesso", "Etapa completada com sucesso", {
            timeOut: 1000
          });
          this.router.navigateByUrl('page7');
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
