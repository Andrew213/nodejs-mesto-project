import { NextFunction, Request, Response } from "express";
import { CustomError } from "./customError";
import { serverErrors } from "../errors/server";

export default (err:Error, _req:Request, res:Response, _next:NextFunction) => {
  if (err instanceof CustomError) {
    const { statusCode, message, logging } = err;
    if (logging) {
      console.error(JSON.stringify({
        code: err.statusCode,
        errors: err.errors,
        stack: err.stack,
      }, null, 2));
    }
    res.status(statusCode).send({ message });
    return;
  }

  console.error(JSON.stringify(err, null, 2));
  res.status(500).send({ errors: [{ message: serverErrors[500] }] });
};
