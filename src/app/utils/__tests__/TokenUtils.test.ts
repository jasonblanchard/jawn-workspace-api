import TokenUtils from '../TokenUtils';

describe('TokenUtils', () => {
  it('Parses the header', () => {
    const header = 'Bearer aaa.bbb.ccc';
    expect(TokenUtils.parseAuthorizationHeader(header)).toEqual('aaa.bbb.ccc');
  });

  it('Returns undefined when it is malformed', () => {
    const header = 'asdf aaa.bbb.ccc';
    expect(TokenUtils.parseAuthorizationHeader(header)).toEqual(undefined);
  });

  it('Returns undefined when nothing is passed in', () => {
    const header = undefined;
    expect(TokenUtils.parseAuthorizationHeader(header)).toEqual(undefined);
  });
});



