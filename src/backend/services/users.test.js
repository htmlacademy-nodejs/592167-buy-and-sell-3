'use strict';

const userRepository = require(`../repositories/users`);
jest.mock(`../repositories/users`);

const bcrypt = require(`bcrypt`);
const salt = 10;

const underTest = require(`./users`);

describe(`add`, () => {
  test(`should return id new user`, async () => {
    const expectedUserInfo = {id: 1};
    const mockUserInfo = {email: ``, password: ``};
    userRepository.add.mockReturnValue(expectedUserInfo);
    const actualUserInfo = await underTest.add(mockUserInfo);
    expect(actualUserInfo).toEqual(expectedUserInfo);
  });
});

describe(`checkUserPassword`, () => {
  test(`should return true or false depending on user authorization or not`, async () => {
    const MOCK_USER_PASSWORD = `1234567`;
    const userPassword = await bcrypt.hash(MOCK_USER_PASSWORD, salt);
    const mockUserInfo = {
      dataValues: {
        password: userPassword,
      },
    };
    const expectedAuthorizationStatus = true;
    userRepository.getUserPassword.mockReturnValue(mockUserInfo);
    const actualStatus = await underTest.checkUserPassword(``, MOCK_USER_PASSWORD);
    expect(actualStatus).toEqual(expectedAuthorizationStatus);
  });
});
