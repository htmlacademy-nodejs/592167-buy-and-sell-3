'use strict';

const sessionRepository = require(`../repositories/session`);
jest.mock(`../repositories/session`);

const underTest = require(`./session`);

const isSession = 1;
const isNotSession = 0;

describe(`checkLogin`, () => {
  test(`should return user is login`, async () => {
    const expectResponse = isSession;
    const mockUserInfo = [{}];
    sessionRepository.checkLogin.mockReturnValue(mockUserInfo);
    const sessionInfo = await underTest.checkLogin(``);
    expect(sessionInfo).toEqual(expectResponse);
  });

  test(`should return user is not login`, async () => {
    const expectedResponse = isNotSession;
    const mockUserInfo = [];
    sessionRepository.checkLogin.mockReturnValue(mockUserInfo);
    const sessionInfo = await underTest.checkLogin(``);
    expect(sessionInfo).toEqual(expectedResponse);
  });
});
