import { StatusCodes } from 'http-status-codes';

class ClientError extends Error {
  constructor(error) {
    super();
    this.name = 'ClientError';
    this.explanation = error.explanation;
    this.message = error.message;
    this.statusCode = error.statusCode
      ? error.statusCode
      : StatusCodes.BAD_REQUEST;
  }
}

export default ClientError;
