import type { FilterQuery } from "mongoose";

import { UserCollection, type User, type UserDocument } from "../database/models/user.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const createUser = (userData: User) => {
  return UserCollection.create(userData);
};

export const getUserByCognito = async (cognitoSub: string): Promise<UserDocument> => {
  const user = await UserCollection.findOne({ cognitoSub });

  if (!user) {
    throw new Error("User not found!");
  }

  return user;
};

export type UserQueryFilters = Partial<Pick<User, "nickname" | "cognitoSub">>;

export type UserQueryOptions = UserQueryFilters & {
  page?: number;
  perPage?: number;
  sort?: Record<string, 1 | -1>;
};

export const getAllUsers = async ({
  page = 1,
  perPage = 10,
  sort = { _id: -1 },
  ...filters
}: UserQueryOptions) => {
  const offset = (page - 1) * perPage;

  const query: FilterQuery<User> = {};
  if (filters.nickname) {
    query.nickname = { $regex: filters.nickname, $options: "i" };
  }
  if (filters.cognitoSub) {
    query.cognitoSub = filters.cognitoSub;
  }

  try {
    const totalUsers = await UserCollection.countDocuments(query);
    const usersList = await UserCollection.find(query)
      .sort(sort)
      .skip(offset)
      .limit(perPage);

    const paginationInfo = calculatePaginationData(totalUsers, page, perPage);

    return {
      ...paginationInfo,
      users: usersList,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error fetching users: " + message);
  }
};

export const getUserById = async (userId: string) => {
  try {
    return await UserCollection.findById(userId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error fetching user: " + message);
  }
};

export const updateUserById = async (userId: string, data: Partial<User>) => {
  try {
    return await UserCollection.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error updating user: " + message);
  }
};

export const deleteUserById = async (userId: string) => {
  try {
    return await UserCollection.findByIdAndDelete(userId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error deleting user: " + message);
  }
};
