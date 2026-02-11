
export class ThemeHelper {

  public static ashTheme() {
    this.changeTheme('ash');
  }

  public static noirTheme() {
    this.changeTheme('noir');
  }

  // public static lightPeakTheme() {
  //   this.changeThemeLight('peak', 'light');
  // }

  static changeTheme(theme: string) {
    this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '.css');
    this.changeStyleSheetsColor('layout-css', 'layout-' + theme + '.css');
  }

  // static changeThemeLight(theme: string, scheme: string) {
  //   this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '.css');
  //   this.changeStyleSheetsColor('layout-css', 'layout-' + theme + '.css');
  // }

  static changeStyleSheetsColor(id, value) {
    const element = document.getElementById(id);
    const urlTokens = element.getAttribute('href').split('/');
    urlTokens[urlTokens.length - 1] = value;

    const newURL = urlTokens.join('/');

    this.replaceLink(element, newURL);
  }

  static isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  static replaceLink(linkElement, href) {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
        const id = linkElement.getAttribute('id');
        const cloneLinkElement = linkElement.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }

}
