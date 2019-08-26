import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { APICallService, ApiError, QuoteRequest } from '../services/apicall.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class Page6Resolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getResidence();

    }
}

@Injectable()
export class Page7Resolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getProofsOfIncome();
    }
}

@Injectable()
export class VehicleYearResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getVehicleYears();
    }
}

@Injectable()
export class VehicleBrandResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getVehicleBrands();
    }
}

@Injectable()
export class BankAccountIntervalResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getBankAccountSinceIntervals();
    }
}

@Injectable()
export class BankAccountTypeResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getBankAccountTypes();
    }
}

@Injectable()
export class BankResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getBanks();
    }
}

@Injectable()
export class MaritalStatuseResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getMaritalStatuses().toPromise();
    }
}
@Injectable()
export class LoanReasonResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getRoanReasons();
    }
}

@Injectable()
export class IssuinBodyResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getDocIssuingBodies();
    }
}

@Injectable()
export class StateResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getStates();
    }
}




@Injectable()
export class ScholarityResolve implements Resolve<any> {
    constructor(private _APICallService: APICallService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._APICallService.getScholarities();
        // this._APICallService.getScholarities().subscribe(
        //     data => {
        //         return data;
        //     },
        //     error => {
        //         var errorMsg: ApiError = error.message;
        //         //console.log(errorMsg);
        //         alert(errorMsg);
        //         this.router.navigateByUrl("/error");
        //     }
        // )
    }
}
