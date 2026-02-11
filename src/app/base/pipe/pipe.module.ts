import { NgModule } from '@angular/core';
import { AbsolutePipe } from './absolute.pipe';

import { DateFormatPipe } from './date-format.pipe';
// import { FileSizeFormatPipe } from './file-size-format.pipe';
// import { NpwpPipe } from './npwp-format.pipe';
// import { TimePipe } from './time-format.pipe';
// import { TooltipListPipe } from './tooltip-list-format.pipe';
// import { YearMonthPipe } from './year-month-format.pipe';

@NgModule({
  imports: [],
  exports: [
    DateFormatPipe,
    AbsolutePipe,
    // FileSizeFormatPipe,
    // NpwpPipe,
    // TimePipe,
    // TooltipListPipe,
    // YearMonthPipe
  ],
  declarations: [
    DateFormatPipe,
    AbsolutePipe,
    // FileSizeFormatPipe,
    // NpwpPipe,
    // TimePipe,
    // TooltipListPipe,
    // YearMonthPipe
  ],
  providers: [DateFormatPipe,]
})
export class PipeModule { }
