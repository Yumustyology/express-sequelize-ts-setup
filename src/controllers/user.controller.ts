import { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { ApiResponse } from "../utils/response.js";

export async function createUserHandler(req: Request, res: Response) {
  const user = await userService.create(req.body);
  return ApiResponse.created(res, 'User created successfully', user);
}

export async function listUsersHandler(req: Request, res: Response) {
  const { q, limit, offset } = req.query as Record<string, string>;
  const users = await userService.list({
    q,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });
  return ApiResponse.success(res, 'Users retrieved successfully', users);
}

export async function getUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await userService.findById(id);
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  return ApiResponse.success(res, 'User retrieved successfully', user);
}

export async function getUserWithPostsHandler(req: Request, res: Response) {
  const userId = Number(req.params.id);
  
  const user = await userService.findByIdWithPosts(userId);
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  return ApiResponse.success(res, 'User with posts retrieved successfully', user);
}

export async function updateUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await userService.update(id, req.body);
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  return ApiResponse.success(res, 'User updated successfully', user);
}

export async function deleteUserHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const deleted = await userService.delete(id);
  
  if (!deleted) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  return ApiResponse.noContent(res);
}