import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../models/user";
import { BadRequestError } from "../middlewares/BadRequest";
import { userErrors } from "../errors/user";
import { serverErrors } from "../errors/server";
import { authErrors } from "../errors/auth";
import { AuthContext } from "../types";

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    next(new BadRequestError({ code: 500, message: serverErrors[500], context: [error] }));
  }
};

export const getUser = async (_req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  try {
    const user = await UserModel.findById(res.locals.user?._id!);
    res.json(user);
  } catch (error) {
    next(new BadRequestError({ code: 500, message: serverErrors[500], context: [error] }));
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
      next(new BadRequestError({ code: 404, message: userErrors[404] }));
    }
    res.json(user);
  } catch (error) {
    next(new BadRequestError({ code: 500, message: serverErrors[500], context: [error] }));
  }
};

export const patchUser = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const updates = req.body;
    const userId = res.locals.user?._id;
    if (!updates || Object.keys(updates).length === 0) {
      next(new BadRequestError({ code: 400, message: userErrors[400] }));
      return;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, // ID текущего пользователя
      updates,
      { new: true, runValidators: true }, // new: true возвращает обновленный документ
    );

    if (!updatedUser) {
      next(new BadRequestError({ code: 404, message: userErrors[404] }));
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    next(new BadRequestError({ code: 500, message: serverErrors[500], context: [error] }));
  }
};

export const patchUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,

) => {
  try {
    if (!req.body.avatar) {
      next(new BadRequestError({ code: 400, message: userErrors[400] }));

      return;
    }
    const { avatar } = req.body;
    const userId = (req as any).user._id;
    if (!userId || Object.keys(avatar).length === 0 || !avatar) {
      next(new BadRequestError({ code: 400, message: userErrors[400] }));

      return;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, // ID текущего пользователя
      { avatar },
      { new: true, runValidators: true }, // new: true возвращает обновленный документ
    );
    if (!updatedUser) {
      res.status(404).json({ message: userErrors[404] });
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    next(new BadRequestError({ code: 500, message: serverErrors[500], context: [error] }));
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
      next(new BadRequestError({ code: 409, message: authErrors[409] }));
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        email, password: hashPassword, name, about, avatar,
      });
      await newUser.save();
      res.status(201).json({ user: newUser });
    }
  } catch (error) {
    next(new BadRequestError({
      code: 401, message: authErrors[401], logging: true, context: [error],
    }));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 3600 });
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send({ token });
  } catch (error) {
    if (error instanceof Error) {
      next(new BadRequestError({ code: 401, message: error.message, context: [error] }));
    }

    next(new BadRequestError({ code: 401, message: serverErrors[401], context: [error] }));
  }
};
