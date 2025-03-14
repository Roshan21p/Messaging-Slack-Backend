import { StatusCodes } from 'http-status-codes';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/serverConfig';
import userRepository from '../repositories/userRepository';
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObjects';

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
        customErrorResponse({
          explanation:
            'Authorization token is missing. Please log in to obtain a valid token.',
          message: 'No auth token provided. Please log in again.'
        })
      );
    }

    const response = jwt.verify(token, JWT_SECRET);

    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'Invalid auth token provided'
        })
      );
    }

    const user = await userRepository.getById(response.id);
    req.user = user.id;
    next();
  } catch (error) {
    console.log('Auth middleware error', error);
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      const isTokenExpired = error.name === 'TokenExpiredError';
      const message = isTokenExpired
        ? 'Auth token expired. Please log in again.'
        : 'Invalid auth token provided. Please try logging in again.';
      const explanation = isTokenExpired
        ? 'The authentication token has expired and is no longer valid.'
        : 'The provided authentication token is either malformed or invalid.';

      return res
        .status(StatusCodes.FORBIDDEN)
        .json(customErrorResponse({ explanation, message }));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
