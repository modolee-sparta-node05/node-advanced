import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }

  create = async ({ authorId, title, content }) => {
    const data = await this.resumesRepository.create({
      authorId,
      title,
      content,
    });

    return data;
  };

  readMany = async ({ authorId, sort }) => {
    const data = await this.resumesRepository.readMany({ authorId, sort });

    return data;
  };

  readOne = async ({ id, authorId }) => {
    const data = await this.resumesRepository.readOne({
      id,
      authorId,
      includeAuthor: true,
    });

    if (!data) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    return data;
  };

  update = async ({ id, authorId, title, content }) => {
    const existedResume = await this.resumesRepository.readOne({
      id,
      authorId,
    });

    if (!existedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    const data = await this.resumesRepository.update({
      id,
      authorId,
      title,
      content,
    });

    return data;
  };

  delete = async ({ id, authorId }) => {
    const existedResume = await this.resumesRepository.readOne({
      id,
      authorId,
    });

    if (!existedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    const data = await this.resumesRepository.delete({ id, authorId });

    return data;
  };
}
