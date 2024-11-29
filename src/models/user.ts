import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
// TS-интерфейс модели User
export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModelInt extends mongoose.Model<IUser>{
  findUserByCredentials: (_email: string, _password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema: Schema<IUser, UserModelInt> = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator(v) {
        const avatarRegex = /^(https?:\/\/)(www)?(?!www\.)([a-zA-Z0-9.-]+)(\.[a-z]{2,6})(\/[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+,;=]*)?(#[a-zA-Z0-9._~:\-/?#[\]@!$&'()*+,;=]*)?$/;
        return avatarRegex.test(v);
      },
      message: (props) => `${props.value} невалидный URL аватара`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Неверный формат Email"],
  },
});

userSchema.static('findUserByCredentials', function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    // не нашёлся — отклоняем промис
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    // нашёлся — сравниваем хеши
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user; // теперь user доступен
    });
  });
});

export const UserModel = mongoose.model<IUser, UserModelInt>("user", userSchema);
