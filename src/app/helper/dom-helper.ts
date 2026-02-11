
export class DomHelper {

  public static setFocus(element: any, isDialog: boolean = false) {
    if (!isDialog) {
      const focusInterval = setInterval(
        () => {
          if (element.nativeElement) {
            element.nativeElement.focus();
            if (element.nativeElement === document.activeElement) {
              clearInterval(focusInterval);
            }
          } else {
            element.focus();
            if (element === document.activeElement) {
              clearInterval(focusInterval);
            }
          }
        }, 250
      );
    } else {
      const focusTimeout = setTimeout(
        () => {
          if (element.nativeElement) {
            element.nativeElement.focus();
          } else {
            element.focus();
          }

          clearTimeout(focusTimeout);
        }, 1000
      );
    }
  }
}
