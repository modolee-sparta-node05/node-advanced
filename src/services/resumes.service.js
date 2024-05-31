import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { ResumesRepository } from '../repositories/resumes.repository.js';

const resumesRepository = new ResumesRepository();

export class ResumesService {
  create = async ({ authorId, title, content }) => {
    const data = await resumesRepository.create({ authorId, title, content });

    return data;
  };

  readMany = async ({ authorId, sort }) => {
    const data = await resumesRepository.readMany({ authorId, sort });

    return data;
  };

  readOne = async ({ id, authorId }) => {
    const data = await resumesRepository.readOne({
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
    const existedResume = await resumesRepository.readOne({ id, authorId });

    if (!existedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    const data = await resumesRepository.update({
      id,
      authorId,
      title,
      content,
    });

    return data;
  };

  delete = async ({ id, authorId }) => {
    const existedResume = await resumesRepository.readOne({ id, authorId });

    if (!existedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    const data = await resumesRepository.delete({ id, authorId });

    return data;
  };
}
