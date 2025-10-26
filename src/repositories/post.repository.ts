import { Op } from "sequelize";
import { BaseRepository } from "./base.repository.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export class PostRepository extends BaseRepository<InstanceType<typeof Post>> {
  constructor() {
    super(Post);
  }

  async findAllWithAuthor(options?: {
    where?: any;
    limit?: number;
    offset?: number;
  }) {
    const { where, limit, offset } = options || {};

    const instances = await Post.findAll({
      where,
      limit: limit ?? this.defaultLimit,
      offset: offset ?? this.defaultOffset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return instances.map((instance: any) => instance.get({ plain: true }));
  }

  async findByIdWithAuthor(id: number) {
    const instance = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return instance ? instance.get({ plain: true }) : null;
  }

  async findByUserId(userId: number, options?: { limit?: number; offset?: number }) {
    return this.findAllWithAuthor({
      where: { userId },
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  async searchPosts(query?: { q?: string; userId?: number; limit?: number; offset?: number }) {
    const where: any = {};

    if (query?.q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query.q}%` } },
        { content: { [Op.like]: `%${query.q}%` } },
      ];
    }

    if (query?.userId) {
      where.userId = query.userId;
    }

    return this.findAllWithAuthor({
      where,
      limit: query?.limit,
      offset: query?.offset,
    });
  }
}