import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumesController } from '../../../src/controllers/resumes.controller.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { RESUME_STATUS } from '../../../src/constants/resume.constant.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockResumesService = {
  create: jest.fn(),
  readMany: jest.fn(),
  readOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRequest = {
  user: jest.fn(),
  body: jest.fn(),
  query: jest.fn(),
  params: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const resumesController = new ResumesController(mockResumesService);

describe('ResumesController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('create Method', async () => {
    // GIVEN
    const { title, content } = dummyResumes[0];
    const mockUser = dummyUsers[1];
    const authorId = mockUser.id;
    const mockBody = { title, content };
    const mockReturn = {
      id: 100,
      authorId,
      title,
      content,
      status: RESUME_STATUS.APPLY,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRequest.user = mockUser;
    mockRequest.body = mockBody;
    mockResumesService.create.mockReturnValue(mockReturn);

    // WHEN
    await resumesController.create(mockRequest, mockResponse, mockNext);

    // THEN
    const expectedJsonCalledWith = {
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data: mockReturn,
    };

    expect(mockResumesService.create).toHaveBeenCalledTimes(1);
    expect(mockResumesService.create).toHaveBeenCalledWith({
      authorId,
      title,
      content,
    });

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
  });

  test('readMany Method', async () => {
    // GIVEN
    const mockUser = dummyUsers[1];
    const sort = 'asc';
    const mockQuery = { sort };
    const authorId = mockUser.id;
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

    mockRequest.user = mockUser;
    mockRequest.query = mockQuery;
    mockResumesService.readMany.mockReturnValue(mockReturn);

    // WHEN
    await resumesController.readMany(mockRequest, mockResponse, mockNext);

    // THEN
    const expectedJsonCalledWith = {
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data: mockReturn,
    };

    expect(mockResumesService.readMany).toHaveBeenCalledTimes(1);
    expect(mockResumesService.readMany).toHaveBeenCalledWith({
      authorId,
      sort,
    });

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
  });

  test('readOne Method', async () => {
    // GIVEN
    const mockUser = dummyUsers[1];
    const id = '1';
    const authorId = mockUser.id;
    const mockParams = { id };
    let mockReturn = dummyResumes[+id];
    mockReturn = {
      ...mockReturn,
      authorName: mockReturn.author.name,
      authorId: undefined,
      author: undefined,
    };

    mockRequest.user = mockUser;
    mockRequest.params = mockParams;
    mockResumesService.readOne.mockReturnValue(mockReturn);

    // WHEN
    await resumesController.readOne(mockRequest, mockResponse, mockNext);

    // THEN
    const expectedJsonCalledWith = {
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data: mockReturn,
    };

    expect(mockResumesService.readOne).toHaveBeenCalledTimes(1);
    expect(mockResumesService.readOne).toHaveBeenCalledWith({
      authorId,
      id,
    });

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
  });

  test('update Method', async () => {
    // GIVEN
    const mockUser = dummyUsers[1];
    const id = '1';
    const authorId = mockUser.id;
    const title = '슈퍼 튼튼한 개발자 스파르탄';
    const content =
      '아주 그냥 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.';
    const mockParams = { id };
    const mockBody = {
      title,
      content,
    };
    const mockReturn = {
      ...dummyResumes[+id],
      title,
      content,
    };

    mockRequest.user = mockUser;
    mockRequest.params = mockParams;
    mockRequest.body = mockBody;
    mockResumesService.update.mockReturnValue(mockReturn);

    // WHEN
    await resumesController.update(mockRequest, mockResponse, mockNext);

    // THEN
    const expectedJsonCalledWith = {
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data: mockReturn,
    };

    expect(mockResumesService.update).toHaveBeenCalledTimes(1);
    expect(mockResumesService.update).toHaveBeenCalledWith({
      id,
      authorId,
      title,
      content,
    });

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
  });

  test('delete Method', async () => {
    // GIVEN
    const mockUser = dummyUsers[1];
    const authorId = mockUser.id;
    const id = '1';
    const mockParams = { id };
    const mockReturn = {
      id: dummyResumes[+id].id,
    };

    mockRequest.user = mockUser;
    mockRequest.params = mockParams;
    mockResumesService.delete.mockReturnValue(mockReturn);

    // WHEN
    await resumesController.delete(mockRequest, mockResponse, mockNext);

    // THEN
    const expectedJsonCalledWith = {
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: mockReturn,
    };

    expect(mockResumesService.delete).toHaveBeenCalledTimes(1);
    expect(mockResumesService.delete).toHaveBeenCalledWith({
      id,
      authorId,
    });

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
  });
});
