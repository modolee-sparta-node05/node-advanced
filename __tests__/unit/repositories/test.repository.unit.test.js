/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const {
  TestRepository,
} = require('../../../src/repositories/test.reopsitory.js');

jest.mock('bcrypt');

const testRepository = new TestRepository();

describe('TestRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  test('create Method', async () => {
    // GIVEN
    const password = '1234';
    const mockHashedPassword =
      '$2b$10$ZOEFG.7Nm121DH9zHq0OzuCudi6SslQ/Nb60mSV71GObhUtiBsteK';
    bcrypt.hashSync.mockReturnValue(mockHashedPassword);

    const hashedPassword = bcrypt.hashSync(password, 10);

    // WHEN
    const actualResult = testRepository.create(password);

    // THEN
    const expectedResult = hashedPassword;

    expect(actualResult).toEqual(expectedResult);
  });
});
