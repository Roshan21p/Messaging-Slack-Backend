import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/userRepository.js';
import { createJWT } from '../utils/common/authUtils.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const signUpService = async (data) => {
  try {
    const newUser = await userRepository.create(data);
    return newUser;
  } catch (error) {
    console.log('User service error:', error);

    // Handle duplicate key errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.log('Duplicate key error detected!');
      throw new ValidationError(
        {
          error: ['A user with the same email or username already exists']
        },
        'A user with the same email or username already exists'
      );
    }

    if (error.name === 'ValidationError') {
      console.log('Validation error details:', error.errors);

      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    throw error;
  }
};

export const signInService = async (data) => {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'No registered user found with this email',
        statusCodes: StatusCodes.NOT_FOUND
      });
    }

    // match the incoming password with the hashed password in the database
    const isMatch = bcrypt.compareSync(data.password, user.password);

    if (!isMatch) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Invalid password, please try again',
        statusCodes: StatusCodes.BAD_REQUEST
      });
    }

    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
      token: createJWT({ id: user._id, email: user.email })
    };
  } catch (error) {
    console.log('User service error:', error);
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const user = await userRepository.getByUsername(username);

    if (!user) {
      throw new ClientError({
        explanation: 'User not found',
        message: `No user found with username: ${username}`,
        statusCodes: StatusCodes.NOT_FOUND
      });
    }

    return user;
  } catch (error) {
    console.log('User service error:', error);
    throw error;
  }
};

export const fetchAllUserService = async () => {
  try {
    const user = await userRepository.getAll();

    if (!user) {
      throw new ClientError({
        explanation: 'User not found',
        message: `No user found in the database`,
        statusCodes: StatusCodes.NOT_FOUND
      });
    }

    return user;
  } catch (error) {
    console.log('User service error:', error);
    throw error;
  }
};
