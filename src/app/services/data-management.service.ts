import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { City, Vehicle, VehicleBrand, Profession } from './apicall.service';

export const PAGE1_PREFIX: string = "page1";
export const PAGE2_PREFIX: string = "page2";
export const PAGE3_PREFIX: string = "page3";
export const PAGE6_PREFIX: string = "page6";
export const PAGE7_PREFIX: string = "page7";
export const PAGE8_PREFIX: string = "page8";
export const PAGE9_PREFIX: string = "page9";

export class Page1Data {
  loanAmount: number;
  loanLengthMonths: number;
  fullName: string;
  email: string;
}

export class Page2Data {
  cpf:string;
  dateOfBirth:string;
  sex:number;
  income:number;
  maritalStatus:number;
  doCheck:number;
  hasRestrictions:number;
  ownProperty:number;
  ownCar:number;
  occupation:number;
  profession:Profession;
  degree:string;
  bankAccount:string;

}

export class Page3Data {
  zipCode:string;
  street:string;
  number:string;
  complement:string;
  neighborhood:string;
  city:string;
  state:string;
  cellPhone:string;
  otherPhone:string;
  loadReason:string;
}

export class Page6Data {
  email:string;
  nationality:number;
  motherName:string;
  residence:number;
  addrSince:string;
  identity:string;
  issudeDate:string;
  validateDate:string;
  identityNum:string;
  organ:string;
  uf:string;
  state:string;
  city:City;
}

export class Page7Data {
  companyName:string;
  admissionDate:string;
  prootIncome:number;
  phoneNumber:string;
}

export class Page8Data {
  value:string;
  isRealEstateFinanced:number;
  isRealEstateDocumented:number;
  vehicleYear:string;
  vehicleBrand:VehicleBrand;
  vehicle:Vehicle;
  isVehicleFinanced:number;
  useRealEstate:number;
  useVehicle:number;
}

export class Page9Data {
  bank:string;
  account:string;
  accountDigit:string;
  bankAccountType:number;
  bankAccountSince:number;
  branch:string;
}


@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  constructor(protected localStorage: LocalStorage) { }

  save(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string) {
    var v = localStorage.getItem(key);
    if(v == null || v == undefined)
      return null;
    return JSON.parse(v);
  }

  clear() {
    localStorage.clear();
  }

  indexOf(arr, val): number {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]['name'] === val) {
        return i;
      }
    }
    return -1;
  }
}

