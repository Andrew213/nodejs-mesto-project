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
  }),
}), auth, getCards);

router.get('/:id', auth, getCardById);

router.delete('/:id', auth, protectCard, deleteCardById);

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
  }),
}), auth, putLike);

router.delete('/:id/likes', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
}), auth, deleteLike);

export default router;
