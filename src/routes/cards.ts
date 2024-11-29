import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, deleteCardById, deleteLike, getCardById, getCards, putLike,
} from '../controllers/cards';
import auth from '../middlewares/auth';
import protectCard from '../middlewares/protectCard';

const router = Router();

router.get('/', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getCards);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(),
  }),
}), auth, getCardById);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(),
  }),
}), auth, protectCard, deleteCardById);

router.post('/', auth, celebrate({
  body: Joi.object().keys({
    link: Joi.string().required(),
    name: Joi.string().required(),
  }).unknown(true),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), createCard);

router.put('/:id/likes', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(),
  }),
}), auth, putLike);

router.delete('/:id/likes', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(),
  }),
}), auth, deleteLike);

export default router;
