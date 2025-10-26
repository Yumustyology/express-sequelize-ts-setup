import { Op } from "sequelize";
import { BaseRepository } from "./base.repository.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export class UserRepository extends BaseRepository<InstanceType<typeof User>> {
  constructor() {
    super(User);
  }

  async searchUsers(query?: { q?: string; limit?: number; offset?: number }) {
    const where = query?.q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${query.q}%` } },
            { email: { [Op.like]: `%${query.q}%` } },
          ],
        }
      : undefined;

    return this.findAll({
      where,
      limit: query?.limit,
      offset: query?.offset,
    });
  }

  async findByIdWithPosts(id: number) {
    const instance = await User.findByPk(id, {
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
        },
      ],
    });

    return instance ? instance.get({ plain: true }) : null;
  }
}