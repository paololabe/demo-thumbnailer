import { ThumbnailerPage } from './app.po';

describe('thumbnailer App', function() {
  let page: ThumbnailerPage;

  beforeEach(() => {
    page = new ThumbnailerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
