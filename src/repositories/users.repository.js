import bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../constants/auth.constant.js';
import { prisma } from '../utils/prisma.util.js';

export class UsersRepository {
  create = async ({ email, password, name }) => {
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    const data = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      omit: { password: true },
    });

    return data;
  };

  readOneByEmail = async (email) => {
    const data = await prisma.user.findUnique({ where: { email } });

    return data;
  };

  readOneById = async (id) => {
    const data = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    return data;
  };
}
