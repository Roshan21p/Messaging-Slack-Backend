import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username already exists'],
      minLength: [3, 'Username must be at least 3 characters'],
      match: [
        /^[a-zA-Z0-9]+$/,
        'Username must contain only letters and numbers'
      ]
    },
    avatar: {
      type: String
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function saveUser(next) {
    const user = this;
    user.avatar = `https://robohash.org/${user.username}`;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;