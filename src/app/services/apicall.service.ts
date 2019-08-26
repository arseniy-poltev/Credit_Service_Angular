import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



export const RESPONSE_SUCCESS = 1;
const serverUrl = 'http://18.207.220.175:8080';


export class Response {
  responseId;
  responseMsg;
}
export class ComboData {
  name: string;
  value: number;
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}
export class Profession {
  id: number;
  occupation: string;
  profession: string;
  constructor(id = null, occupation = null, profession = null) {
    this.id = id;
    this.occupation = occupation;
    this.profession = profession;
  }
}

export class City {
  capital: boolean;
  cityName: string;
  id: number;
  state: string;
  constructor(capital = null, cityName = null, id = null, state = null) {
    this.capital = capital;
    this.cityName = cityName;
    this.id = id;
    this.state = state;
  }
}

export class Address {
  address: string;
  cityId: number;
  complement: string;
  neighborhood: string;
  number: string;
  residenceType: string;
  zipCode: string;
  constructor(address = null, cityId = null, complement = null, neighborhood = null,
    number = null, residenceType = null, zipCode = null) {
    this.address = address;
    this.cityId = cityId;
    this.complement = complement;
    this.neighborhood = neighborhood;
    this.number = number;
    this.residenceType = residenceType;
    this.zipCode = zipCode;
  }
}

export class AddressData {
  bairro: string;
  cep: string;
  complemento: string;
  localidade: string;
  uf: string;
  unidade: string;
  ibge: string;
  gia: string;
  logradouro: string;
}

export class ApiValidationError {
  field: string;
  message: string;
  object: string;
  rejectedValue: any;
  constructor(field = null, message = null, object = null, value = null) {
    this.field = field;
    this.message = message;
    this.object = object;
    this.rejectedValue = value;
  }
}

export class APICallError {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: string;
  constructor(error = null, message = null, path = null, status = null, timestamp = null) {
    this.error = error;
    this.message = message;
    this.path = path;
    this.status = status;
    this.timestamp = timestamp;
  }
}

export class ApiError {
  debugMessage: string;
  message: string;
  status: string;
  subErrors: Array<ApiValidationError>;
  timestamp: string;
  constructor(debugMessage = null, message = null, status = null, subErrors = null, timestamp = null) {
    this.debugMessage = debugMessage;
    this.message = message;
    this.status = status;
    this.subErrors = subErrors;
    this.timestamp = timestamp;
  }
}

export class ZipCodeResponse {
  address: string;
  city: City;
  neighborhood: string;
  zipCode: string;
}

export class VehicleBrand {
  brand: string;
  id: number;
  constructor(brand, id) {
    this.brand = brand;
    this.id = id;
  }
}

export class Vehicle {
  id: number;
  fipeCode: string;
  name: string;
  fuel: string;
  brand: string;
  modelYear: string;
  priceBrl: number;
  constructor(id = null, fipeCode = null, name = null, fuel = null, brand = null, modelYear = null, priceBrl = null) {
    this.id = id;
    this.fipeCode = fipeCode;
    this.name = name;
    this.fuel = fuel;
    this.brand = brand;
    this.modelYear = modelYear;
    this.priceBrl = priceBrl;
  }
}

export class SubVehicle {
  fipeCode: string;
  hasDebt: boolean;
  value: number;
  constructor(fipCode = null, hasDebut = null, value = null) {
    this.fipeCode = fipCode;
    this.hasDebt = hasDebut;
    this.value = value;
  }
}

export class BankAccount {
  account: string = null;
  accountDigit: string = null;
  bank: string = null;
  bankAccountSince: string = null;
  bankAccountType: string = null;
  branch: string = null;
}

export class Employment {
  admissionDate: string = null;
  companyName: string = null;
  income: number = null;
  professionId: number = null;
}

export class PersonalID {
  emissionDate: string = null;
  expirationDate: string = null;
  id: string = null;
  issuingBody: string = null;
  personalIdType: string = null;
}

export class Person {
  address: Address = null;
  addressSince: string = null;
  birthDate: string = null;
  cityIdBorn: number = null;
  cpf: string = null;
  email: string = null;
  employment: Employment = null;
  fullName: string = null;
  gender: string = null;
  maritalStatus: string = null;
  mobilePhone: string = null;
  motherName: string = null;
  nationality: string = null;
  pensionerBenefitNumber: string = null;
  personalIds: Array<PersonalID> = null;
  phone: string = null;
  scholarity: string = null;
}

export class RealEstate {
  address: Address = null;
  debtValue: number = null;
  hasDeed: boolean = null;
  value: string = null;
}

export class QuoteRequest{
  annotated: boolean = null;
  bankAccount: BankAccount = null;
  loanAmount: number = null;
  loanLengthMonths: number = null;
  loanReason: string = null;
  quoteRequestId: number = null;
  person: Person = null;
  realEstate: RealEstate = null;
  useRealEstateAsCollateral: boolean = null;
  useVehicleAsCollateral: boolean = null;
  vehicle: SubVehicle = null;
}


export class QuoteOffer {
  instalmentNumber: number = null;
  instalmentValue: number = null;
  interestRate: number = null;
  principal: number = null;
}

export class QuoteTerm {
  maxValue: number = null;
  minValue: number = null;
  numberOfInstalments: number = null;
}

export class PartnerInfo {
  description: string = null;
  key: string = null;
  legalInfo: string = null;
  logoUrl: string = null;
  name: string = null;
  serviceType: string = null;
}

export class QuotePartnerResponse {
  error: ApiError = null;
  partner: string = null;
  partnerInfo: PartnerInfo = null;
  partnerResponseId: number = null;
  quoteOffers: Array<QuoteOffer> = null;
  quoteRequestId: number = null;
  quoteTerms: Array<QuoteTerm> = null;
  responseDate: string = null;
  status: string = null;
  suggestedOffer: QuoteOffer = null;

}

export class QuoteResponse {
  cpf: string = null;
  error: ApiError = null;
  lastUpdate: string = null;
  partnerResponses: Array<QuotePartnerResponse> = null;
  quoteRequest: QuoteRequest = null;
  quoteResponseId: number = null;
  status: string = null;
}



@Injectable({
  providedIn: 'root'
})

export class APICallService {

  httpOptions = {};
  quoteRequest: QuoteRequest;

  constructor(private http: HttpClient,
    private cookieService: CookieService) {

    console.log("APICallService");

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJcInN0cmluZ1wiIiwiY3JlYXRlZCI6MTU1NTUxODU0Mjc3NiwiZXhwIjoxNTU1NjI2NTQyfQ._BW6TD3rsp7y6Jx7VXxLez5MrQWKLjF5kkq4iFrPfdYkycL0lSVJmeB2BS3WCsOgjCYnXSFKVirG7ZJWgcHQJg'
      })
    };
    // this.getToken().subscribe(
    //   data => {
    //     console.log(data);

    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  submitFormData(url, formData) {
    let body = JSON.stringify(formData);
    return this.http.post(serverUrl + url, body, this.httpOptions);
  }

  getComboBoxData(url, index) {
    return this.http.get(serverUrl + url + index);
  }

  //getAddress(url, cep){
  //  return this.http.get(serverUrl + url + cep);
  //}

  async getOccupations() {
    const response = await this.http.get(serverUrl + '/occupations', this.httpOptions).toPromise();
    return response;
  }

  getProfessions(occupationCode) {
    return this.http.get(serverUrl + `/professions/${occupationCode}`, this.httpOptions);
  }

  getAddress(zipCode) {
    return this.http.get(serverUrl + `/address/${zipCode}`, this.httpOptions);
  }

  getStates() {
    return this.http.get(serverUrl + '/states', this.httpOptions);
  }

  getCities(state) {
    return this.http.get(serverUrl + `/cities/${state}`, this.httpOptions);
  }

  getIdTypes() {
    return this.http.get(serverUrl + '/personal_id_types', this.httpOptions);
  }

  getResidence() {
    return this.http.get(serverUrl + '/residence_types', this.httpOptions);
  }

  getProofsOfIncome() {
    return this.http.get(serverUrl + '/proofs_of_income', this.httpOptions);
  }

  getVehicleYears() {
    return this.http.get(serverUrl + '/vehicle_years', this.httpOptions);
  }

  getVehicleBrands() {
    return this.http.get(serverUrl + '/vehicle_brands', this.httpOptions);
  }

  getVehicle(brand, year) {
    return this.http.get(serverUrl + '/vehicle/' + brand + '/' + year, this.httpOptions);
  }

  getBankAccountSinceIntervals() {
    return this.http.get(serverUrl + '/bank_account_since_intervals', this.httpOptions);
  }

  getBankAccountTypes() {
    return this.http.get(serverUrl + '/bank_account_types', this.httpOptions);
  }

  getBanks() {
    return this.http.get(serverUrl + '/banks', this.httpOptions);
  }

  getMaritalStatuses() {
    return this.http.get(serverUrl + '/marital_statuses', this.httpOptions);
  }

  getScholarities() {
    return this.http.get(serverUrl + '/scholarities', this.httpOptions);
  }

  getRoanReasons() {
    return this.http.get(serverUrl + '/loan_reasons', this.httpOptions);
  }

  getToken() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post(serverUrl + '/token', '{}', { headers, responseType: 'text' });
  }

  getDocIssuingBodies() {
    return this.http.get(serverUrl + '/doc_issuing_bodies', this.httpOptions);
  }

  submitSimulationsData() {
    var body = JSON.stringify(this.quoteRequest);
    return this.http.post(serverUrl + '/simulations-data', body, this.httpOptions);
  }

  omitKeys(obj, keys) {
    var dup = {};
    for (var key in obj) {
      if (keys.indexOf(key) == -1) {
        dup[key] = obj[key];
      }
    }
    return dup;
  }

  submitSimulations() {
    var body = JSON.stringify(this.omitKeys(this.quoteRequest,['quoteRequestId']));
    return this.http.post(serverUrl + '/simulations', body, this.httpOptions);
  }

  getSimulationsData(quoteId) {
    return this.http.get(serverUrl + '/simulations-data/' + quoteId, this.httpOptions);
  }

  getQuoteResponse(quoteResponseId) {
    return this.http.get(serverUrl + '/quote_response/' + quoteResponseId, this.httpOptions);
  }


  loadInitialData() {
    const cookieExists: boolean = this.cookieService.check('quoteId');
    var flag = false;
    if (cookieExists) {
      var quoteId = this.cookieService.get('quoteId');
      if (quoteId != undefined) {
        this.getSimulationsData(quoteId).subscribe(
          data => {
            console.log(data);
            this.quoteRequest = data as QuoteRequest;
            flag = true;
          },
          error => {
            console.log(error);
            //this.router.navigateByUrl('/error');
          }
        );
      }
    }
    if (!flag) {
      this.quoteRequest = new QuoteRequest;
    }
  }


  initializeApp(): Promise<any> {
    const cookieExists: boolean = this.cookieService.check('quoteId');
    var flag = false;
    if (cookieExists) {
      var quoteId = this.cookieService.get('quoteId');
      if (quoteId != undefined) {
        flag = true;
        const promise = this.http.get(serverUrl + '/simulations-data/' + quoteId, this.httpOptions)
          .toPromise()
          .then(data => {
            console.log(`Settings from API: `, data);
            this.quoteRequest = data as QuoteRequest;
          })
          .catch(error => {
            this.quoteRequest = new QuoteRequest;
            if (error instanceof HttpErrorResponse) {
              if (error.status == 403) {
                alert("Acesso Negado");
              } else {
                alert("Estamos com problemas temporários. Pode voltar em 10 minutinhos?");
              }
            }
          });
        return promise;
      }
    }
    if (!flag) {
      this.quoteRequest = new QuoteRequest;
    }
  }

  transformDate(str: string, type: boolean) {
    if (str == null)
      return '';
    if (str.length != 10)
      return '';
    if (type) {
      var a = str.split('-');
      if (a.length != 3)
        return '';
      return a[2] + '/' + a[1] + '/' + a[0];
    } else {
      var a = str.split('/');
      if (a.length != 3)
        return '';
      return a[2] + '-' + a[1] + '-' + a[0];
    }
  }
}
