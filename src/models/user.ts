import mongoose, { Schema, Document } from "mongoose";
// import bcrypt from "bcryptjs";
// TS-интерфейс модели User
export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  // email: string;
  // password: string;
}

interface UserModelInt extends mongoose.Model<IUser>{
  findUserByCredentials: (_email: string, _password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema: Schema<IUser, UserModelInt> = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
});

// userSchema.static('findUserByCredentials', function (email, password) {
//   return this.findOne({ email }).then((user) => {
//     // не нашёлся — отклоняем промис
//     if (!user) {
//       return Promise.reject(new Error('Неправильные почта или пароль'));
//     }

//     // нашёлся — сравниваем хеши
//     return bcrypt.compare(password, user.password).then((matched) => {
//       if (!matched) {
//         return Promise.reject(new Error('Неправильные почта или пароль'));
//       }

//       return user; // теперь user доступен
//     });
//   });
// });

export const UserModel = mongoose.model<IUser, UserModelInt>("user", userSchema);
