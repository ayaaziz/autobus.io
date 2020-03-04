import { FormControl } from '@angular/forms';
 
// Custom Validator to validate password entered by user if it contains charaters (capital and small letters) and number
export class passwordValidator {
 
    static isValid(control: FormControl): any {
        if (/[0-9]/.test(String(control.value)) == true && /[a-zA-Z]/.test(String(control.value)) == true){
            return null;
        }
        else{
            return {invalidChars: true};;
        }
    }

}
// Custom Validator to validate email entered by user and check if field match another one as password and confirm password
export class emailValidator {
 
  static isValid(control: FormControl): any {
    if(!control.value){
      return null
    }
      if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(String(control.value).trim()) == true || /^[\u0621-\u064A\s\p{N}]+$/.test(String(control.value).trim()) == true){
          return null;
      }
      else{
          return {invalidChars: true};;
      }
  }

}
export function matchOtherValidator (otherControlName: string) {

  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate (control: FormControl) {

    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      };
    }

    return null;

  }

}