import { NzModalService } from 'ng-zorro-antd/modal';

import { AppInjector } from '../../app.component';

export function DeleteConfirmation(title: string = 'Are you sure to proceed') {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const modalService = AppInjector.get(NzModalService);

    descriptor.value = function (...args: any[]) {
      modalService.confirm({
        nzTitle: title,
        nzOnOk: () => {
          originalMethod.apply(this, args);
        },
      });
    };

    return descriptor;
  };
}
