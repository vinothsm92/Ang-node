import { AbstractControl, FormGroup } from '@angular/forms';


export function passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      
        const cnfpassValue = control.value;

        const passControl = control.root.get('Password'); // magic is this
        if (passControl) {
            const passValue = passControl.value;
             
            if (passValue !== cnfpassValue || passValue === '') {
                return {
                    invalid: true
                };
            }
        }
    }

    return null;
}
 