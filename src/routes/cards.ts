import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, deleteLike, getCardById, getCards, putLike,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.get('/:id', getCardById);

router.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required(),
    name: Joi.string().required(),
  }).unknown(true),
}), createCard);

router.put('/:id/likes', putLike);

router.delete('/:id/likes', deleteLike);

export default router;
