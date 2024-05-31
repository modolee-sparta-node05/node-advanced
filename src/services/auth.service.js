import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import { ACCESS_TOKEN_EXPIRES_IN } from '../constants/auth.constant.js';

export class AuthService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  signUp = async ({ email, password, name }) => {
    const existedUser = await this.usersRepository.readOneByEmail(email);

    // 이메일이 중복된 경우
    if (existedUser) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    const data = await this.usersRepository.create({ email, password, name });

    return data;
  };

  signIn = async ({ email, password }) => {
    const user = await this.usersRepository.readOneByEmail(email);

    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    if (!isPasswordMatched) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    const payload = { id: user.id };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    return { accessToken };
  };
}
