import { constants } from 'http2';
import { CustomError } from './custom-error';

class NotFoundError extends CustomError {
  public statusCode:number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

export default NotFoundError;
