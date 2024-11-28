import express, {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose, { Types } from "mongoose";
import { errors } from "celebrate";
import cors from "cors";
import errorHandler from './middlewares/errors';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';
// import authRouter from './routes/auth';
import { errorLogger, requestLogger } from "./middlewares/logger";

const server: Express = express();
const port = 5000;

server.use(cors());
server.use(express.json());

export interface CustomRequest extends Request{
  user?: {_id: Types.ObjectId | string}
}
server.use((req: CustomRequest, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '674845975d2ed0e7be2aca65', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

server.use(requestLogger);

server.use('/cards', cardsRouter);
server.use('/users', userRouter);

server.use(errorLogger); // Порядок важен!
server.use(errors());

// server.use(authRouter);
server.use(errorHandler);
mongoose
  .connect("mongodb://localhost:27017/mestodb")
  .then(async () => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
