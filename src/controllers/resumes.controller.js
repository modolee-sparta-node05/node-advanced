import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ResumesService } from '../services/resumes.service.js';

const resumesService = new ResumesService();

export class ResumesController {
  create = async (req, res, next) => {
    try {
      const user = req.user;
      const { title, content } = req.body;
      const authorId = user.id;

      const data = await resumesService.create({ authorId, title, content });

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  readMany = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;

      let { sort } = req.query;

      sort = sort?.toLowerCase();

      if (sort !== 'desc' && sort !== 'asc') {
        sort = 'desc';
      }

      const data = await resumesService.readMany({ authorId, sort });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  readOne = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;
      const { id } = req.params;

      const data = await resumesService.readOne({ id, authorId });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;
      const { id } = req.params;
      const { title, content } = req.body;

      const data = await resumesService.update({
        id,
        authorId,
        title,
        content,
      });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;
      const { id } = req.params;

      const data = await resumesService.delete({ id, authorId });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
