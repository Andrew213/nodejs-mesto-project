import { constants } from 'http2';
import { CustomError } from './custom-error';

class BadRequestError extends CustomError {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

export default BadRequestError;
