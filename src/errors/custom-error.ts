export type CustomErrorContent = {
  message: string,
  context?: { [key: string]: any }
};

export abstract class CustomError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
