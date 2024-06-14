import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
import { updateResumeValidator } from '../middlewares/validators/update-resume-validator.middleware.js';
import { ResumesController } from '../controllers/resumes.controller.js';
import { ResumesRepository } from '../repositories/resumes.repository.js';
import { ResumesService } from '../services/resumes.service.js';

const resumesRouter = express.Router();

const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);

// 이력서 생성
resumesRouter.post('/', createResumeValidator, resumesController.create);

// 이력서 목록 조회
resumesRouter.get('/', resumesController.readMany);

// 이력서 상세 조회
resumesRouter.get('/:id', resumesController.readOne);

// 이력서 수정
resumesRouter.put('/:id', updateResumeValidator, resumesController.update);

// 이력서 삭제
resumesRouter.delete('/:id', resumesController.delete);

export { resumesRouter };
