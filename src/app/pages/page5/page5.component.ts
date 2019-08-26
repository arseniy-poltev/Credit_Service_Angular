import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { APICallService, ApiError, APICallError, QuoteResponse, PartnerInfo, QuotePartnerResponse } from 'src/app/services/apicall.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './page5.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page5Component implements OnInit, OnDestroy {

  quoteResponseId: number = null;
  loading: boolean = false;
  quoteResponse: QuoteResponse;
  statusArr = ["PROCESSING", "APPROVED", "ERROR", "DENIED"];
  classArr = ["bg-primary", "bg-success", "bg-danger", "bg-warning"];
  indexArr = [];
  interval = null;
  processingResponse = [];
  deniedResponse = [];
  approvedResponse = [];
  validDate;
  constructor(private router: Router,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private _APICallService: APICallService) {
    this.quoteResponseId = Number(this.cookieService.get("quoteResponseId"));
    console.log(this.quoteResponseId);
  }

  ngOnInit() {

    if (this.quoteResponseId != null && this.quoteResponseId != 0 && this.quoteResponseId != undefined) {
      //this.loading = true;
      this.quoteResponse = null;
      this.poolFunc();
      this.interval = setInterval(() => {
        this.poolFunc();
      }, 1000);

    } else {
      this.router.navigateByUrl('page1');
    }
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  poolFunc() {
    if (this.loading)
      return;
    this.loading = true;
    this._APICallService.getQuoteResponse(this.quoteResponseId).subscribe(
      response => {
        this.loading = false;
        
        var now = new Date();
        now.setDate(now.getDate() + 30);
        this.validDate = (now.getMonth() + 1) + '/' + now.getDate() + '/' +  now.getFullYear();
        
        var temp = response as QuoteResponse;
        console.log(temp);
        this.quoteResponse = temp;
        this.processingResponse = [];
        this.deniedResponse = [];
        this.approvedResponse = [];
        for (var i in temp.partnerResponses) {
          if (temp.partnerResponses[i].error) {
            for (var j in temp.partnerResponses[i].error) {
              this.toastr.error(temp.partnerResponses[i].error.subErrors[j].message, temp.partnerResponses[i].error.subErrors[j].field, {
                disableTimeOut: true,
                closeButton: true
              });
            }
          } else {
            switch (temp.partnerResponses[i].status) {
              case "PROCESSING": {
                this.processingResponse.push(temp.partnerResponses[i]);
                break;
              }
              case "APPROVED": {
                this.approvedResponse.push(temp.partnerResponses[i]);
                break;
              }
              case "DENIED": {
                this.deniedResponse.push(temp.partnerResponses[i]);
              }
            }
          }
        }
        if (this.processingResponse.length == 0) {
          if (this.interval) {
            clearInterval(this.interval);
            this.toastr.success("Sucesso", "Your request is all processed!", {
              timeOut: 1000
            });
          }
        }
      

      },
      error => {
        this.toastr.clear();
        this.loading = false;
	clearInterval(this.interval);
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
		this.router.navigateByUrl('page1');
            }
          } else {
            console.log("other");
            var resError1 = error.error as APICallError;
            this.toastr.error(resError1.error, resError1.error, {
              disableTimeOut: true,
              closeButton: true
            });
	this.router.navigateByUrl('page1');
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
