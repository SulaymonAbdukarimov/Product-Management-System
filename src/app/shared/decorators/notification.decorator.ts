import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppInjector } from '../../app.component';

export function Notification(
  type: 'success' | 'info' | 'warning' | 'error' | 'blank' = 'success',
  successMessage: string,
  errorMessage: string
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]): Observable<any> {
      const notificationService = AppInjector.get(NzNotificationService);

      return originalMethod
        .apply(this, args)
        .pipe(
          tap(() => {
            notificationService.create(type, 'Success', successMessage);
          }),
          catchError((error) => {
            notificationService.create('error', 'Error', errorMessage);
            throw error;
          })
        )
        .subscribe();
    };

    return descriptor;
  };
}
