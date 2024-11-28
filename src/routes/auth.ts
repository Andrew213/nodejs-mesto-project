import {
  Router,
} from "express";
import { celebrate, Joi } from "celebrate";
import { signIn, signUp } from "../controllers/auth";

const router = Router();

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required(),
      email: Joi.string().required(),
    }).unknown(true),
  }),
  signUp,
);
router.post('/signin', signIn);

export default router;
