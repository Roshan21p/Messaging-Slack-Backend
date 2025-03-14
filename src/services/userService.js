import userRepository from '../repositories/userRepository.js';
import ValidationError from '../utils/errors/validationError.js';

export const signUpService = async (data) => {
  try {
    const newUser = await userRepository.create(data);
    return newUser;
  } catch (error) {
    console.log('User service error:', error); 

    // Handle duplicate key errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
        console.log("Duplicate key error detected!");
        throw new ValidationError(
            {
                error: ['A user with the same email or username already exists'],
            },
            'A user with the same email or username already exists'
        );
    }

    if (error.name === 'ValidationError') {
        console.log("Validation error details:", error.errors); 

      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
  }
};
