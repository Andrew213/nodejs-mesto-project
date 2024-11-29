import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const cardSchema: Schema<ICard> = new Schema({
  name: {
    type: Schema.Types.String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: Schema.Types.String,
    required: true,
    validate: {
      validator(v) {
        const avatarRegex = /^(https?:\/\/)(www)?(?!www\.)([a-zA-Z0-9.-]+)(\.[a-z]{2,6})(\/[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+,;=]*)?(#[a-zA-Z0-9._~:\-/?#[\]@!$&'()*+,;=]*)?$/;
        return avatarRegex.test(v);
      },
      message: (props) => `${props.value} невалидный URL`,
    },
  },
  owner: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export const CardsModel = mongoose.model<ICard>('card', cardSchema);
