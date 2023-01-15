import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: 'string',
    required: [true, 'please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: 'string',
    required: [true, 'please provide password'],
    minlength: 6,
  },
  lastName: {
    type: 'string',
    maxlength: 20,
    trim: true,
    default: 'lastName',
  },
  location: {
    type: 'string',
    maxlength: 20,
    trim: true,
    default: 'my city',
  },
});

// create 'User' collection in mongodb using UserSchema
export default mongoose.model('User', UserSchema);
