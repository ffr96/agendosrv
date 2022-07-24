import mongoose from 'mongoose';
import { Patient } from '../@types/Patient';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  dni: {
    type: String,
    required: true,
    unique: true
  },
  meeting: [{
    inDate: {
      type: Date,
      required: true
    },
    outDate: {
      type: Date,
      required: true
    },
    meetingType: {
      type: String,
      required: true,
      enum: ['videollamada','presencial']
    },
    meetingLocation: {
      type: String,
      required: true,
      enum: ['colon','cdu']
    }
  }]
});

patientSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    delete returnedObj.__v;
  }
});

const mPatient = mongoose.model<Patient>('Patient', patientSchema);

export default mPatient;