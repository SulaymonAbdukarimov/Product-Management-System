import { AbstractControl, ValidationErrors } from '@angular/forms';

export function positivePriceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const price = control.value;
  return price > 0 ? null : { negativePrice: true };
}
