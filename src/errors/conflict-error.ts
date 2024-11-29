import { constants } from 'http2';
import { CustomError } from './custom-error';

class ConflictError extends CustomError {
  public statusCode: number;

  constructor(message:string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

export default ConflictError;
