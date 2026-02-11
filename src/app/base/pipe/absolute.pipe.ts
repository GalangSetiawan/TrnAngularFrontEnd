import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'absolute', pure: true })
export class AbsolutePipe implements PipeTransform {

  public transform(num: number, args?: any): any {
    return Math.abs(num);
  }

}
