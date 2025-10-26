import { Request, Response } from "express";
import { ApiResponse } from "../utils/response.js";
import db from "../models/index.js";

const { Post, User } = db;

export async function getUserPosts(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  
  const user = await User.findByPk(userId, {
    include: [{
      model: Post,
      as: 'posts'
    }]
  });
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  return ApiResponse.success(res, 'Posts retrieved', user);
}

export async function getPostWithAuthor(req: Request, res: Response) {
  const postId = Number(req.params.id);
  
  const post = await Post.findByPk(postId, {
    include: [{
      model: User,
      as: 'author'
    }]
  });
  
  if (!post) {
    return ApiResponse.notFound(res, 'Post not found');
  }
  
  return ApiResponse.success(res, 'Post retrieved', post);
}

