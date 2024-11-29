import { NextFunction, Request, Response } from "express";
import { constants } from 'http2';
import { CustomError } from "../errors/custom-error";
import { serverErrors } from "../errors/server";

export default (err: CustomError, _req:Request, res:Response, _next:NextFunction) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
    ? serverErrors[500] : err.message;
  res.status(statusCode).send({ message });
  // if (err instanceof CustomError) {
  //   const { statusCode, message, logging } = err;
  //   if (logging) {
  //     console.error(JSON.stringify({
  //       code: err.statusCode,
  //       errors: err.errors,
  //       stack: err.stack,
  //     }, null, 2));
  //   }
  //   res.status(statusCode).send({ message });
  //   return;
  // }

  // console.error(JSON.stringify(err, null, 2));
  // res.status(500).send({ errors: [{ message: serverErrors[500] }] });
};
