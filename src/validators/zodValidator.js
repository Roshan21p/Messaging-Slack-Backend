import { StatusCodes } from 'http-status-codes';

import { customErrorResponse } from '../utils/common/responseObjects.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      console.log('Zod validation error:', error.errors);

      if (error.errors && Array.isArray(error.errors)) {
        const explanation = error.errors.map((err) => {
          const field = err.path.join('.');
          return `${field} is ${err.message}`;
        });

        const errorMessage = explanation.join(', '); // Combine all into one string

        return res.status(StatusCodes.BAD_REQUEST).json(
          customErrorResponse({
            message: errorMessage, // e.g., "email is Required, password is Required"
            explanation: explanation
          })
        );
      }

      // If something else went wrong
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        customErrorResponse({
          message: 'Internal Server Error',
          explanation: [error.message]
        })
      );
    }
  };
};
