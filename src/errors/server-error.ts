import { constants } from 'http2';
import { CustomError } from './custom-error';

class ServerError extends CustomError {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

export default ServerError;
