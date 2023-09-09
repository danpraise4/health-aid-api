import { Schema } from 'mongoose';

const auditableFields = {
  /**
   * We excluded createdAt and updatedAt because we are already passing
   * the timestamp option at the schema level.
   */
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
};

export default auditableFields;
