export interface Language {
  value: string;
  locale: string;
  label: string;
  icon: string;
  inputDateFormat: string;
  datePrimeNg: any;
}

export class LanguageTypes {
  public static readonly indonesia: Language = { value: 'id', 
                                                 locale: 'id-ID',
                                                 label: 'Indonesia',
                                                 icon: 'assets/img/icons/indonesia-icon.png',
                                                 inputDateFormat: 'dd/mm/yy',
                                                 datePrimeNg: {
                                                  firstDayOfWeek: 0,
                                                  dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
                                                  dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
                                                  dayNamesMin: ["Mi","Sn","Sl","Rb","Km","Jm","Sb"],
                                                  monthNames: [ "Januari","Pebruari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
                                                  monthNamesShort: [ "Jan", "Peb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
                                                  today: 'Today',
                                                  clear: 'Clear',
                                                  dateFormat: 'dd/mm/yy',
                                                  weekHeader: 'Wk'
                                                 }
                                                };

  public static readonly english: Language = { value: 'en',
                                               locale: 'en-US',
                                               label: 'Inggris',
                                               icon: 'assets/img/icons/english-icon.png',
                                               inputDateFormat: 'mm/dd/yy',
                                               datePrimeNg: {
                                                firstDayOfWeek: 0,
                                                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                                                dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
                                                monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
                                                monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                                                today: 'Today',
                                                clear: 'Clear',
                                                dateFormat: 'mm/dd/yy',
                                                weekHeader: 'Wk'
                                                }
                                              };

  public static getValues(): Language[] {
    return [LanguageTypes.indonesia, LanguageTypes.english];
  }
}
