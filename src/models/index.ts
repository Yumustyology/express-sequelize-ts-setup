import { sequelize } from "../config/database.js";
import Post from "./post.model.js";
import User from "./user.model.js";
const models = {
  User,
  Post,
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

const db = {
  sequelize,
  ...models,
};

export default db;
