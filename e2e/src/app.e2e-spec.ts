import {CaliforniaPage} from './app.po';

describe('California App', () => {
    let page: CaliforniaPage;

    beforeEach(() => {
        page = new CaliforniaPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to California!');
    });
});
