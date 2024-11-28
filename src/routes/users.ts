import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser,
  getUserById, getUsers,
  patchUser,
  patchUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
    avatar: Joi.string().required(),
  }),
}), createUser);

router.patch('/me', patchUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), patchUserAvatar);

export default router;
