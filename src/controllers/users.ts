import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../models/user";
import { userErrors } from "../errors/user";
import { serverErrors } from "../errors/server";
import { AuthContext } from "../types";
import UnauthorizedError from "../errors/unauthorized-error";
import NotFoundError from "../errors/not-found-error";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(res.locals.user._id);
    res.json(user);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      next(new NotFoundError(userErrors[404]));
    } else {
      next(error);
    }
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.params.id;
    const user = await UserModel.findById(userID);
    if (!user) {
      next(new NotFoundError(userErrors[404]));
    }
    res.json(user);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      next(new NotFoundError(userErrors[404]));
    } else {
      next(error);
    }
  }
};

export const patchUser = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { name, about } = req.body;
    const userId = res.locals.user?._id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, // ID текущего пользователя
      { name, about },
      { new: true, runValidators: true }, // new: true возвращает обновленный документ
    );

    if (!updatedUser) {
      next(new BadRequestError(userErrors[404]));
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      next(new BadRequestError(userErrors[400]));
    } else {
      next(error);
    }
  }
};

export const patchUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,

) => {
  try {
    const { avatar } = req.body;
    const userId = res.locals.user._id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, // ID текущего пользователя
      { avatar },
      { new: true, runValidators: true }, // new: true возвращает обновленный документ
    );
    if (!updatedUser) {
      next(new NotFoundError(userErrors[404]));
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      next(new BadRequestError(userErrors[400]));
    } else {
      next(error);
    }
  }
};

export const createUser = async (
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction,
) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      next(new ConflictError(userErrors[409]));
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        email, password: hashPassword, name, about, avatar,
      });
      await newUser.save();
      res.status(201).json({ user: newUser });
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      next(new BadRequestError(userErrors[400]));
    } else {
      next(error);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 3600 });
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send({ token });
  } catch (error) {
    next(new UnauthorizedError(serverErrors[401]));
  }
};
