import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export class TermsValidator {
    static validTerms(fc: FormControl) {
        if (!fc.value) {
            return ({ validTerms: true });
        } else {
            return (null);
        }
    }
}

export class AmPValidator {
    static validAmP(fc: FormControl) {
        if (fc.value < 1) {
            return ({ validAmP: true });
        } else {
            return (null);
        }
    }
}

export class UserNameValidator {
    static validUsername(fc: FormControl) {
        var str = fc.value.trim();
        if (str.indexOf(' ') == -1) {
            return ({ validUsername: true });
        } else {
            return (null);
        }
    }
    static validMotherName(fc: FormControl){
        var str = fc.value.trim();
        if (str.indexOf(' ') == -1 || !(str[0] >= 'A' && str[0] <= 'Z')) {
            return ({ validUsername: true });
        } else {
            return (null);
        }
    }
}

export class PhoneNumberValidator {
    static validPhoneNumber(fc: FormControl) {
        var str = fc.value;
        if (str.length == 11 && str.substring(0,8) === "11993487") {
            return (null);
        } else {
            return ({ validPhoneNumber: true });
        }
    }
}


export class ComboBoxValidator {
    static requireCombo(fc: FormControl) {
        if (fc.value == 0) {
            return ({ requireCombo: true });
        } else {
            return (null);
        }
    }
    static validator(fc: FormControl) {
        if (fc.value == "Selecione") {
            return ({ requireCombo: true });
        } else {
            return (null);
        }
    }
    static validator1(fc: FormControl){
        if (fc.value.cityName == "Selecione") {
            return ({ requireCombo: true });
        } else {
            return (null);
        }
    }
    static validator2(fc: FormControl) {
        if (fc.value.id == -1) {
            return ({ requireCombo: true });
        } else {
            return (null);
        }
    }
}
export class CustomValidator {
    static requireCustom(fc: FormControl) {
        if (fc.value == -1) {
            return ({ requireCustom: true });
        } else {
            return (null);
        }
    }
}
export class CPFValidator{
    static cpfValidate(fc: FormControl){
        const mod11 = ( num ) => num % 11 
        const NOT = ( x ) => !x
        const isEqual = ( a ) => ( b ) => b === a 
        const mergeDigits = ( num1, num2 ) => `${num1}${num2}`
        const getTwoLastDigits = ( cpf ) => `${cpf[ 9 ]}${cpf[ 10 ]}`
        const getCpfToCheckInArray = ( cpf ) => cpf.substr( 0, 9 ).split( '' )
        const generateArray = ( length ) => Array.from( { length }, ( v, k ) => k )
        
        const isIn = ( list ) => ( value ) => 
          list.findIndex( v => value === v ) >= 0
        
        const isSameDigitsCPF = ( cpfFull ) => 
          isIn( generateArray( 10 ).map( generateStringSequence( 11 ) ) )( cpfFull )
        
        const generateStringSequence = ( times ) => ( char ) => 
          ( `${char}`.repeat( times ) )
        
        const toSumOfMultiplication = ( total ) => ( result, num, i ) => 
          result + ( num * total-- )
        
        const getSumOfMultiplication = ( list, total ) => 
          list.reduce( toSumOfMultiplication( total ), 0 )
        
        const getValidationDigit = ( total ) => ( cpf ) =>
          getDigit( mod11( getSumOfMultiplication( cpf, total ) ) )
        
        const getDigit = ( num ) => 
          ( num > 1 )
            ? 11 - num
            : 0
        
        const isValidCPF = ( cpfFull ) => {
          const cpf = getCpfToCheckInArray( cpfFull )
          const firstDigit = getValidationDigit( 10 )( cpf )
          const secondDigit = getValidationDigit( 11 )( cpf.concat( firstDigit ) )
          
          return isEqual( getTwoLastDigits( cpfFull ) )
                        ( mergeDigits( firstDigit, secondDigit ) )
        }
        
        const validate = ( CPF ) => NOT( isSameDigitsCPF( CPF ) ) && isValidCPF( CPF )
        if(!validate(fc.value)){
            return ({ cpfValidate: true });
        }else{
            return (null);
        }
    }
}

