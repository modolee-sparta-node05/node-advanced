import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumesService } from '../../../src/services/resumes.service.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { RESUME_STATUS } from '../../../src/constants/resume.constant.js';
import { HttpError } from '../../../src/errors/http.error.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockResumesRepository = {
  create: jest.fn(),
  readMany: jest.fn(),
  readOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const resumesService = new ResumesService(mockResumesRepository);

describe('ResumesService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('create Method', async () => {
    // GIVEN
    const { authorId, title, content } = dummyResumes[0];
    const mockReturn = {
      id: 100,
      authorId,
      title,
      content,
      status: RESUME_STATUS.APPLY,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockResumesRepository.create.mockReturnValue(mockReturn);

    // WHEN
    const actualResult = await resumesService.create({
      authorId,
      title,
      content,
    });

    // THEN
    const expectedResult = mockReturn;

    expect(mockResumesRepository.create).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.create).toHaveBeenCalledWith({
      authorId,
      title,
      content,
    });
    expect(actualResult).toEqual(expectedResult);
  });

  test('readMany Method', async () => {
    // GIVEN
    const authorId = 1;
    const sort = 'asc';
    const mockReturn = dummyResumes
      .filter((resume) => resume.authorId === authorId)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((resume) => {
        return {
          ...resume,
          authorName: resume.author.name,
          authorId: undefined,
          author: undefined,
        };
      });
    mockResumesRepository.readMany.mockReturnValue(mockReturn);

    // WHEN
    const actualResult = await resumesService.readMany({ authorId, sort });

    // THEN
    const expectedResult = mockReturn;
    expect(mockResumesRepository.readMany).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.readMany).toHaveBeenCalledWith({
      authorId,
      sort,
    });
    expect(actualResult).toEqual(expectedResult);
  });

  test('readOne Method', async () => {
    // GIVEN
    const id = '1';
    const authorId = 1;
    let mockReturn = dummyResumes[+id];
    mockReturn = {
      ...mockReturn,
      authorName: mockReturn.author.name,
      authorId: undefined,
      author: undefined,
    };
    mockResumesRepository.readOne.mockReturnValue(mockReturn);

    // WHEN
    const actualResult = await resumesService.readOne({ id, authorId });

    // THEN
    const expectedResult = mockReturn;

    expect(mockResumesRepository.readOne).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.readOne).toHaveBeenCalledWith({
      id,
      authorId,
      includeAuthor: true,
    });
    expect(actualResult).toEqual(expectedResult);
  });

  test('readOne Method - 이력서 없는 경우', async () => {
    // GIVEN
    const id = '1';
    const authorId = 1;
    const mockReturn = null;
    mockResumesRepository.readOne.mockReturnValue(mockReturn);

    // WHEN
    try {
      await resumesService.readOne({ id, authorId });
    } catch (error) {
      // THEN
      expect(mockResumesRepository.readOne).toHaveBeenCalledTimes(1);
      expect(mockResumesRepository.readOne).toHaveBeenCalledWith({
        id,
        authorId,
        includeAuthor: true,
      });
      expect(error).toEqual(
        new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND),
      );
    }
  });

  test('update Method', async () => {
    // GIVEN
    const id = '1';
    const authorId = 1;
    const title = '슈퍼 튼튼한 개발자 스파르탄';
    const content =
      '아주 그냥 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.';
    const mockReadOneReturn = dummyResumes[+id];
    const mockUpdateReturn = {
      ...dummyResumes[+id],
      title,
      content,
    };
    mockResumesRepository.readOne.mockReturnValue(mockReadOneReturn);
    mockResumesRepository.update.mockReturnValue(mockUpdateReturn);

    // WHEN
    const actualResult = await resumesService.update({
      id,
      authorId,
      title,
      content,
    });

    // THEN
    const expectedResult = mockUpdateReturn;

    expect(mockResumesRepository.readOne).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.readOne).toHaveBeenCalledWith({
      id,
      authorId,
    });

    expect(mockResumesRepository.update).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.update).toHaveBeenCalledWith({
      id,
      authorId,
      title,
      content,
    });
    expect(actualResult).toEqual(expectedResult);
  });

  test('update Method - 이력서 없는 경우', async () => {
    // GIVEN
    const id = '1';
    const authorId = 1;
    const title = '슈퍼 튼튼한 개발자 스파르탄';
    const content =
      '아주 그냥 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.';
    const mockReadOneReturn = null;
    const mockUpdateReturn = {
      ...dummyResumes[+id],
      title,
      content,
    };
    mockResumesRepository.readOne.mockReturnValue(mockReadOneReturn);
    mockResumesRepository.update.mockReturnValue(mockUpdateReturn);

    // WHEN
    try {
      await resumesService.update({
        id,
        authorId,
        title,
        content,
      });
    } catch (error) {
      // THEN
      expect(mockResumesRepository.readOne).toHaveBeenCalledTimes(1);
      expect(mockResumesRepository.readOne).toHaveBeenCalledWith({
        id,
        authorId,
      });

      expect(error).toEqual(
        new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND),
      );
    }
  });

  test('delete Method', async () => {
    // GIVEN
    const id = '1';
    const authorId = 1;
    const mockReadOneReturn = dummyResumes[+id];
    const mockDeleteReturn = {
      id: dummyResumes[+id],
    };
    mockResumesRepository.readOne.mockReturnValue(mockReadOneReturn);
    mockResumesRepository.delete.mockReturnValue(mockDeleteReturn);

    // WHEN
    const actualResult = await resumesService.delete({
      id,
      authorId,
    });

    // THEN
    const expectedResult = mockDeleteReturn;

    expect(mockResumesRepository.readOne).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.readOne).toHaveBeenCalledWith({
      id,
      authorId,
    });

    expect(mockResumesRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.delete).toHaveBeenCalledWith({
      id,
      authorId,
    });
    expect(actualResult).toEqual(expectedResult);
  });

  test('delete Method - 이력서 없는 경우', async () => {
    // GIVEN
    const id = '1';
    const authorId = 1;
    const mockReadOneReturn = null;
    const mockDeleteReturn = {
      id: dummyResumes[+id],
    };
    mockResumesRepository.readOne.mockReturnValue(mockReadOneReturn);
    mockResumesRepository.delete.mockReturnValue(mockDeleteReturn);

    // WHEN
    try {
      await resumesService.delete({
        id,
        authorId,
      });
    } catch (error) {
      // THEN
      expect(mockResumesRepository.readOne).toHaveBeenCalledTimes(1);
      expect(mockResumesRepository.readOne).toHaveBeenCalledWith({
        id,
        authorId,
      });
      expect(error).toEqual(
        new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND),
      );
    }
  });
});
