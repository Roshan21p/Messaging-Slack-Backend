import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
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
      unique: true,
      minLength: [3, 'Username must be at least 3 characters'],
      match: [/^[a-z]+$/, 'Username must contain only lowercase letters']
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function saveUser(next) {
  if (this.isNew) {
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const hashPassword = bcrypt.hashSync(user.password, SALT);
    user.password = hashPassword;
    user.avatar = `https://robohash.org/${user.username}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
