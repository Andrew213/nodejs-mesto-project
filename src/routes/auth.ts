import {
  Router,
} from "express";
import { celebrate, Joi } from "celebrate";
import { createUser, login } from "../controllers/users";

const router = Router();

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

export default router;
