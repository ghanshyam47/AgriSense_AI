import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['weather', 'pest', 'market'], required: true },
  severity:   { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  title:      { type: String, required: true },
  message:    { type: String, required: true },
  actionable: { type: String },
  read:       { type: Boolean, default: false },
  expiresAt:  { type: Date },
}, { timestamps: true });

alertSchema.index({ userId: 1, read: 1, createdAt: -1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.model('Alert', alertSchema);
