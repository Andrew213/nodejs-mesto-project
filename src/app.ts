import express, {
  Express,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";
import { errors } from "celebrate";
import cors from "cors";
import errorHandler from './middlewares/errors';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import { errorLogger, requestLogger } from "./middlewares/logger";
import { serverErrors } from "./errors/server";

const server: Express = express();
const port = 3000;

server.use(cors());
server.use(express.json());

server.use(requestLogger);

server.use('/cards', cardsRouter);
server.use('/users', userRouter);
server.use(authRouter);

server.use((_req: Request, res: Response) => {
  res.status(404).json({ message: serverErrors[404] });
});
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
