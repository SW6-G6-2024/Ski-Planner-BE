import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import regexPatterns from '../utils/validators/patterns.js';

const SkiAreaSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
  },
  website: {
    type: String,
    validate: {
      validator: function (v) {
        return regexPatterns.website.test(v);
      },
      message: '{VALUE} is not a valid website URL'
    },
    required: false
  },
  bounds: {
    type: [
      {
        type: Number,
        required: [true, 'Bounds are required'],
      }
    ],
    validate: {
      validator: function (v) {
        return v.length === 4;
      },
      message: 'Invalid bounds array (length must be 4)'
    }
  },
  modifiedAt: { type: Date, default: Date.now }
});

SkiAreaSchema.plugin(uniqueValidator);

const SkiAreaModel = model('ski-area', SkiAreaSchema);
export default SkiAreaModel;