import { Directive, Input } from '@angular/core';
import {NgControl} from '@angular/forms'

@Directive({
  selector: '[ngModel][date]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown.backspace)': 'onInputChange($event.target.value, true)'
  }
})
export class DateMaskDirective {

  constructor(public model: NgControl) {}
  onInputChange(event, backspace) {
    // remove all mask characters (keep only numeric)
    var length = event.length;
    var newVal = event.replace(/\D/g, '');
    //__/__/____
    

    if (backspace) {
      newVal = newVal.substring(0, newVal.length);
    } 
    // don't show braces for empty value
    if (newVal.length == 0) {
      newVal = '';
    } 
    var maskStr = '__/__/____'
    var tailStr = maskStr.substring(newVal.length);
    newVal += tailStr;
    
    
    // set the new value
    this.model.valueAccessor.writeValue(newVal);       
  }

}
