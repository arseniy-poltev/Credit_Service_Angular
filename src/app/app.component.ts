import { Component, NgModule, Directive, OnInit } from '@angular/core';
import { Router, Event, NavigationCancel, NavigationStart, NavigationError, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  loading = false;
  constructor(private router: Router) {
    console.log("3");
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd: {
          this.loading = false;
          break;
        }
        case event instanceof NavigationCancel: {
          this.loading = false;
          break;
        }
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          
          break;
        }
      }
    });
  }

}
