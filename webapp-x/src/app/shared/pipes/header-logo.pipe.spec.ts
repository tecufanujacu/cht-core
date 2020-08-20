import { HeaderLogoPipe } from './header-logo.pipe';

describe('HeaderLogoPipe', () => {
  it('create an instance', () => {
    const pipe = new HeaderLogoPipe(null, null);
    expect(pipe).toBeTruthy();
  });
});
