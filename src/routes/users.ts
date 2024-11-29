import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUser,
  getUserById, getUsers,
  patchUser,
  patchUserAvatar,
} from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getUsers);

router.get('/me', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getUser);

router.get('/:id', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getUserById);

router.patch('/me', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, patchUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), patchUserAvatar);

export default router;
