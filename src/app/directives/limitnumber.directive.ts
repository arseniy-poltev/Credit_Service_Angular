import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[limitNumber]'
})
export class LimitNumberDirective {
  // Allow decimal numbers and negative values
  
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home','ArrowLeft','ArrowRight' ,'-'];

  constructor(private el: ElementRef) {
  }
  @Input('limitNumber') limit: number;
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && next.length>this.limit) {
      event.preventDefault();
    }
  }
}