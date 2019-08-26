import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';
import { Router , ActivatedRoute } from '@angular/router';
import { DataManagementService } from '../../services/data-management.service';
@Component({
  selector: 'app-root',
  templateUrl: './page4.component.html',
  styleUrls: ['../../app.component.css']
})
export class Page4Component implements OnInit , OnDestroy {

  whatsApp: boolean = false
  progress: number = 0
  interval;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _DataManagementService: DataManagementService) { 
     // console.log(this._DataManagementService.userName + 'abc');
    this.startTimer();
  }

  ngOnInit() {
    this.whatsApp = +this.route.snapshot.paramMap.get('whatsApp') > 0;
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

  startTimer(){
    this.interval = setInterval(() => {
      this.progress++;
      if(this.progress > 99){
        clearInterval(this.interval);
        setTimeout(()=>{
          this.router.navigateByUrl(this.whatsApp?'/page6':'/page5');
        },1000);
      }
    },100);
  }
}
