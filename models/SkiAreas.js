import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import regexPatterns from '../utils/validators/patterns.js';
import printDbUpdate from '../utils/helpers/printDbUpdate.js';

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
  createdAt: { type: Date, default: Date.now, immutable: false},
  modifiedAt: { type: Date, default: Date.now }
});

SkiAreaSchema.plugin(uniqueValidator);

// Update the 'modifiedAt' field before saving or updating the document
SkiAreaSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

// Print a message after saving or updating the document
SkiAreaSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
  if (this.getOptions().disablePrint) return;
	printDbUpdate('Ski area', doc._id);
});

const SkiAreaModel = model('ski-area', SkiAreaSchema);
export default SkiAreaModel;