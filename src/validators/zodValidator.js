import { StatusCodes } from 'http-status-codes';

import { customErrorResponse } from '../utils/common/responseObjects.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      console.log('validation error in zod validator', error.errors);
      let explanation = [];
      let errorMessage = '';
      error.errors.forEach((key) => {
        explanation.push(key.message);
        errorMessage += key.message;
      });
      console.log('error message', errorMessage);

      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: errorMessage,
          explanation: explanation
        })
      );
    }
  };
};
