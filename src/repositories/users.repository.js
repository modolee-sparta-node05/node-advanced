import bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../constants/auth.constant.js';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create = async ({ email, password, name }) => {
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    const data = await this.prisma.user.create({
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
    const data = await this.prisma.user.findUnique({ where: { email } });

    return data;
  };

  readOneById = async (id) => {
    const data = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    return data;
  };
}
