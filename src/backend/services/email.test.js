'use strict';

const emailRepository = require(`../repositories/email`);
jest.mock(`../repositories/email`);

const underTest = require(`./email`);

describe(`checkEmail`, () => {
  test(`test should return status user register`, async () => {
    const expectedResponse = {userRegister: true};
    const mockUserInfo = {id: 1, email: ``};
    emailRepository.checkEmail.mockReturnValue(mockUserInfo);
    const userInfo = await underTest.checkEmail(``);
    expect(userInfo).toEqual(expectedResponse);
  });

  test(`test should return status user don't register`, async () => {
    const expectedResponse = {userRegister: false};
    const mockUserInfo = undefined;
    emailRepository.checkEmail.mockReturnValue(mockUserInfo);
    const userInfo = await underTest.checkEmail(``);
    expect(userInfo).toEqual(expectedResponse);
  });
});
