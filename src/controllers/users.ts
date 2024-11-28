import { NextFunction, Request, Response } from "express";
import { IUser, UserModel } from "../models/user";
import { CustomRequest } from "../app";
import { BadRequestError } from "../middlewares/BadRequest";
import { userErrors } from "../errors/user";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find();
  res.json(users);
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const userID = req.params.id;
  const user = await UserModel.findById(userID);
  if (!user) {
    next(new BadRequestError({ code: 404, message: userErrors[404] }));
  }
  res.json(user);
};

export const createUser = async (
  req: Request<any, any, IUser>,
  res: Response,
) => {
  const {
    name, about, avatar,
  } = req.body;

  // const hashPassword = await bcrypt.hash(password, 10);
  const user = new UserModel({
    name,
    about,
    avatar,
  });
  await user.save();

  res.status(201).json({
    _id: user._id,
  });
};

export const patchUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const updates = req.body;
  const userId = req.user?._id;
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
};

export const patchUserAvatar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,

) => {
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
};