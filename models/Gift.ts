
import mongoose from 'mongoose';

const GiftSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['romantic', 'friendship', 'family', 'professional'],
    required: true
  },
  uniqueCode: {
    type: String,
    unique: true,
    required: true
  },
  message: String,
  status: {
    type: String,
    enum: ['generated', 'sent', 'opened'],
    default: 'generated'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Gift || mongoose.model('Gift', GiftSchema);