export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create = async ({ authorId, title, content }) => {
    const data = await this.prisma.resume.create({
      data: {
        authorId,
        title,
        content,
      },
    });

    return data;
  };
  readMany = async ({ authorId, sort }) => {
    let data = await this.prisma.resume.findMany({
      where: { authorId },
      orderBy: {
        createdAt: sort,
      },
      include: {
        author: true,
      },
    });

    data = data.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });

    return data;
  };
  readOne = async ({ id, authorId, includeAuthor = false }) => {
    let data = await this.prisma.resume.findUnique({
      where: { id: +id, authorId },
      include: { author: includeAuthor },
    });

    if (includeAuthor) {
      data = {
        id: data.id,
        authorName: data.author.name,
        title: data.title,
        content: data.content,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }

    return data;
  };

  update = async ({ id, authorId, title, content }) => {
    const data = await this.prisma.resume.update({
      where: { id: +id, authorId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    return data;
  };

  delete = async ({ id, authorId }) => {
    const data = await this.prisma.resume.delete({
      where: { id: +id, authorId },
    });

    return { id: data.id };
  };
}
