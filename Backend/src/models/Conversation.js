import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema],
  context:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

conversationSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('Conversation', conversationSchema);
