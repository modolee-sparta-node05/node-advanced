import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HASH_SALT_ROUNDS } from '../../../src/constants/auth.constant.js';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

// https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
jest.unstable_mockModule('bcrypt', () => {
  return {
    __esModule: true,
    default: {
      hashSync: jest.fn(),
    },
  };
});

// https://github.com/jestjs/jest/issues/10025#issuecomment-1879784754
const { UsersRepository } = await import(
  '../../../src/repositories/users.repository.js'
);

const usersRepository = new UsersRepository(mockPrisma);

describe('UsersRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  test('create Method', async () => {
    // GIVEN
    const { email, password, name } = dummyUsers[0];

    const mockHashedPassword =
      '$2b$10$ZOEFG.7Nm121DH9zHq0OzuCudi6SslQ/Nb60mSV71GObhUtiBsteK';
    const bcrypt = (await import('bcrypt')).default;

    console.log({ bcrypt });
    bcrypt.hashSync.mockReturnValue(mockHashedPassword);

    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    console.log('test:', { hashedPassword });

    const mockReturn = {
      id: 100,
      email,
      password: hashedPassword,
      name,
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.user.create.mockReturnValue(mockReturn);

    // WHEN
    const actualResult = await usersRepository.create({
      email,
      password,
      name,
    });

    // THEN
    const expectedResult = mockReturn;

    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    expect(actualResult).toEqual(expectedResult);
  });
});
